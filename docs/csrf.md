Voici une **documentation complète et structurée** pour mettre en place un **token CSRF avec Symfony**, puis l’exposer côté frontend avec **Twig + Stimulus** et le stocker en **sessionStorage**.

---

# 1 - Mise en place d’un token CSRF dans Symfony

Symfony intègre nativement la protection CSRF via le composant `security-csrf`.

## 1.1 Vérifier que CSRF est activé

Dans `config/packages/framework.yaml ou csrf.yaml` :

```yaml
framework:
    csrf_protection: true
```

---

## 1.2 Générer un token CSRF manuellement via twig (hors Form)

Dans notre template Twig :

```twig
<div>
    <input type="hidden" name="_csrf_token" value="{{ csrf_token('authenticate') }}">
</div>
```
=> le token est automatiquement générer par la fonction  `{{ csrf_token('id') }}`

---

## 1.3 Vérifier le token côté serveur

Dans le contrôleur :

```php
use Symfony\Component\Security\Csrf\CsrfToken;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;

public function submit(Request $request, CsrfTokenManagerInterface $csrfTokenManager)
{
    $submittedToken = $request->request->get('_csrf_token');

    if (!$csrfTokenManager->isTokenValid(new CsrfToken('authenticate', $submittedToken))) {
        throw new \Exception('Invalid CSRF token');
    }

    // Traitement normal avec le return $this
}
```

---


# 2 - Récupérer le token via Stimulus et le stocker en sessionStorage

Les différentes étapes :

1. Mettre une target
2. Le lire via Stimulus
3. Le stocker en sessionStorage

---

## 2.1 Mettre une target stimulus dans l'input

```twig
<div data-controller="accueil">

    <!-- on met la target dans l'input -->
    <input type="hidden" name="_csrf_token" data-login-target="csrf" value="{{ csrf_token('authenticate') }}">

</div>
```

---

## 2.2 Dans accueil.controller.js

```javascript

import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
    // initaliser la target csrf  
    static targets = ["csrf"]

    // Se lance au chargement du controller
    connect() {
        if (this.tokentarget) {
          // Récupération du token
          const tokenCsrf = this.csrftarget.value,

          // intégration du token dans le session storage pour le manipuler plus tard
          sessionStorage.setItem("csrf_token", tokenCsrf);
          console.log("CSRF token stored in sessionStorage");
        }
    }
}
```

---

## 2.3 Utilisation du token pour requêtes AJAX

Exemple avec `fetch` :

```javascript
const token = sessionStorage.getItem("csrf_token");

fetch("/contact/submit", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": token
    },
    body: JSON.stringify({ name: "John" })
});
```

---

# 3 - Vérification du token envoyé via Header

Dans le contrôleur Symfony :

```php
$submittedToken = $request->headers->get('X-CSRF-TOKEN');

if (!$csrfTokenManager->isTokenValid(new CsrfToken('contact_form', $submittedToken))) {
    throw new \Exception('Invalid CSRF token');
}
```

---

# Bonnes pratiques

### Toujours utiliser un "token id" spécifique

Exemple :

```php
$csrfTokenManager->getToken('delete_user_42');
```

---

### Ne pas stocker un token CSRF en localStorage

* `localStorage` persiste après fermeture navigateur
* `sessionStorage` disparaît à la fermeture de l’onglet

---