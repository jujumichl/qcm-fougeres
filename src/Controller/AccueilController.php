<?php

namespace App\Controller;

use App\Entity\Qcm;
use App\Entity\User;
use App\Repository\QcmRepository;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;


final class AccueilController extends AbstractController
{
    #[Route('/accueil', name: 'app_accueil')]
    public function index(QcmRepository $unQcmRepo): Response
    {
    $user = $this->getUser();

    $userQcm = $unQcmRepo->createQueryBuilder('q')
            ->leftJoin('q.createur', 'u')
            ->addSelect('u')
            ->andWhere('u.usernameAD = :usernameAD')
            ->setParameter('usernameAD', $user->getUsername())
            ->getQuery()
            ->getResult();
        
        dump($userQcm);
        dump($user);
        return $this->render('accueil/index.html.twig', [
            'controller_name' => 'AccueilController',
            'Qcms' => $userQcm,
        ]);
    }
    #[Route(path: '/logout', name: 'app_logout', methods: ['GET'])]
    public function logout(): void
    {
        /*
            Symfony gère automatiquement la déconnexion via le firewall.
            Cette méthode ne doit jamais être appelée directement. 
         */
    }

   #[Route('/qcm/create', name: 'qcm_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $qcm = new Qcm();
        $qcm->setName($data['name'] ?? 'Nouveau QCM');

        $qcm->setCreateur($this->getUser());

        $em->persist($qcm);
        $em->flush();

        return new JsonResponse([
            'id' => $qcm->getId(),
            'name' => $qcm->getName()
        ]);
    }


}


