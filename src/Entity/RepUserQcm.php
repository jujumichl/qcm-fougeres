<?php

namespace App\Entity;

use App\Repository\RepUserQcmRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: RepUserQcmRepository::class)]
class RepUserQcm
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?ReponseQcm $Rep = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Users $User = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Qcm $idQcm = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getRep(): ?ReponseQcm
    {
        return $this->Rep;
    }

    public function setRep(?ReponseQcm $Rep): static
    {
        $this->Rep = $Rep;

        return $this;
    }

    public function getUser(): ?Users
    {
        return $this->User;
    }

    public function setUser(?Users $User): static
    {
        $this->User = $User;

        return $this;
    }

    public function getIdQcm(): ?Qcm
    {
        return $this->idQcm;
    }

    public function setIdQcm(?Qcm $idQcm): static
    {
        $this->idQcm = $idQcm;

        return $this;
    }
}
