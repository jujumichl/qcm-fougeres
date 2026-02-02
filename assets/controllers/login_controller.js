// assets/controllers/login_controller.js
import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="login"
export default class extends Controller {
   static values = { accueil: String } 

   // Vérifie que le controller est bien connecté et fontionnelle
   connect() {
    console.log("🔥 STIMULUS FONCTIONNE 🔥");
  }

  redirectVersAccueil() {
    // Redirection vers la route Symfony '/accueil'
    window.location.href = this.accueilValue;
  }
}
