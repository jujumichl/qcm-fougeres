<?php

namespace App\DataFixtures;

use App\Entity\Users;
use App\Entity\Type;
use App\Entity\Qcm;
use App\Entity\QuestionQcm;
use App\Entity\ReponseQcm;
use App\Entity\RepUserQcm;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        /*
         * USERS
         
        
        $users = [
            
        ];
        foreach ([1, 2, 3, 4, 5] as $i) {
            $user = new Users();
            $user->setcodeAd($i);
            $user->setAdmin($i % 2 === 0);
            $manager->persist($user);
            $users[$i] = $user;
        }

        /*
         * TYPES
         
        $types = [];
        $typesData = [
            1 => 'liste',
            2 => 'multiple',
            3 => 'unique',
        ];

        foreach ($typesData as $id => $label) {
            $type = new Type();
            $type->setType($label);
            $manager->persist($type);
            $types[$id] = $type;
        }

        /*
         * QCM
         
        $qcms = [];

        $qcmData = [
            'ABC0001' => ['Géographie - Capitales', 1, '2026-02-01', '2026-02-28'],
            'ABC0002' => ['Mathématiques - Calculs simples', 2, null, null],
            'ABC0003' => ['Biologie - Classement & identification', 3, '2026-02-01', '2026-02-28'],
        ];

        foreach ($qcmData as $id => [$nom, $creator, $debut, $fin]) {
            $qcm = new Qcm();
            $qcm->setId($id);
            $qcm->setNom($nom);
            $qcm->setCreateur($users[$creator]);
            $qcm->setEtat(true);

            if ($debut) {
                $qcm->setDateDeb(new \DateTime($debut));
            }
            if ($fin) {
                $qcm->setDateFin(new \DateTime($fin));
            }

            $manager->persist($qcm);
            $qcms[$id] = $qcm;
        }

        /*
         * QUESTIONS
         
        $questions = [];

        $questionsData = [
            1 => ['Quelle est la capitale de la France ?', 'ABC0001'],
            2 => ['2 + 2 = ?', 'ABC0002'],
            3 => ['Classez ces fruits du plus petit au plus grand', 'ABC0003'],
            4 => ['Quels sont des mammifères ?', 'ABC0003'],
        ];

        foreach ($questionsData as $id => [$label, $qcmId]) {
            $q = new QuestionQcm();
            $q->setQuestion($label);
            $q->setIdQcm($qcms[$qcmId]);

            $manager->persist($q);
            $questions[$id] = $q;
        }

        /*
         * REPONSES
         
        $reponses = [];

        $reponsesData = [
            1  => ['Lyon', 0, 3],
            2  => ['Paris', 1, 3],
            3  => ['Marseille', 0, 3],
            4  => ['3', 0, 3],
            5  => ['4', 1, 3],
            6  => ['5', 0, 3],
            7  => ['Myrtille', 1, 1, 1],
            8  => ['Pomme', 1, 1, 2],
            9  => ['Pastèque', 1, 1, 3],
            10 => ['Chien', 1, 2],
            11 => ['Aigle', 0, 2],
            12 => ['Dauphin', 1, 2],
            13 => ['Thon', 0, 2],
            14 => ['Voiture', 0, 1],
        ];

        foreach ($reponsesData as $id => $data) {
            [$label, $ok, $typeId, $pos] = array_pad($data, 4, null);

            $r = new ReponseQcm();
            $r->setReponse($label);
            $r->setBonneRep((bool) $ok);
            $r->setType($types[$typeId]);

            if ($pos !== null) {
                $r->setPosition($pos);
                $r->setPriorite($pos);
            }

            $manager->persist($r);
            $reponses[$id] = $r;
        }

        /*
         * LIENS QUESTION <-> REPONSES
         
        $links = [
            1 => [1, 2, 3],
            2 => [4, 5, 6],
            3 => [7, 8, 9, 14],
            4 => [10, 11, 12, 13],
        ];

        foreach ($links as $qId => $repIds) {
            foreach ($repIds as $repId) {
                $link = new \App\Entity\RepQuesQcm();
                $link->setIdQ($questions[$qId]);
                $link->setIdR($reponses[$repId]);

                $manager->persist($link);
            }
        }

        /*
         * REPONSES DES USERS
         
        $repUserData = [
            [2, 1, 'ABC0001'],
            [5, 1, 'ABC0002'],
            [7, 1, 'ABC0003'],
            [8, 1, 'ABC0003'],
            [10, 2, 'ABC0003'],
            [12, 2, 'ABC0003'],
            [7, 3, 'ABC0003'],
            [8, 3, 'ABC0003'],
            [10, 3, 'ABC0003'],
            [12, 3, 'ABC0003'],
            [1, 4, 'ABC0001'],
            [1, 5, 'ABC0001'],
            [2, 5, 'ABC0001'],
            [4, 4, 'ABC0002'],
            [7, 5, 'ABC0003'],
            [8, 5, 'ABC0003'],
            [9, 5, 'ABC0003'],
            [7, 4, 'ABC0003'],
            [14, 4, 'ABC0003'],
            [10, 1, 'ABC0003'],
            [11, 4, 'ABC0003'],
        ];

        foreach ($repUserData as [$repId, $userId, $qcmId]) {
            $ru = new RepUserQcm();
            $ru->setRep($reponses[$repId]);
            $ru->setUser($users[$userId]);
            $ru->setIdQcm($qcms[$qcmId]);

            $manager->persist($ru);
        }

        $manager->flush();*/
    }
}
