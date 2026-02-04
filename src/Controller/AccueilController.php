<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\Qcm;
use Doctrine\ORM\EntityManagerInterface;

final class AccueilController extends AbstractController
{
    #[Route('/accueil', name: 'app_accueil')]
    public function index(): Response
    {
        return $this->render('accueil/index.html.twig', [
            'controller_name' => 'AccueilController',
        ]);
    }

    #[Route('/api/qcms', name: 'api_qcms')]
    public function getNameQcms(QcmRepository $repo): JsonResponse
    {
        $qcms = $repo->findAll();
        return $this->json($qcms);
    }
}
