<?php

namespace App\Controller;

use Symfony\Component\Security\Http\Authentication\AuthenticationUtils; //ajt
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class LoginController extends AbstractController
{
    #[Route(path: '/', name: 'app_home')]
    public function index(): Response
    {
        return $this->redirectToRoute(route: 'app_login');
    }

    #[Route(path: '/login', name: 'app_login', methods: ['GET', 'POST'])]
    public function login(AuthenticationUtils $authUtils): Response
    {
        // Récupération des erreurs
        $error = $authUtils->getLastAuthenticationError();

        // Nom de compte
        $lastUsername = $authUtils->getLastUsername();

        return $this->render(view: 'login/index.html.twig', parameters: [
            'last_username' => $lastUsername,
            'error' => $error,
        ]);
    }
}
