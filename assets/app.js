import { startStimulusApp } from '@symfony/stimulus-bridge';
import '@hotwired/turbo';
// Bootstrap
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
// Styles
import './styles/app.scss';
import './styles/login.scss';
import './styles/accueil.scss';
// Stimulus
export const app = startStimulusApp(require.context(
  '@symfony/stimulus-bridge/lazy-controller-loader!./controllers',
  true,
  /\.js$/
));

console.log('APP.JS CHARGÉ');
