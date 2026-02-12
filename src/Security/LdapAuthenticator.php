<?php

namespace App\Security;

use App\Entity\User; //
use App\Repository\UserRepository; //
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface; //
use Symfony\Component\Ldap\LdapInterface; //
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport; //suppress unused
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;
use Doctrine\ORM\EntityManagerInterface; //
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface; //
use Symfony\Component\Security\Core\Exception\BadCredentialsException;//
use Symfony\Component\Ldap\Exception\InvalidCredentialsException; //
use Symfony\Component\Ldap\Exception\ConnectionException; //
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\RememberMeBadge; //

/**
 * @see https://symfony.com/doc/current/security/custom_authenticator.html
 */
class LdapAuthenticator extends AbstractAuthenticator
{
    private const LOGIN_ROUTE = 'app_login';

    /** 
     * En symfony 8+, on peut déclarer les dépendances du service directement dans le constructeur.
     * crée automatiquement les propriétés de la classe et les initialise avec les valeurs injectées.
    */                   
    public function __construct(
        private LdapInterface $ldap, 
        private UrlGeneratorInterface $urlGenerator, 
        private UserRepository $userRepository, 
        private EntityManagerInterface $em,
        private ParameterBagInterface $params
    ) {}

    /**
     * Appelé à chaque demande pour décider si  authenticate() doit être
     * Utilisé pour la demande. Si false est retourné alors authenticate()
     * est ignoré
     */
    public function supports(Request $request): ?bool
    {
        $isSupported = $request->attributes->get(key: '_route') === self::LOGIN_ROUTE && $request->isMethod('POST'); 
        
        error_log(message: "supports() called, returning: " . ($isSupported ? 'true' : 'false'));

        return $isSupported;
    }

    public function authenticate(Request $request): SelfValidatingPassport
    {
        error_log(message: "authenticate() method entered");

        $username = $request->request->get('username');
        $password = $request->request->get('password');

        $ldapHost = $this->params->get('ldap_host');
        $ldapPort = $this->params->get('ldap_port');
        $ldapBaseDn = $this->params->get('ldap_baseDn');
        $ldapIdentifier = $this->params->get('ldap_searchId_dn');
        $ldapPassword = $this->params->get('ldap_searchPassword');
        $ldapDomain = $this->params->get('ldap_domain');

        error_log("Debug LDAP - Host: $ldapHost, Port: $ldapPort, BaseDn: $ldapBaseDn");
        error_log("Debug LDAP - Identifier: $ldapIdentifier, Domain: $ldapDomain");
        error_log("Debug LDAP - BaseDn: $ldapBaseDn, Identifier: $ldapIdentifier, Password: $ldapPassword");
        error_log("Debug LDAP - Username: $username");
        error_log("Debug LDAP - Password: $password");

        if (empty($username) || empty($password)) {
        throw new AuthenticationException('Nom d\'utilisateur ou mot de passe manquant.');
        }

        // Retour du Passport avec UserBadge
        return new SelfValidatingPassport(
            new UserBadge(userIdentifier: $username, userLoader: function (string $userIdentifier) use ($password): User {
                try {
                    // Bind LDAP avec le compte de service pour les recherches
                    try{
                        $this->ldap->bind( 
                            $this->params->get('ldap_searchId_dn'),
                            $this->params->get('ldap_searchPassword')
                        );
                    } catch (ConnectionException $e) {
                        throw new CustomUserMessageAuthenticationException('Impossible de se connecter au serveur LDAP.');
                    }

                    // --------------------
                    // Recherche de l'utilisateur dans AD
                    // --------------------
                    $baseDn = $this->params->get('ldap_baseDn');
                    $queryString = $this->params->get('ldap_query_string');
                    $ldapDomain = $this->params->get('ldap_domain');

                    $usernameEscaped = $this->ldap->escape($userIdentifier, '', LdapInterface::ESCAPE_FILTER); // Échapper le nom d'utilisateur pour éviter les injections LDAP
                    $query = str_replace('{username}', $usernameEscaped, $queryString);

                    // Préparation de la requête pour chercher l'utilisateur
                    $result = $this->ldap->query($baseDn, $query)->execute();
                    if (1 !== $result->count()) {
                        throw new BadCredentialsException('Nom d\'utilisateur invalide.');
                    }

                    $entry = $result[0];
                    $userDn = $entry->getDn();

                    try {
                        // Option 1: Bind avec le nom d'utilisateur ex : (username@domain.com)
                        try { 
                            $this->ldap->bind($userIdentifier . '@' . $ldapDomain, $password);
                        } catch (InvalidCredentialsException $e) {
                            // Option 2: Bind avec le DN (Ditinguish Name) de l'utilisateur ex : (cn=John Doe,ou=User,dc=example,dc=com)
                            $this->ldap->bind($userDn, $password); 
                        }

                    }  catch (InvalidCredentialsException $e) {
                        throw new BadCredentialsException('Mot de passe incorrect.');
                    } catch (ConnectionException $e) {
                        throw new CustomUserMessageAuthenticationException('Erreur de connexion au serveur LDAP: ' . $e->getMessage());
                    }
                    
                    // --------------------
                    // Vérification des groupes
                    // --------------------
                    $authorizedGroups = $this->params->get('ldap_authorized_groups', []);
                    $authorizedPrimaryGroups = $this->params->get('ldap_authorized_primary_groups', []);
                    $adminGroups = $this->params->get('ldap_admin_groups', []);

                    $memberOf = $entry->getAttribute('memberOf') ?? []; // attribut LDAP contenant tous les groupes dont l’utilisateur est membre.

                    $isAdmin = count(array_intersect($adminGroups, $memberOf)) > 0; // Vérifie s’il y a au moins un élément en commun et renvoie true si oui

                    // Si aucun groupe n'est spécifié dans le service.yaml , on autorise tous le monde
                    // Si l'utilisateur appartient à un groupe secondaires autorisé, alors il a les accès  
                    $hasAccess = empty($authorizedGroups) && empty($authorizedPrimaryGroups) || count(array_intersect($authorizedGroups, $memberOf)) > 0;

                    // Vérifie les groupes primaires autorisés si aucun groupe secondaires n'est autorisé
                    if (!$hasAccess && !empty($authorizedPrimaryGroups)) {
                        $primaryGroupID = $entry->getAttribute('primaryGroupID') ?? [];
                        if (count($primaryGroupID) > 0) {
                            foreach ($authorizedPrimaryGroups as $allowedPrimaryGroupID) {
                                if (in_array($allowedPrimaryGroupID, $primaryGroupID)) {
                                    $hasAccess = true;
                                    break;
                                }
                            }
                        }
                    } 
                    if (!$hasAccess) {
                        throw new CustomUserMessageAuthenticationException('Vous n\'avez pas accès à cette application.');
                    }

                    // --------------------
                    // Charger ou créer l'utilisateur en BDD s'il n'existe pas
                    // -------------------- 
                    $user = $this->userRepository->findOneBy(['codeAd' => $userIdentifier]);
                    if (!$user) {
                        $user = new User();
                        $user->setcodeAd($userIdentifier);
                        $user->setAdmin($isAdmin);
                        $this->em->persist($user);
                        $this->em->flush();
                    } else {
                        // Mettre à jour le flag admin si besoin
                        if ($user->isAdmin() !== $isAdmin) {
                            $user->setAdmin($isAdmin);
                            $this->em->flush();
                        }
                    } 
                    return $user;

                } catch (AuthenticationException $e) {   
                    throw $e;
                }
            })
        );
    }

    /**
     * Rédirection vers la page d'accueil en cas de succès dans l'authentification
     */
    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        // on success, let the request continue
        return null;
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        $data = [
            // you may want to customize or obfuscate the message first
            'message' => strtr($exception->getMessageKey(), $exception->getMessageData()),

            // or to translate this message
            // $this->translator->trans($exception->getMessageKey(), $exception->getMessageData())
        ];

        return new JsonResponse($data, Response::HTTP_UNAUTHORIZED);
    }

    // public function start(Request $request, ?AuthenticationException $authException = null): Response
    // {
    //     /*
    //      * If you would like this class to control what happens when an anonymous user accesses a
    //      * protected page (e.g. redirect to /login), uncomment this method and make this class
    //      * implement Symfony\Component\Security\Http\EntryPoint\AuthenticationEntryPointInterface.
    //      *
    //      * For more details, see https://symfony.com/doc/current/security/experimental_authenticators.html#configuring-the-authentication-entry-point
    //      */
    // }
}
