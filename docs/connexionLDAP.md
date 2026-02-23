# Connexion LDAP avec Symfony 8+

Cette documentation explique comment configurer Symfony 8+ pour **authentifier les utilisateurs via LDAP/Active Directory**, en utilisant un **Authenticator custom** et un **UserProvider basé sur la base de données**, avec une configuration LDAP centralisée dans `services.yaml`.

---

## 1. Installation des dépendances

```bash
composer require symfony/ldap symfony/security-bundle symfony/orm-pack
```

---

## 2. Configuration des paramètres LDAP

Dans `config/services.yaml`, ajoute des paramètres LDAP et Active Directory :

Remarque : ici les paramètres sont des paramètres globaux qui peuvent également être configurer dans des fichiers `.env`

```yaml
parameters:
    ldap_host: 'ad.hdv.local'
    ldap_baseDn: 'DC=hdv,DC=local'
    ldap_domain: 'hdv.local'
    ldap_query_string: '(sAMAccountName={username})'
    ldap_searchId_dn: 'identifiant'
    ldap_searchPassword: 'mdp'
    ldap_port: 389
    ldap_protocol_version: 3

    ldap_authorized_groups: []
    ldap_admin_groups:
        - CN=informatique,OU=Groupe_partagereseau,OU=GROUPES,DC=hdv,DC=local
    ldap_authorized_primary_groups: []
    default_redirection: 'app_accueil'
```

=> Ces paramètres seront utilisés pour créer le **service LDAP** et pour filtrer les utilisateurs.

---

## 3. Configuration du service LDAP

Toujours dans `config/services.yaml` :

```yaml
services:
    _defaults:
        autowire: true
        autoconfigure: true

    App\:
        resource: '../src/'
        exclude:
            - '../src/Entity/'
            - '../src/Kernel.php'

    # === Services LDAP === #
    Symfony\Component\Ldap\Adapter\ExtLdap\Adapter:
        arguments:
            - host: '%ldap_host%'
              port: '%ldap_port%'
              options:
                  protocol_version: '%ldap_protocol_version%'
                  referrals: false

    Symfony\Component\Ldap\Ldap:
        arguments:
            - '@Symfony\Component\Ldap\Adapter\ExtLdap\Adapter'

    Symfony\Component\Ldap\LdapInterface: '@Symfony\Component\Ldap\Ldap'
```

=> Cela permet d’injecter le service LDAP via l’interface `LdapInterface` partout dans l’application.

---

## 4. Configuration du Security Bundle (`security.yaml`)

```yaml
security:
    password_hashers:
        Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface: 'auto'

    providers:
        # Provider basé sur la base de données
        app_user_provider:
            entity:
                class: App\Entity\User
                property: username # ou email parfois

    firewalls:
        main:
            pattern: ^/
            lazy: true
            provider: app_user_provider
            custom_authenticators:
                - App\Security\LdapAuthenticator
            logout:
                path: app_logout
                invalidate_session: true

    access_control:
        - { path: ^/login, roles: IS_AUTHENTICATED_ANONYMOUSLY }
        - { path: ^/, roles: ROLE_USER }
```

---

## 5. Création d’un Authenticator custom

Commande : `php bin/console make:security:custom`

Crée `src/Security/LdapAuthenticator.php` : 

```php
<?php

namespace App\Security;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Http\Authenticator\AuthenticatorInterface;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Credentials\PasswordCredentials;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Ldap\LdapInterface;

class LdapAuthenticator implements AuthenticatorInterface
{
    private LdapInterface $ldap;
    private UserProviderInterface $userProvider;
    private array $params;

    public function __construct(LdapInterface $ldap, UserProviderInterface $userProvider, array $params)
    {
        $this->ldap = $ldap;
        $this->userProvider = $userProvider;
        $this->params = $params;
    }

    public function supports(Request $request): ?bool
    {
       // vérifie que la réquête est bien un post issue de la page login
    }

    public function authenticate(Request $request): Passport
    {
        $username = $request->request->get('email');
        $password = $request->request->get('password');

        $dn = str_replace('{username}', $username, $this->params['ldap_query_string']);

        try {
            $this->ldap->bind($dn, $password);
        } catch (\Exception $e) {
            throw new AuthenticationException('LDAP authentication failed');
        }

        return new Passport(
            new UserBadge($username, fn($userIdentifier) => $this->userProvider->loadUserByUsername($userIdentifier)),
            new PasswordCredentials($password)
        );
    }

    public function onAuthenticationSuccess(Request $request, Response $response, $token, string $firewallName): ?Response
    {
        return null; // Continue request
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        return new Response('Authentication Failed', Response::HTTP_FORBIDDEN);
    }
}
```

---

## 6. Création du UserProvider Doctrine

Si vous n’avez pas encore d’entité `User` :

```bash
php bin/console make:user
```

Puis configurez le `UserProvider` dans `security.yaml` comme indiqué.

---

## 7. Commandes Symfony utiles

```bash
# Créer un user entity
php bin/console make:user

# Créer un authenticator
php bin/console make:auth

# Vérifier la configuration de sécurité
php bin/console security:check

# Tester le serveur LDAP depuis Symfony
php bin/console ldap:check
```

---

## 8. Flux d’authentification

1. L’utilisateur soumet son login via `/login`.
2. `LdapAuthenticator` vérifie ses credentials sur le serveur LDAP/AD.
3. Si OK, le `UserProvider` charge les infos depuis la base de données.
4. Symfony crée la session et authentifie l’utilisateur.
5. Les routes sont sécurisées via `access_control`.

---

