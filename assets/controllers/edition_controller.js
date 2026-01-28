// assets/controllers/login_controller.js
import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="login"
export default class extends Controller {
   static targets = [ "reponse", "divReponse", "addRepBtn"] 

   // Vérifie que le controller est bien connecté et fontionnelle
   connect() {
    console.log("🔥 STIMULUS FONCTIONNE 🔥");
  }

  ajoutReponse() {
    // Vérifie si une target qcmReponse existe dans le html
    if (!this.hasDivReponseTarget) {
      console.log("Pas de conteneur de réponses trouvé !");
      return;
    }

    // On compte combien de réponses déjà existantes
    let num = this.reponseTargets.length + 1

    // Crée le nouvel élément
    const div = document.createElement("div");
    div.className = "form-check";

    // Crée le nouvel input et label
    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = "reponse"; // même groupe
    input.id = `rep${num}`;
    input.value = `Option ${num}`;
    input.className = "form-check-input";
    input.dataset.editionTarget = "reponse";

    const label = document.createElement("label");
    label.htmlFor = input.id;
    label.textContent = `Option ${num}`;
    label.className = "form-check-label";

    div.appendChild(input);
    div.appendChild(label);

    const btnRep = this.addRepBtnTarget;

    this.divReponseTarget.insertBefore(div, btnRep);
  }

  supprReponse(){
    
  }
}