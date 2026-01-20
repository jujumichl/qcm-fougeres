<?php

namespace App;

use Symfony\Bundle\FrameworkBundle\Kernel\MicroKernelTrait;
use Symfony\Component\HttpKernel\Kernel as BaseKernel;
use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;
use Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator;

class Kernel extends BaseKernel
{
    use MicroKernelTrait;

    protected function configureContainer(ContainerConfigurator $container): void
    {
        $container->import($this->getProjectDir().'/config/packages/*.yaml');
        $container->import($this->getProjectDir().'/config/packages/'.$this->environment.'/*.yaml');
        $container->import($this->getProjectDir().'/config/services.yaml');
    }

    protected function configureRoutes(RoutingConfigurator $routes): void
    {
        // 🔥 IMPORTANT : importer le fichier config/routes.yaml
        $routes->import($this->getProjectDir().'/config/routes.yaml');

        // 🔥 IMPORTANT : importer les routes dans config/routes/
        $routes->import($this->getProjectDir().'/config/routes/*.yaml');
        $routes->import($this->getProjectDir().'/config/routes/'.$this->environment.'/*.yaml');

        // 🔥 IMPORTANT : importer les routes via attributs dans les controllers
        $routes->import($this->getProjectDir().'/src/Controller/', 'attribute');
    }
}
