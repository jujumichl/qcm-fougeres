<?php

namespace App\Controller;

use App\Entity\Qcm;
use App\Repository\QcmRepository;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils; //ajt

final class AccueilController extends AbstractController
{
    #[Route('/accueil', name: 'app_accueil')]
    public function index(QcmRepository $unQcmRepo, AuthenticationUtils $authUtils): Response
    {
        $Qcms = $unQcmRepo->createQueryBuilder('q')
            ->leftJoin('q.createur', 'u')
            ->addSelect('u')
            ->andWhere('u.usernameAD = :usernameAD')
            ->setParameter('usernameAD', 5)
            ->getQuery()
            ->getResult();

        dump($Qcms);
        return $this->render('accueil/index.html.twig', [
            'controller_name' => 'AccueilController',
            'Qcms' => $Qcms,
        ]);
    }
    #[Route(path: '/logout', name: 'app_logout', methods: ['GET'])]
    public function logout(): void
    {
        // Symfony gère automatiquement la déconnexion via le firewall.
        // Cette méthode ne doit jamais être appelée directement.
    }

}


