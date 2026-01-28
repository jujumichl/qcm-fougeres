// assets/controllers/login_controller.js
import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="login"
export default class extends Controller {
  static targets = ["reponse", "divReponse", "addRepBtn"]

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

    if(num - 1 > 0){  
      let targetNum = this.reponseTargets[num - 2].id;
      targetNum = targetNum.split("p") 
      num = Number(targetNum[1]) + 1
      console.log(num);
    }

    if (this.reponseTargets.length < 5) {
      
      // Crée le nouvel élément
      const div = document.createElement("div");
      div.className = "d-flex align-items-center gap-2";

      const btnSuppr = document.createElement("button");
      btnSuppr.type = "button";
      btnSuppr.className = "btn";
      btnSuppr.title = "supprimer";
      btnSuppr.dataset.action = "click->edition#supprReponse";

      // Création de l’icône
      const icon = document.createElement("i");
      icon.className = "bi bi-dash-circle";
      icon.style.color = "red";

      // Ajout de l’icône dans le bouton
      btnSuppr.appendChild(icon);

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

      div.appendChild(btnSuppr);
      div.appendChild(input);
      div.appendChild(label);

      const btnRep = this.addRepBtnTarget;

      this.divReponseTarget.insertBefore(div, btnRep);
    }
  }
  supprReponse(event) {
    // bouton cliqué
    const button = event.currentTarget;

    // on remonte à la div parente
    const reponseDiv = button.parentElement;

    reponseDiv.remove();
  }
}