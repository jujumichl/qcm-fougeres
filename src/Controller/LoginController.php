<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class LoginController extends AbstractController
{
    #[Route(path: '/', name: 'app_home')]
    public function index(): Response
    {
        return $this->redirectToRoute(route: 'page_login');
    }

    #[Route(path: '/login', name: 'page_login', methods: ['GET', 'POST'])]
    public function login(): Response
    {
        return $this->render(view: 'login/index.html.twig', parameters: [
            'controller_name' => 'LoginController',
        ]);
    }
}
