import { startStimulusApp } from '@symfony/stimulus-bridge';
// Bootstrap
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
// Styles
import './styles/app.scss';
import './styles/login.scss';
<<<<<<< HEAD

import { startStimulusApp } from '@symfony/stimulus-bridge';

=======
import './styles/accueil.scss';
// Stimulus
>>>>>>> origin/ui_acceuil_ju
export const app = startStimulusApp(require.context(
  '@symfony/stimulus-bridge/lazy-controller-loader!./controllers',
  true,
  /\.js$/
));

console.log('APP.JS CHARGÉ');
