<?php

namespace App\Repository;

use App\Entity\Qcm;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Qcm>
 */
class QcmRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Qcm::class);
    }

    public function findTitleAndDesc(string $id): ?array
    {
        return $this->createQueryBuilder('q')
            ->select('q.titre', 'q.description')
            ->where('q.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getOneOrNullResult(\Doctrine\ORM\Query::HYDRATE_ARRAY);
    }

    public function findDates(string $id): ?array
    {
        return $this->createQueryBuilder('q')
            ->select('q.dateDeb', 'q.dateFin')
            ->where('q.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getOneOrNullResult(\Doctrine\ORM\Query::HYDRATE_ARRAY);
    }

    public function findUserQcm($user)
    {
        return $this->createQueryBuilder('q')
            ->leftJoin('q.createur', 'u')
            ->addSelect('u')
            ->where('q.etat = 1')
            ->andWhere('u.usernameAD = :usernameAD')
            ->setParameter('usernameAD', $user->getUserIdentifier())
            ->getQuery()
            ->getResult();
    }
}
