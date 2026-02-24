# Indexes et InnoDB

## Résumé rapide
- **Index** : structure qui accélère la recherche sur une colonne (comme l'index d'un livre).
- **InnoDB** : moteur de stockage MySQL recommandé pour la plupart des applications (transactions, verrouillage ligne, intégrité référentielle).

---

## Index : définition et utilité
- Un index permet de retrouver rapidement les lignes correspondant à une condition sans parcourir toute la table (évite le full table scan).
- **Quand en créer :**
  - Colonnes souvent utilisées dans `WHERE`.
  - Colonnes utilisées dans `JOIN`.
  - Colonnes utilisées dans `ORDER BY` ou `GROUP BY`.
- **Types courants :**
  - `PRIMARY KEY` : index unique créé automatiquement pour la clé primaire.
  - `UNIQUE` : garantit l'unicité et crée un index.
  - `INDEX` (ou `KEY`) : index non unique.

### Exemples
- Créer un index :

```sql
CREATE INDEX idx_qcm_createur ON QCM(createur);
```

- Voir les indexes :

```sql
SHOW INDEX FROM QuestionQcm;
```

---

## Avantages et compromis
- + Lecture plus rapide sur colonnes indexées.
- - Espace disque supplémentaire pour l'index.
- - INSERT/UPDATE/DELETE légèrement plus lents car l'index doit être maintenu.

> Bonnes pratiques : indexer les colonnes fréquemment interrogées mais éviter d'indexer toutes les colonnes (surtout celles très volatiles en écritures).

---

## InnoDB : pourquoi l'utiliser ?
- **Transactions** : `BEGIN` / `COMMIT` / `ROLLBACK` pour garantir la cohérence.
- **Intégrité référentielle** : support des clés étrangères (`FOREIGN KEY`).
- **Verrouillage au niveau des lignes** : meilleure concurrence pour les écritures.
- **Crash recovery** : mécanismes pour récupérer après plantage.

### Exemple de création de table avec InnoDB

```sql
CREATE TABLE QCM (
  id CHAR(7) PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  createur INT,
  INDEX (createur)
) ENGINE=InnoDB;
```

---

## Recommandations pratiques 
- Indexer : clés étrangères, colonnes utilisées dans les WHERE et JOIN.
- Mesurer : surveiller les requêtes lentes (`slow query log`) et ajouter des indexes ciblés.
- Éviter les index redondants (même colonne avec des noms différents).
- Supprimer les indexes inutilisés si la charge d'écriture est critique.

---