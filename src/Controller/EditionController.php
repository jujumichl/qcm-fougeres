<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class EditionController extends AbstractController
{
    #[Route('/edition', name: 'app_edition')]
    public function index(): Response
    {
        return $this->render('edition/index.html.twig', [
            'controller_name' => 'EditionController',
        ]);
    }
}
