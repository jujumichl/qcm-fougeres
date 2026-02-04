# Erreurs rencontrées durant le projet (erreur + résolution)

## Erreur 1 : Problème lié a au mapping des entités
### Message d'erreur
```bash
php bin/console make:migration
 php bin/console make:migration

In MissingColumnException.php line 16:
                                                                                                                
  Column name "id" referenced for relation from App\Entity\RepUserQcm towards App\Entity\Users does not exist.  
                                                                                                                

make:migration [--formatted] [--configuration [CONFIGURATION]]
```

Ici le message d'erreur indique que la colonne "id" n'existe pas dans l'entité Users, j'utilisais la propriété "codeAd" comme PK dans l'architecture de mon projet.

### Résolution
Pour voir plus en détail l'erreur, j'ai lancer la commande suivante :
```bash
 php bin/console doctrine:mapping:info

 Found 7 mapped entities:

 [OK]   App\Entity\Qcm
 [OK]   App\Entity\QuestionQcm
 [OK]   App\Entity\ReponseQcm
 [OK]   App\Entity\RepQuesQcm
 [OK]   App\Entity\RepUserQcm
 [OK]   App\Entity\Type
 [OK]   App\Entity\Users

 php bin/console doctrine:schema:validate


Mapping
-------

 [FAIL] The entity-class App\Entity\Qcm mapping is invalid:
 * The referenced column name 'codeAd' has to be a primary key column on the target entity class 'App\Entity\Users'.


 [FAIL] The entity-class App\Entity\RepUserQcm mapping is invalid:
 * The referenced column name 'id' has to be a primary key column on the target entity class 'App\Entity\Users'.


Database
--------


In MissingColumnException.php line 16:
                                                                                                                
  Column name "id" referenced for relation from App\Entity\RepUserQcm towards App\Entity\Users does not exist.  
                                                                                                                

doctrine:schema:validate [--em EM] [--skip-mapping] [--skip-sync] [--skip-property-types]

```

J'ai ensuite ajouter un champ `id` en tant que PK dans l'entité `Users` pour résoudre le problème de mapping. 

Puis j'ai relancé la commande `php bin/console doctrine:schema:validate` qui cette fois-ci m'a retournée :  
```bash
php bin/console doctrine:schema:validate
 php bin/console doctrine:schema:validate

Mapping
-------


 [OK] The mapping files are correct.


Database
--------


 [ERROR] The database schema is not in sync with the current mapping file.

```

L'erreur restante est due au fait que la base de données n'est pas à jour avec les entités, j'ai donc lancé la commande `php bin/console make:migration` pour créer une migration, puis `php bin/console doctrine:migrations:migrate` pour appliquer les changements dans la base de données.

## Erreur 2: Lors de l'insertion des données Test dans la base de données
### Message d'erreur
```bash
bin/console doctrine:query:sql "$(<dataTestBdd.sql)"

                                                
  Command "doctrine:query:sql" is not defined.  
                                                

 Do you want to run "doctrine:query:dql" instead?  (yes/no) [no]:
 > no

```

### Résolution
j'ai exécuter cette commande afin de vérifier que j'avais bien le composant présent dans mon composer, et qu'il soit bine installer `composer require --dev doctrine/doctrine-fixtures-bundle` puis j'ai effectuer la commande suivante pour charger les données de test dans la base de données : 
```bash
 php bin/console doctrine:fixtures:load
```
