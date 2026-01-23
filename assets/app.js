/*
 * Welcome to your app's main JavaScript file!
 *
 * This file will be included onto the page via the importmap() Twig function,
 * which should already be in your base.html.twig.
 */

// Styles principaux et Bootstrap
import './styles/app.scss';

// Styles page login
import './styles/login.scss';

// Bootstrap JS
import 'bootstrap';

import './stimulus_bootstrap'; // Stimulus Bridge (Symfony UX)

// Bootstrap Icons
import 'bootstrap-icons/font/bootstrap-icons.css';

console.log('This log comes from assets/app.js - welcome to AssetMapper! 🎉');
