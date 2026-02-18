// assets/controllers/login_controller.js
import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="login"
export default class extends Controller {
   static values = { accueil: String } 

   connect() {
    console.log("Login controller connected");

  }

  disconnect() {
    // Nettoyage lors de la déconnexion du contrôleur
    console.log("Login controller disconnected");
  }

  redirectVersAccueil() {
    // Redirection vers la route Symfony '/accueil'
    window.location.href = this.accueilValue;
  }
}
