<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260204092450 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE qcm (id VARCHAR(7) NOT NULL, nom VARCHAR(255) NOT NULL, date_deb DATE DEFAULT NULL, date_fin DATE DEFAULT NULL, etat TINYINT NOT NULL, deleted_at DATE DEFAULT NULL, createur_id INT NOT NULL, INDEX IDX_D7A1FEF473A201E5 (createur_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE question_qcm (id INT AUTO_INCREMENT NOT NULL, question LONGTEXT NOT NULL, id_qcm_id VARCHAR(7) NOT NULL, INDEX IDX_E7B51F8CD955F44B (id_qcm_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE rep_ques_qcm (id_q_id INT NOT NULL, id_r_id INT NOT NULL, INDEX IDX_4AEABA27E0E718C5 (id_q_id), INDEX IDX_4AEABA27F252B72B (id_r_id), PRIMARY KEY (id_q_id, id_r_id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE rep_user_qcm (id INT AUTO_INCREMENT NOT NULL, rep_id INT NOT NULL, user_id INT NOT NULL, id_qcm_id VARCHAR(7) NOT NULL, INDEX IDX_9010A85754C549EA (rep_id), INDEX IDX_9010A857A76ED395 (user_id), INDEX IDX_9010A857D955F44B (id_qcm_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE reponse_qcm (id INT AUTO_INCREMENT NOT NULL, reponse LONGTEXT NOT NULL, bonne_rep TINYINT NOT NULL, position INT DEFAULT NULL, priorite INT DEFAULT NULL, type_id INT NOT NULL, INDEX IDX_BF0C6CD0C54C8C93 (type_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE type (id INT AUTO_INCREMENT NOT NULL, type VARCHAR(100) NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE users (id INT AUTO_INCREMENT NOT NULL, code_ad INT NOT NULL, admin TINYINT NOT NULL, UNIQUE INDEX UNIQ_1483A5E9EF03741F (code_ad), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE messenger_messages (id BIGINT AUTO_INCREMENT NOT NULL, body LONGTEXT NOT NULL, headers LONGTEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at DATETIME NOT NULL, available_at DATETIME NOT NULL, delivered_at DATETIME DEFAULT NULL, INDEX IDX_75EA56E0FB7336F0E3BD61CE16BA31DBBF396750 (queue_name, available_at, delivered_at, id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE qcm ADD CONSTRAINT FK_D7A1FEF473A201E5 FOREIGN KEY (createur_id) REFERENCES users (id)');
        $this->addSql('ALTER TABLE question_qcm ADD CONSTRAINT FK_E7B51F8CD955F44B FOREIGN KEY (id_qcm_id) REFERENCES qcm (id)');
        $this->addSql('ALTER TABLE rep_ques_qcm ADD CONSTRAINT FK_4AEABA27E0E718C5 FOREIGN KEY (id_q_id) REFERENCES question_qcm (id)');
        $this->addSql('ALTER TABLE rep_ques_qcm ADD CONSTRAINT FK_4AEABA27F252B72B FOREIGN KEY (id_r_id) REFERENCES reponse_qcm (id)');
        $this->addSql('ALTER TABLE rep_user_qcm ADD CONSTRAINT FK_9010A85754C549EA FOREIGN KEY (rep_id) REFERENCES reponse_qcm (id)');
        $this->addSql('ALTER TABLE rep_user_qcm ADD CONSTRAINT FK_9010A857A76ED395 FOREIGN KEY (user_id) REFERENCES users (id)');
        $this->addSql('ALTER TABLE rep_user_qcm ADD CONSTRAINT FK_9010A857D955F44B FOREIGN KEY (id_qcm_id) REFERENCES qcm (id)');
        $this->addSql('ALTER TABLE reponse_qcm ADD CONSTRAINT FK_BF0C6CD0C54C8C93 FOREIGN KEY (type_id) REFERENCES type (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE qcm DROP FOREIGN KEY FK_D7A1FEF473A201E5');
        $this->addSql('ALTER TABLE question_qcm DROP FOREIGN KEY FK_E7B51F8CD955F44B');
        $this->addSql('ALTER TABLE rep_ques_qcm DROP FOREIGN KEY FK_4AEABA27E0E718C5');
        $this->addSql('ALTER TABLE rep_ques_qcm DROP FOREIGN KEY FK_4AEABA27F252B72B');
        $this->addSql('ALTER TABLE rep_user_qcm DROP FOREIGN KEY FK_9010A85754C549EA');
        $this->addSql('ALTER TABLE rep_user_qcm DROP FOREIGN KEY FK_9010A857A76ED395');
        $this->addSql('ALTER TABLE rep_user_qcm DROP FOREIGN KEY FK_9010A857D955F44B');
        $this->addSql('ALTER TABLE reponse_qcm DROP FOREIGN KEY FK_BF0C6CD0C54C8C93');
        $this->addSql('DROP TABLE qcm');
        $this->addSql('DROP TABLE question_qcm');
        $this->addSql('DROP TABLE rep_ques_qcm');
        $this->addSql('DROP TABLE rep_user_qcm');
        $this->addSql('DROP TABLE reponse_qcm');
        $this->addSql('DROP TABLE type');
        $this->addSql('DROP TABLE users');
        $this->addSql('DROP TABLE messenger_messages');
    }
}
