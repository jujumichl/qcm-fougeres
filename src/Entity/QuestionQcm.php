<?php

namespace App\Entity;

use App\Repository\QuestionQcmRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: QuestionQcmRepository::class)]
class QuestionQcm
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $question = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Qcm $idQcm = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getQuestion(): ?string
    {
        return $this->question;
    }

    public function setQuestion(string $question): static
    {
        $this->question = $question;

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
