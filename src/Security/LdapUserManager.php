<?php

namespace App\Security;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\Ldap\LdapInterface;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;
use Symfony\Component\Ldap\Exception\ConnectionException;
use Symfony\Component\Ldap\Exception\InvalidCredentialsException;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Contracts\Cache\CacheInterface;

class LdapUserManager
{
    public function __construct(
        private LdapInterface $ldap,
        private UserRepository $userRepository,
        private EntityManagerInterface $em,
        private ParameterBagInterface $params,
        private CacheInterface $ldapCache
    ) {}

    public function loadOrCreateUser(string $userIdentifier, string $password): User
    {
        // récupération des paramètres globaux LDAP déclarés dans services.yaml
        $ldapHost = $this->params->get('ldap_host');
        $ldapPort = $this->params->get('ldap_port');
        $ldapBaseDn = $this->params->get('ldap_baseDn');
        $ldapIdentifier = $this->params->get('ldap_searchId_dn');
        $ldapPassword = $this->params->get('ldap_searchPassword');
        $ldapDomain = $this->params->get('ldap_domain');

        // Mise en place de log pour vérifier que nos paramètre LDAP sont bon
        error_log("Debug LDAP - Host: $ldapHost, Port: $ldapPort, BaseDn: $ldapBaseDn");
        error_log("Debug LDAP - Identifier: $ldapIdentifier, Domain: $ldapDomain");
        error_log("Debug LDAP - BaseDn: $ldapBaseDn, Identifier: $ldapIdentifier, Password: $ldapPassword");
        error_log("Debug LDAP - Username: $userIdentifier");
        error_log("Debug LDAP - Password: $password");
        
        try {
            // Bind (connexion) LDAP avec le compte de service pour les recherches
            try{
                $this->ldap->bind( 
                    $this->params->get('ldap_searchId_dn'),
                    $this->params->get('ldap_searchPassword')
                );
            } catch (ConnectionException $e) {
                throw new CustomUserMessageAuthenticationException('Erreur d\'authentification LDAP: ' . $e->getMessage());
            }

            // --------------------
            // Recherche de l'utilisateur dans AD
            // --------------------
            $ldapQueryString = $this->params->get('ldap_query_string');

            $usernameEscaped = $this->ldap->escape($userIdentifier, '', LdapInterface::ESCAPE_FILTER); // Échapper le nom d'utilisateur pour éviter les injections LDAP
            $query = str_replace('{username}', $usernameEscaped, $ldapQueryString);
                    
            // Préparation de la requête pour chercher l'utilisateur
            $result = $this->ldap->query($ldapBaseDn, $query)->execute();
            if (1 !== $result->count()) {
                throw new CustomUserMessageAuthenticationException('Login ou mot de passe incorrect.');
            }

            $entry = $result[0];
            $userDn = $entry->getDn();

            // -------------------------
            // Vérifier le mot de passe
            // -------------------------
            try {
                // Option 1: Bind avec le nom d'utilisateur ex : (username@domain.com)
                // $this->ldap->bind($userIdentifier . '@' . $ldapDomain, $password);
                
                    // Option 2: Bind avec le DN (Ditinguish Name) de l'utilisateur ex : (cn=John Doe,ou=User,dc=example,dc=com)
                    $this->ldap->bind($userDn, $password); 

            }  catch (InvalidCredentialsException $e) {
                throw new CustomUserMessageAuthenticationException('Login ou mot de passe incorrect.');
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

            $isAdmin = count(array_intersect($adminGroups, $memberOf)) > 0; // Vérifie si l'utilisateur appartient à un groupe admin

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
            // Charger ou créer l'utilisateur en BDD s'il n'existe pas + attribution des rôles
            // -------------------- 
            $user = $this->userRepository->findOneBy(['usernameAD' => $userIdentifier]);

            // Déterminer les rôles
            $roles = $isAdmin ? ['ROLE_ADMIN'] : ['ROLE_USER'];
            
            if (!$user) {
                $user = new User();
                $user->setUsername($userIdentifier);
                $user->setRoles($roles);
                $this->em->persist($user);
                $this->em->flush();
            } else {
                // Mettre à jour le flag admin si besoin
                if ($user->getRoles() !== $roles) {
                    $user->setRoles($roles);
                    $this->em->flush();
                }
            } 
            return $user;

        } catch (AuthenticationException $e) {   
                    throw $e;
        }
    }
}