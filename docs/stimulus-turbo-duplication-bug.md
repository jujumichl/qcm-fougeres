# Bug de Duplication des Contrôleurs Stimulus avec Turbo

## Problème

Après la connexion et la navigation dans l'application, les fonctionnalités Stimulus (click handlers, etc.) étaient appelées **3 fois** au lieu d'une seule fois en cliquant une seule fois sur les boutons.

Exemple: Cliquer sur le bouton "+" pour ajouter un QCM ajoutait **3 QCMs** au lieu d'1.

## Cause

Le problème venait de **Turbo (UX Turbo)** qui était activé par défaut via le fichier `assets/controllers.json`:

```json
{
    "controllers": {
        "@symfony/ux-turbo": {
            "turbo-core": {
                "enabled": true    // <-- LE PROBLEME
            }
        }
    }
}
```

### Mécanisme du bug

1. **Turbo intercepte les navigations HTTP**. Au lieu de faire un reload classique du navigateur, Turbo remplace le DOM via AJAX.
2. **Stimulus re-scanne le DOM** après chaque navigation Turbo pour trouver les nouveaux contrôleurs.
3. **Les contrôleurs s'accumulent en mémoire**: Quand Turbo remplace le DOM, les anciens contrôleurs Stimulus ne sont pas complètement détruits. Stimulus en crée de nouveaux sans enlever les anciens.
4. **Résultat**: Après N navigations, il y a N instances du contrôleur attachées au DOM. Donc chaque action est appelée N fois.

### Exemple de scénario

- Connexion → 1 contrôleur `accueil` attaché
- Déconnexion = Navigation vers login via Turbo = Contrôleur non complètement détruit
- Reconnexion = Navigation vers accueil via Turbo = 2ème insance du contrôleur
- Nouvelle navigation = 3ème instance...

Chaque clic sur un bouton déclenche maintenant l'action 3 fois (une pour chaque instance du contrôleur).

## Solution

**Désactiver complètement Turbo** dans `assets/controllers.json`:

```json
{
    "controllers": {
        "@symfony/ux-turbo": {
            "turbo-core": {
                "enabled": false    // <-- DESACTIVE
            },
            "mercure-turbo-stream": {
                "enabled": false
            }
        }
    },
    "entrypoints": []
}
```

## Effet de la solution

Après cette modification:

1. **Les navigations deviennent des reloads HTTP classiques**: Le navigateur recharge complètement la page à chaque fois.
2. **Les contrôleurs Stimulus sont réinitialisés**: À chaque reload, le vieux DOM est complètement supprimé et remplacé par un nouveau. Les anciens contrôleurs Stimulus sont automatiquement détruits par Stimulus lui-même.
3. **Il n'y a qu'une seule instance de chaque contrôleur par page**: Les actions ne sont appelées qu'une seule fois.
4. **La bundle est plus petite**: `app.js` passe de 236 KiB à 145 KiB (Turbo n'est plus inclus).

## Performances

Cette solution a un léger impact sur les performances:

- Avant (avec Turbo): Navigations AJAX sans reload = plus rapide
- Après (sans Turbo): Reload classique du navigateur = un peu plus lent

Cependant, le gain en stabilité et en correction du bug justifie ce léger impact. Pour une application simple comme QCM, c'est acceptable.

## Fichiers modifiés

- `assets/controllers.json`: Désactiver `turbo-core`
- `assets/app.js`: Retirer les imports et event listeners Turbo (déjà fait)

## Recommandations

Si vous avez besoin de navigations rapides à l'avenir:

1. **Option 1**: Utiliser une solution de lazy-loading appropriée pour les pages
2. **Option 2**: Implémenter Turbo correctement avec nettoyage des contrôleurs dans les événements Turbo (`turbo:before-render`, etc.)
3. **Option 3**: Garder la solution actuelle (reloads classiques) qui est stable et prévisible
