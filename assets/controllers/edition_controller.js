// assets/controllers/login_controller.js
import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="login"
export default class extends Controller {
  static targets = ["reponse", "divReponse", "addRepBtn", "formQcm"]

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
      div.classList.add("d-flex", "align-items-center", "gap-3", "mb-3");

      const btnSuppr = document.createElement("button");
      btnSuppr.type = "button";
      btnSuppr.classList.add("btn");
      btnSuppr.title = "supprimer une réponse";
      btnSuppr.dataset.action = "click->edition#supprReponse";

      // Création de l’icône
      const icon = document.createElement("i");
      icon.classList.add("bi", "bi-dash-circle");
      icon.style.color = "red";

      // Ajout de l’icône dans le bouton
      btnSuppr.appendChild(icon);

      // Créer l'input pour l'utilisateur
      const inputUser = document.createElement("input");
      inputUser.type = "checkbox";
      inputUser.name = "userReponse";
      inputUser.classList.add("form-check-input");
      inputUser.id = `userRep${num}`;
      inputUser.disabled = true;

      // Créer l'input pour insérer une réponse coté edition
      const inputTxt = document.createElement("input");
      inputTxt.type = "text";
      inputTxt.name = "reponseEdition";
      inputTxt.classList.add("form-control", "me-4");
      inputTxt.id = `rep${num}`;
      inputTxt.dataset.editionTarget = "reponse";
      if(inputTxt.id == "rep1"){
        inputTxt.placeholder = "Ecrivez une réponse..."
      }

      div.appendChild(btnSuppr);
      div.append(inputUser);
      div.appendChild(inputTxt);

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