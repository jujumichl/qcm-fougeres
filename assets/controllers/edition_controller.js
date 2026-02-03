// assets/controllers/login_controller.js
import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="login"
export default class extends Controller {
  static targets = ["reponse", "bodyReponse"]

  ajoutReponse() {
 
    // On compte combien de réponses déjà existante
    let num = this.reponseTargets.length + 1

    // Permet de générer et d’insérer un chiffre unique dans l’ID des réponses
    if (num - 1 > 0) {
      /**
       * Récupère l'id de l'avant avant dernière réponse
       * exemple d'id pour la 1ère réponse : rep1 
       */ 
      let targetNum = this.reponseTargets[num - 2].id;

      //On fais un split pour récupérer que le chiffre
      targetNum = targetNum.split("p");

      // On ajoute 1 à chaque boucle
      num = Number(targetNum[1]) + 1;
      console.log(num);
    }

    // Crée la div qui contient les élements d'une réponse côté editeur
    const div = document.createElement("div");
    div.className = "d-flex align-items-center gap-3";

    // bouton pour supprimer une réponse
    const btnSuppr = document.createElement("button");
    btnSuppr.type = "button";
    btnSuppr.className = "btn mb-3";
    btnSuppr.title = "supprimer";
    btnSuppr.dataset.action = "click->edition#supprReponse";

    // Création de l’icône supprimer
    const icon = document.createElement("i");
    icon.className = "bi bi-dash-circle";
    icon.style.color = "red";

    // Ajout de l’icône dans le bouton
    btnSuppr.appendChild(icon);

    // Crée le nouvel input qui sera visible côté utilisateur
    const inputUser = document.createElement("input");
    inputUser.type = "checkbox";
    inputUser.name = "userRep"; // même groupe pour tous les inputs user
    inputUser.id = `repUser${num}`; // Le num est récupérer par la boucle IF
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

    div.append(btnSuppr, inputUser, inputRep);

    this.bodyReponseTarget.append(div);
  }

  supprReponse(event) {
    // bouton cliqué
    const button = event.currentTarget;

    // on remonte à la div parente qui contient les inputs et le bouton supprimer
    const reponseDiv = button.parentElement;

    reponseDiv.remove();
  }

}