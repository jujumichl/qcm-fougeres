<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use App\Entity\Role;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;

class RoleFixtures extends Fixture implements FixtureGroupInterface
{
    public function load(ObjectManager $manager): void
    {
        $roles = ['ROLE_USER', 'ROLE_ADMIN'];

        foreach ($roles as $roleName) {
            $role = new Role();
            $role->setName($roleName);
            $manager->persist($role);
        }

        $manager->flush();
    }

    public static function getGroups(): array
    {
        return ['roles']; // nom du groupe
    }
}
