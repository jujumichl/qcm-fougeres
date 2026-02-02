// assets/controllers/login_controller.js
import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="login"
export default class extends Controller {
  static targets = ["reponse", "bodyReponse"]

  ajoutReponse() {

    // On compte combien de réponses déjà existantes
    let num = this.reponseTargets.length + 1

    if (num - 1 > 0) {
      let targetNum = this.reponseTargets[num - 2].id;
      targetNum = targetNum.split("p");
      num = Number(targetNum[1]) + 1;
      console.log(num);
    }

    // Crée le nouvel élément
    const div = document.createElement("div");
    div.className = "d-flex align-items-center gap-3";

    const btnSuppr = document.createElement("button");
    btnSuppr.type = "button";
    btnSuppr.className = "btn mb-3";
    btnSuppr.title = "supprimer";
    btnSuppr.dataset.action = "click->edition#supprReponse";

    // Création de l’icône
    const icon = document.createElement("i");
    icon.className = "bi bi-dash-circle";
    icon.style.color = "red";

    // Ajout de l’icône dans le bouton
    btnSuppr.appendChild(icon);

    // Crée le nouvel input qui sera visible côté utilisateur
    const inputUser = document.createElement("input");
    inputUser.type = "checkbox";
    inputUser.name = "userRep"; // même groupe pour tous les inputs user
    inputUser.id = `repUser${num}`;
    inputUser.className = "form-check-input mb-3";
    inputUser.dataset.editionTarget = "reponse";
    inputUser.disabled = "true";

    // Crée le nouvel input pour insérer une réponse côté edition
    const inputRep = document.createElement("input");
    inputRep.type = "text";
    inputRep.name = "editRep";
    inputRep.id = `rep${num}`;
    inputRep.className = "form-control mb-3";
    if (num === 1) {
      inputRep.placeholder = "Mettez une réponse...";
    }

    div.append(btnSuppr);
    div.append(inputUser);
    div.append(inputRep);

    this.bodyReponseTarget.append(div);
  }

  supprReponse(event) {
    // bouton cliqué
    const button = event.currentTarget;

    // on remonte à la div parente
    const reponseDiv = button.parentElement;

    reponseDiv.remove();
  }

}