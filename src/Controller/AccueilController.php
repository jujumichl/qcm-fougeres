<?php

namespace App\Controller;

use App\Entity\Qcm;
use App\Repository\QcmRepository;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class AccueilController extends AbstractController
{
    #[Route('/accueil', name: 'app_accueil')]
    public function index(QcmRepository $unQcmRepo): Response
    {
        $Qcms = $unQcmRepo->createQueryBuilder('q')
            ->leftJoin('q.createur', 'u')
            ->addSelect('u')
            ->andWhere('u.codeAd = :codeAd')
            ->setParameter('codeAd', 5)
            ->getQuery()
            ->getResult();

        dump($Qcms);
        return $this->render('accueil/index.html.twig', [
            'controller_name' => 'AccueilController',
            'Qcms' => $Qcms,
        ]);
    }
    

}


