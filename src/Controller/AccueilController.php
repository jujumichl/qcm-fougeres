<?php

namespace App\Controller;

use App\Entity\Qcm;
use App\Repository\QcmRepository;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

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
            ->where('q.etat = 1')
            ->andWhere('u.usernameAD = :usernameAD')
            ->setParameter('usernameAD', $user->getUserIdentifier())
            ->getQuery()
            ->getResult();

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

        if (!$this->isCsrfTokenValid('qcm_action', $data['_token'] ?? '')) {
            return new JsonResponse(['error' => 'Invalid CSRF token'], 403);
        }

        $qcm = new Qcm();
        $qcm->setNom($data['name'] ?? 'Nouveau QCM');
        $qcm->setTitre($data['title'] ?? 'New title');
        $qcm->setDescription($data['description'] ?? "descriptif du but du QCM");
        $qcm->setEtat(true);
        $qcm->setCreateur($this->getUser());

        $em->persist($qcm);
        $em->flush();

        return new JsonResponse([
            'id'   => $qcm->getId(),
            'name' => $qcm->getNom(),
        ]);
    }

    #[Route('/qcm/delete', name: 'qcm_delete', methods: ['PUT'])]
    public function delete(Request $request, EntityManagerInterface $em, QcmRepository $unQcmRepo): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$this->isCsrfTokenValid('qcm_action', $data['_token'] ?? '')) {
            return new JsonResponse(['error' => 'Invalid CSRF token'], 403);
        }

        $qcm = $unQcmRepo->find($data['id'] ?? null);
        if (!$qcm) {
            return new JsonResponse(['error' => 'QCM not found'], 404);
        }

        // Vérification que le QCM appartient bien à l'utilisateur connecté
        if ($qcm->getCreateur()->getUserIdentifier() !== $this->getUser()->getUserIdentifier()) {
            return new JsonResponse(['error' => 'Not your QCM'], 403);
        }

        $date       = new \DateTimeImmutable();
        $datePlus7  = $date->modify('+7 days');

        $qcm->setDeletedAt($date->format('d/m/Y'));
        $qcm->setEtat(false);

        $em->persist($qcm);
        $em->flush();

        return new JsonResponse([
            'id'        => $qcm->getId(),
            'name'      => $qcm->getNom(),
            'date'      => $date->format('d/m/Y'),
            'dateSuppr' => $datePlus7->format('d/m/Y'),
        ]);
    }

    #[Route('/qcm/retrieve', name: 'qcm_retrieve', methods: ['PUT'])]
    public function retrieve(Request $request, EntityManagerInterface $em, QcmRepository $unQcmRepo): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$this->isCsrfTokenValid('qcm_action', $data['_token'] ?? '')) {
            return new JsonResponse(['error' => 'Invalid CSRF token'], 403);
        }

        $qcm = $unQcmRepo->find($data['id'] ?? null);
        if (!$qcm) {
            return new JsonResponse(['error' => 'QCM not found'], 404);
        }

        if ($qcm->getCreateur()->getUserIdentifier() !== $this->getUser()->getUserIdentifier()) {
            return new JsonResponse(['error' => 'Not your QCM'], 403);
        }

        $qcm->setDeletedAt(null);
        $qcm->setEtat(true);

        $em->persist($qcm);
        $em->flush();

        return new JsonResponse([
            'id'   => $qcm->getId(),
            'name' => $qcm->getNom(),
        ]);
    }

    #[Route('/qcm/corbeille', name: 'qcm_corbeille', methods: ['GET'])]
    public function corbeille(QcmRepository $unQcmRepo): JsonResponse
    {
        $user = $this->getUser();

        $corbeille = $unQcmRepo->createQueryBuilder('q')
            ->leftJoin('q.createur', 'u')
            ->addSelect('u')
            ->where('q.etat = 0')
            ->andWhere('u.usernameAD = :usernameAD')
            ->setParameter('usernameAD', $user->getUserIdentifier())
            ->getQuery()
            ->getArrayResult();

        // Formatage explicite pour s'assurer que les données sont bien exposées
        $result = array_map(fn($q) => [
            'id'        => $q['id'],
            'nom'       => $q['nom'],
            'deletedAt' => $q['deletedAt'],
        ], $corbeille);

        return $this->json(['corbeille' => $result]);
    }

    #[Route('/qcm/rename', name: 'qcm_rename', methods: ['PUT'])]
    public function rename(Request $request, EntityManagerInterface $em, QcmRepository $unQcmRepo): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$this->isCsrfTokenValid('qcm_action', $data['_token'] ?? '')) {
            return new JsonResponse(['error' => 'Invalid CSRF token'], 403);
        }

        $qcm = $unQcmRepo->find($data['id'] ?? null);
        if (!$qcm) {
            return new JsonResponse(['error' => 'QCM not found'], 404);
        }

        if ($qcm->getCreateur()->getUserIdentifier() !== $this->getUser()->getUserIdentifier()) {
            return new JsonResponse(['error' => 'Not your QCM'], 403);
        }

        if (empty($data['name'])) {
            return new JsonResponse(['error' => 'Name cannot be empty'], 400);
        }

        $qcm->setNom($data['name']);

        $em->persist($qcm);
        $em->flush();

        return new JsonResponse([
            'id'   => $qcm->getId(),
            'name' => $qcm->getNom(),
        ]);
    }

    #[Route('/qcm/{id}', name: 'qcm_get', methods: ['GET'])]
    public function getQcm(QcmRepository $unQcmRepo, string $id): JsonResponse
    {
        $qcm = $unQcmRepo->find($id);
        if (!$qcm) {
            return new JsonResponse(['error' => 'QCM not found'], 404);
        }

        if ($qcm->getCreateur()->getUserIdentifier() !== $this->getUser()->getUserIdentifier()) {
            return new JsonResponse(['error' => 'Not your QCM'], 403);
        }

        // Sérialisation manuelle : JsonResponse ne peut pas sérialiser une entité Doctrine
        return new JsonResponse([
            'qcm' => [
                'id'        => $qcm->getId(),
                'nom'       => $qcm->getNom(),
                'etat'      => $qcm->getEtat(),
                'deletedAt' => $qcm->getDeletedAt(),
            ],
        ]);
    }

   

}