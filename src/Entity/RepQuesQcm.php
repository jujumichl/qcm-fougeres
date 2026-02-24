<?php

namespace App\Entity;

use App\Repository\RepQuesQcmRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: RepQuesQcmRepository::class)]
class RepQuesQcm
{

    #[ORM\Id]
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?QuestionQcm $idQ = null;

    #[ORM\Id]
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?ReponseQcm $idR = null;

    public function getIdQ(): ?QuestionQcm
    {
        return $this->idQ;
    }

    public function setIdQ(?QuestionQcm $idQ): static
    {
        $this->idQ = $idQ;

        return $this;
    }

    public function getIdR(): ?ReponseQcm
    {
        return $this->idR;
    }

    public function setIdR(?ReponseQcm $idR): static
    {
        $this->idR = $idR;

        return $this;
    }
}
