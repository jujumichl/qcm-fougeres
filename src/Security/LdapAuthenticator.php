<?php

namespace App\Security;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface; // ajouter
// use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;
use Symfony\Component\HttpFoundation\RedirectResponse; //ajouter
use Symfony\Component\Security\Http\EntryPoint\AuthenticationEntryPointInterface; // ajouter
use Symfony\Component\Security\Http\SecurityRequestAttributes; // ajouter
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\CsrfTokenBadge; // ajouter
use App\Security\LdapUserManager;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;


/**
 * @see https://symfony.com/doc/current/security/custom_authenticator.html
 */
class LdapAuthenticator extends AbstractAuthenticator implements AuthenticationEntryPointInterface
{
    private const LOGIN_ROUTE = 'app_login';

    /** 
     * En symfony 8+, on peut déclarer les dépendances du service directement dans le constructeur.
     * crée automatiquement les propriétés de la classe et les initialise avec les valeurs injectées.
    */                   
    public function __construct(
        private LdapUserManager $ldapUserManager, 
        private UrlGeneratorInterface $urlGenerator, 
    ) {}

    /**
     * Appelé à chaque demande pour décider si  authenticate() doit être Utilisé pour la demande.
     * Si false est retourné alors authenticate() est ignoré.
     */
    public function supports(Request $request): ?bool
    {
        $isSupported = self::LOGIN_ROUTE === $request->attributes->get(key: '_route') && $request->isMethod('POST'); 
        
        /**
         * if($isSupported){
         *     dd(message: "supports() called, returning: " . ($isSupported ? 'true' : 'false'));
         *   }
         */ 

        error_log(message: "supports() called, returning: " . ($isSupported ? 'true' : 'false'));

        return $isSupported;
    }

    /**
     * Fonction principale qui gère l'authentification de l'utilisateur via Active Directory.
     * La vérification des credentials (login/mot de passe) est effectuée directement par l'AD, 
     * D'où l'utilisation de SelfValidatingPassport et pas la classe Passport.
     */
    public function authenticate(Request $request): SelfValidatingPassport
    { 
        //dump('AUTHENTICATE CALLED');
        //dd($request->request->all()); // montre les données POST
        error_log(message: "authenticate() method entered");

        // Récupération de l'input utilisateur
        $username = $request->request->get('username');
        $password = $request->request->get('password');

        if (empty($username) || empty($password)) {
        throw new AuthenticationException();
        }

        // Retour du Passport avec UserBadge qui est configurer par une fonction anonyme
        return new SelfValidatingPassport(
            new UserBadge(userIdentifier: $username, userLoader: fn (string $userIdentifier) => $this->ldapUserManager->loadOrCreateUser($username, $password)),
            badges: [
                //Vérification du token CSRF pour protéger contre les attaques CSRF
                new CsrfTokenBadge('authenticate', $request->request->get('_csrf_token_login')),
            ]
        );
    }

    /**
     * Redirection vers la page d'accueil en cas de succès dans l'authentification
     */
    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        // Redirection vers la route 'app_accueil'
        return new RedirectResponse($this->urlGenerator->generate('app_accueil'));
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        // Sauvegarde l’erreur dans la session via 
        $request->getSession()->set(
            SecurityRequestAttributes::AUTHENTICATION_ERROR, $exception
        );

         // Sauvegarde le dernier username saisi en session
        $request->getSession()->set(
            SecurityRequestAttributes::LAST_USERNAME,
            $request->request->get('username')
        );

        return new RedirectResponse(
            $this->urlGenerator->generate(self::LOGIN_ROUTE)
        );
        //$data = [
            // you may want to customize or obfuscate the message first
            //'message' => strtr($exception->getMessageKey(), $exception->getMessageData()),

            // or to translate this message
            // $this->translator->trans($exception->getMessageKey(), $exception->getMessageData())
        //];
        //return new JsonResponse($data, Response::HTTP_UNAUTHORIZED);
    }


    /**
     * Si un utilisateur anonyme tente d'accéder à une page protégée, 
     * Cette méthode est appelée pour décider de la réponse à retourner.
     * Ici, on redirige simplement vers la page de login.
     */
    public function start(Request $request, ?AuthenticationException $authException = null): Response
    {

        return new RedirectResponse($this->urlGenerator->generate('app_login'));

        /*
        * If you would like this class to control what happens when an anonymous user accesses a
         * protected page (e.g. redirect to /login), uncomment this method and make this class
         * implement Symfony\Component\Security\Http\EntryPoint\AuthenticationEntryPointInterface.
        *
         * For more details, see https://symfony.com/doc/current/security/experimental_authenticators.html#configuring-the-authentication-entry-point
         */
    }
    
}
