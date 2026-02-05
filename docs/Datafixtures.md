**DataFixtures — Mise en place (Symfony / Doctrine)**

- **But**: Expliquer comment installer et utiliser les fixtures Doctrine pour pré-remplir la base de données en développement/test.

- **Fichier d'exemple**: voir l'implémentation dans [src/DataFixtures/AppFixtures.php](src/DataFixtures/AppFixtures.php#L1).

**Installation**:

- Ajouter le bundle (en dev) :
```bash
composer require --dev doctrine/doctrine-fixtures-bundle
```
- Vérifier que le bundle est activé dans `config/bundles.php` (généralement automatique pour `dev`/`test`).

**Créer des fixtures**:

- Placer vos classes sous `src/DataFixtures/` et hériter de `Doctrine\Bundle\FixturesBundle\Fixture`.
- La méthode principale : `public function load(ObjectManager $manager): void`.
- Utiliser `$manager->persist($entity)` puis `$manager->flush()` à la fin.
- Pour lier plusieurs fixtures entre elles, utiliser `addReference('name', $entity)` et `getReference('name')`.

Exemple (votre fichier) : [src/DataFixtures/AppFixtures.php](src/DataFixtures/AppFixtures.php#L1) contient :
- création d'utilisateurs, types, qcm, questions, réponses et liaisons.
- usage de `ObjectManager` pour `persist()` et `flush()`.

**Commandes utiles**:

- Rafraîchir le schéma (si nécessaire) :
```bash
php bin/console doctrine:migrations:migrate
# ou (dev rapide) :
php bin/console doctrine:schema:update --force
```

- Charger les fixtures (purge la base par défaut) :
```bash
php bin/console doctrine:fixtures:load --no-interaction
```

- Options pratiques :
  - `--append` : n'efface pas les données existantes, ajoute seulement.
  - `--purge-with-truncate` : purge les tables avec TRUNCATE (utile pour garder les séquences propres).

Exemples :
```bash
# Charger et purger proprement (env=dev)
APP_ENV=dev php bin/console doctrine:fixtures:load --purge-with-truncate --no-interaction

# Ajouter sans purger
APP_ENV=dev php bin/console doctrine:fixtures:load --append
```

**Bonnes pratiques**:

- Garder les fixtures idempotentes quand possible (ou utiliser `--append`).
- Séparer fixtures en plusieurs classes (UserFixtures, QcmFixtures...) et utiliser `addReference`/`getReference` pour les dépendances.
- Ne pas déployer les fixtures de développement en production. Limiter le bundle aux environnements `dev` et `test`.
- Si vous avez besoin de jeux de données complexes, envisagez `Foundry` ou `Alice`.

**Dépannage** :

- Erreurs d'entité -> vérifier les mappings (annotations/YAML/XML) et exécuter `doctrine:schema:validate`.
- Conflits de clé primaire -> utiliser `--purge-with-truncate` ou réinitialiser les séquences.