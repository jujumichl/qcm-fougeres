<?php

namespace App\Entity;

use App\Repository\QcmRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: QcmRepository::class)]
class Qcm
{
    #[ORM\Id]
    #[ORM\Column(length: 8, unique: true)]
    private ?string $id = null;

    #[ORM\Column(length: 255)]
    private ?string $nom = null; 

    #[ORM\Column(nullable: true)]
    private ?string $dateDeb = null;

    #[ORM\Column(nullable: true)]
    private ?string $dateFin = null;

    #[ORM\Column]
    private ?bool $etat = null;

    #[ORM\Column(nullable: true)]
    private ?string $deletedAt = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $createur = null;


     public function __construct()
    {
        // Génère un ID hex de 8 caractères
        $this->id = bin2hex(random_bytes(4)); // 4 bytes → 8 caractères hex
    }
    
    public function getId(): ?string
    {
        return $this->id;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;

        return $this;
    }

    public function getDateDeb(): ?string
    {
        return $this->dateDeb;
    }

    public function setDateDeb(?string $dateDeb): static
    {
        $this->dateDeb = $dateDeb;

        return $this;
    }

    public function getDateFin(): ?string
    {
        return $this->dateFin;
    }

    public function setDateFin(?string $dateFin): static
    {
        $this->dateFin = $dateFin;

        return $this;
    }

    public function isEtat(): ?bool
    {
        return $this->etat;
    }

    public function setEtat(bool $etat): static
    {
        $this->etat = $etat;

        return $this;
    }

    public function getDeletedAt(): ?string
    {
        return $this->deletedAt;
    }

    public function setDeletedAt(?string $deletedAt): static
    {
        $this->deletedAt = $deletedAt;

        return $this;
    }

    public function getCreateur(): ?User
    {
        return $this->createur;
    }

    public function setCreateur(?User $createur): static
    {
        $this->createur = $createur;

        return $this;
    }
}
