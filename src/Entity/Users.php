<?php

namespace App\Entity;

use Symfony\Component\Security\Core\User\UserInterface;
use App\Repository\UsersRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UsersRepository::class)]
class Users
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: 'string', unique: true)]
    private ?string $codeAd = null;

    #[ORM\Column]
    private ?bool $admin = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getcodeAd(): ?string
    {
        return $this->codeAd;
    }

    public function setcodeAd(string $codeAd): static
    {
        $this->codeAd = $codeAd;

        return $this;
    }

    public function isAdmin(): ?bool
    {
        return $this->admin;
    }

    public function setAdmin(bool $admin): static
    {
        $this->admin = $admin;

        return $this;
    }
}
