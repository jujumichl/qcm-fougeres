import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="login"
export default class extends Controller {
  // Définir une cible pour le CSRF token
   static targets = ["csrfToken"];

    // Cette méthode est appelée lorsque le controller est connecté à l'élément HTML
    connect() {
        // Récupérer le CSRF token depuis l'élément HTML
        const csrfToken = this.csrfTokenTarget.value;

        // Stocker le CSRF token dans le sessionStorage
        sessionStorage.setItem("csrf_token", csrfToken);

        // Vérifier si le token est correctement stocké
        console.log("CSRF Token stored in sessionStorage:", sessionStorage.getItem("csrf_token"));
    }
}
