Documentation pour mettre en place un token csrf dans le cas d'une connexion LDAP avec authenticator custom :

# 1️ - Activation CSRF

## config/packages/framework.yaml

```yaml
framework:
    csrf_protection: true
```

---

# 2 - Formulaire de connexion - initialiser le token

## Template Twig

```twig
<form method="post" action="{{ path('app_login') }}">

    <input type="email" name="email" required>
    <input type="password" name="password" required>

    <input type="hidden" name="_csrf_token"
           value="{{ csrf_token('authenticate') }}"
    >

    <button type="submit">Se connecter</button>

</form>
```
=> Le token est généré avec l'id : **`authenticate`**
Cet identifiant devra correspondre à celui utilisé dans l’Authenticator.

---

# 3 - Authenticator personnalisé - Vérification du token

## src/Security/LoginAuthenticator.php

```php
namespace App\Security;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\CsrfTokenBadge;
use Symfony\Component\Security\Core\Exception\AuthenticationException;

class LoginAuthenticator extends AbstractAuthenticator
{
    public function supports(Request $request): ?bool
    {
        return $request->attributes->get('_route') === 'app_login'
            && $request->isMethod('POST');
    }

    public function authenticate(Request $request): SelfValidatingPassport
    {
        $email = $request->request->get('email');
        // récupération du token
        $csrfToken = $request->request->get('_csrf_token');

        return new SelfValidatingPassport(
            new UserBadge($email),
            [   // vérification du csrf token
                new CsrfTokenBadge('authenticate', $csrfToken)
            ]
        );
    }
}
```

---

# Points de sécurité importants

### L'id CSRF doit correspondre

Twig :

```twig
{{ csrf_token('authenticate') }}
```

Authenticator :

```php
new CsrfTokenBadge('authenticate', $csrfToken)
```

---

# 4 - Comment fonctionne la validation CSRF ?

Lorsque l'on ajoutes :

```php
new CsrfTokenBadge('authenticate', $csrfToken)
```

Symfony :

1. Récupère le CsrfTokenManager
2. Compare l’id `authenticate`
3. Vérifie que le token est valide
4. Lance une `InvalidCsrfTokenException` si échec

Aucune vérification manuelle nécessaire.




