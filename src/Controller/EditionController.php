<?php

namespace App\Controller;
use App\Entity\Qcm;
use App\Entity\ReponseQcm;
use App\Entity\QuestionQcm;
use App\Repository\QuestionQcmRepository;
use App\Repository\ReponseQcmRepository;
use App\Repository\QcmRepository;


use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

use Doctrine\ORM\EntityManagerInterface;

final class EditionController extends AbstractController
{

    /**
     * Récupération des données liés a un QCM (question/réponses)
     */
    #[Route('/edition/{idQcm}', name: 'app_edition')]
    public function index(
        QuestionQcmRepository $uneQuestionRepo,
        QcmRepository $unQcmRepo,
        string $idQcm
    ): Response {

        $qcm = $unQcmRepo->find($idQcm);
        
        if (!$qcm) {
            return new JsonResponse(['error' => 'QCM not found'], 404);
        }

        if ($qcm->getCreateur()->getUserIdentifier() !== $this->getUser()->getUserIdentifier()) {
            return new JsonResponse(['error' => 'Not your QCM'], 403);
        }

        $questions = $uneQuestionRepo->createQueryBuilder('q')
            ->leftJoin('q.idQcm', 'r')
            ->addSelect('r')
            ->where('q.idQcm = :id')
            ->setParameter('id', $idQcm)
            ->getQuery()
            ->getResult();

        $titleDesc = $unQcmRepo->findTitleAndDesc($idQcm);

        dump($titleDesc);
        dump($qcm);
        return $this->render('edition/index.html.twig', [
            'controller_name' => 'EditionController',
            'qcm' => $qcm,
            'questions' => $questions,
            'td' => $titleDesc,
        ]);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////// Question ///////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Création d'une question
     */
    #[Route('/edition/{idQcm}/question/add', name: 'edition_question_add', methods: ['POST'])]
    public function createQuestion(Request $request, EntityManagerInterface $em, string $idQcm): JsonResponse
    {
        if (!$this->isCsrfTokenValid('qcm_action', $data['_token'] ?? '')) {
            return new JsonResponse(['error' => 'Invalid CSRF token'], 403);
        }


        $data = json_decode($request->getContent(), true);

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
        $q = new QuestionQcm();
        $q->setQuestion($data['questionTxt']);
        $q->setIdQcm($idQcm ?? null);

        $em->persist($q);
        $em->flush();

        return new JsonResponse([
            'id' => $q->getId(),
            'idQcm' => $q->getIdQcm(),
        ]);
    }

    /**
     * Suppression d'une question
     */
    #[Route('/edition/{idQcm}/{idQuestion}/remove', name: 'edition_question_remove', methods: ['POST'])]
    public function removeQuestion(Request $request, EntityManagerInterface $em, string $idQcm, QuestionQcmRepository $uneQuestionRepo, string $idQuestion): JsonResponse
    {
        if (!$this->isCsrfTokenValid('qcm_action', $data['_token'] ?? '')) {
            return new JsonResponse(['error' => 'Invalid CSRF token'], 403);
        }

        $q = $uneQuestionRepo->find($idQuestion ?? null);

        if (!$q) {
            return new JsonResponse(['error' => 'QCM not found'], 404);
        }

        $data = json_decode($request->getContent(), true);

        $em->remove($q);
        $em->flush();

        return new JsonResponse(['success' => true]);
    }

    /**
     * Mise à jours d'une question
     */
    #[Route('/edition/{idQcm}/{idQuestion}/update', name: 'edition_question_update', methods: ['POST', 'PUT'])]
    public function updateQuestion(Request $request, EntityManagerInterface $em, string $idQcm, QuestionQcmRepository $uneQuestionRepo, string $idQuestion): JsonResponse
    {
        if (!$this->isCsrfTokenValid('qcm_action', $data['_token'] ?? '')) {
            return new JsonResponse(['error' => 'Invalid CSRF token'], 403);
        }

        $q = $uneQuestionRepo->find($idQuestion ?? null);

        if (!$q) {
            return new JsonResponse(['error' => 'QCM not found'], 404);
        }

        $data = json_decode($request->getContent(), true);
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
        $q->setQuestion($data['questionTxt']);
        $q->setIdQcm($idQcm);

        $em->persist($q);
        $em->flush();

        return new JsonResponse(['success' => true]);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////// Titre/Description ///////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Création d'un titre et d'une description d'un QCM
     */
    #[Route('/edition/{idQcm}/titre', name: 'edition_question_titre', methods: ['POST', 'PUT'])]
    public function titre(Request $request, EntityManagerInterface $em, QcmRepository $unQcmRepo, string $idQcm): JsonResponse
    {
        if (!$this->isCsrfTokenValid('qcm_action', $data['_token'] ?? '')) {
            return new JsonResponse(['error' => 'Invalid CSRF token'], 403);
        }

        $q = $unQcmRepo->find($idQcm ?? null);

        if (!$q) {
            return new JsonResponse(['error' => 'QCM not found'], 404);
        }

        $data = json_decode($request->getContent(), true);
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        $q->setTitre($data['titre']);
        $q->setDescription($data['description']);

        $em->persist($q);
        $em->flush();

        return new JsonResponse([
            'id' => $q->getId(),
            'Titre' => $q->getTitre(),
            'Description' => $q->getDescription(),
        ]);
    }

    #[Route('/edition/{idQcm}/titre/update', name: 'edition_question_titre_update', methods: ['POST', 'PUT'])]
    public function updateTitre(Request $request, EntityManagerInterface $em, QcmRepository $unQcmRepo, string $idQcm): JsonResponse
    {
        if (!$this->isCsrfTokenValid('qcm_action', $data['_token'] ?? '')) {
            return new JsonResponse(['error' => 'Invalid CSRF token'], 403);
        }

        $q = $unQcmRepo->find($idQcm ?? null);

        if (!$q) {
            return new JsonResponse(['error' => 'QCM not found'], 404);
        }

        $data = json_decode($request->getContent(), true);
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        $q->setTitre($data['titre']);
        $q->setDescription($data['description']);

        $em->persist($q);
        $em->flush();

        return new JsonResponse([
            'id' => $q->getId(),
            'Titre' => $q->getTitre(),
            'Description' => $q->getDescription(),
        ]);
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////// Réponse ////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////


    /**
     * Création d'une réponse
     */
    #[Route('/edition/{idQcm}/{idQuestion}/reponse/add', name: 'edition_reponse_add', methods: ['POST', 'PUT'])]
    public function createReponse(Request $request, EntityManagerInterface $em, ReponseQcmRepository $uneReponseRepo, string $idQcm, string $idQuestion): JsonResponse
    {
        if (!$this->isCsrfTokenValid('qcm_action', $data['_token'] ?? '')) {
            return new JsonResponse(['error' => 'Invalid CSRF token'], 403);
        }

        $data = json_decode($request->getContent(), true);

        $r = new ReponseQcm();
        $r->setIdQuestion($idQuestion ?? null);
        $r->setType($data['type']);
        $r->setReponse($data['reponse']);
        $r->setBonneRep($data['bonneRep']);
        $r->setPosition($data['pos']);
        $r->setPriorite($data['prio']);


        $em->persist($r);
        $em->flush();

        return new JsonResponse([
            'id' => $r->getId(),
        ]);
    }

    /**
     * Suppression d'une réponse
     */
    #[Route('/edition/{idQcm}/{idQuestion}/{idReponse}', name: 'edition_reponse_remove', methods: ['POST'])]
    public function removeReponse(Request $request, EntityManagerInterface $em, string $idQcm, QuestionQcmRepository $uneQuestionRepo, string $idQuestion, string $idReponse): JsonResponse
    {

        if (!$this->isCsrfTokenValid('qcm_action', $data['_token'] ?? '')) {
            return new JsonResponse(['error' => 'Invalid CSRF token'], 403);
        }

        $data = json_decode($request->getContent(), true);

        $r = $uneQuestionRepo->find($idReponse ?? null);

        if (!$r) {
            return new JsonResponse(['error' => 'Response not found'], 404);
        }

        $em->remove($r);
        $em->flush();

        return new JsonResponse(['success' => true]);
    }

    /**
     * Màj d'une réponse
     */
    #[Route('/edition/{idQcm}/{idQuestion}/reponse/update', name: 'edition_reponse_add', methods: ['POST', 'PUT'])]
    public function updateReponse(Request $request, EntityManagerInterface $em, ReponseQcmRepository $uneReponseRepo, string $idQcm, string $idQuestion): JsonResponse
    {
        if (!$this->isCsrfTokenValid('qcm_action', $data['_token'] ?? '')) {
            return new JsonResponse(['error' => 'Invalid CSRF token'], 403);
        }

        $data = json_decode($request->getContent(), true);
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        $r = new ReponseQcm();
        $r->setIdQuestion($idQuestion ?? null);
        $r->setType($data['type']);
        $r->setReponse($data['reponse']);
        $r->setBonneRep($data['bonneRep']);
        $r->setPosition($data['pos']);
        $r->setPriorite($data['prio']);


        $em->persist($r);
        $em->flush();

        return new JsonResponse([
            'id' => $r->getId(),
        ]);
    }

    /**
     * R question
     * R reponse
     */
}
