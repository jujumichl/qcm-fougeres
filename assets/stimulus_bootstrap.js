import { startStimulusApp } from '@symfony/stimulus-bridge';

export const app = startStimulusApp(require.context( // require => fontion de WebPack
  '@symfony/stimulus-bridge/lazy-controller-loader!./controllers', // Charges uniquement les controlleurs qui sont appelés dans une page twig 
  true, // inclut les sous‑dossiers aussi
  /\.js$/ // récupère uniquement les fichiers JS
));
// register any custom, 3rd party controllers here
// app.register('some_controller_name', SomeImportedController);
