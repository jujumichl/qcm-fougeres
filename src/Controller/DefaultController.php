<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;

class DefaultController extends AbstractController
{
    #[Route('/index', name: 'index', methods: [GET])]
    public function index(): Response
    {
        return $this->render('default/index.html.twig');
    }

    #[Route('/info', name: 'info', methods: [GET])]
    public function info(): Response
    {
        return $this->render('default/info.html.twig', [
            "info" => "ahahahaha",
        ]);
    }
}
