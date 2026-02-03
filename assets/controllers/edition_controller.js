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
    const inputTxt = document.createElement("input");
    inputTxt.type = "text";
    inputTxt.name = "editRep";
    inputTxt.id = `rep${num}`;
    inputTxt.className = "form-control mb-3"; // me-4
    if (num === 1) {
      inputTxt.placeholder = "Mettez une réponse...";
    }

    div.append(btnSuppr, inputUser, inputTxt);

    this.bodyReponseTarget.append(div);
  }

  supprReponse(event) {
    event.preventDefault();

    // bouton cliqué
    const button = event.currentTarget;

    // on remonte à la div parente qui contient les inputs et le bouton supprimer
    const reponseDiv = button.parentElement;

    reponseDiv.remove();
  }

  ajoutQuestion(event) {
    event.preventDefault(); 

    const formQcm = this.formQcmTarget
    let numQ = this.questionTargets.length + 1

    const divCardMain = document.createElement("div");
    divCardMain.className = "card mt-5 mx-auto";

    //#region Card header (Questions)
    const divCardHeader = document.createElement("div");
    divCardHeader.className = "card-header d-flex align-items-start gap-2";

    const questionLabel = document.createElement("label");
    questionLabel.htmlFor = `q${numQ}`;
    questionLabel.className = "col-form-label mt-2";
    questionLabel.textContent = `${numQ}.`;

    const questionTxt = document.createElement("textarea");
    questionTxt.id = `q${numQ}`;
    questionTxt.name = "question";
    questionTxt.rows = 1;
    questionTxt.dataset.editionTarget = "question"
    questionTxt.style.resize = "none";
    questionTxt.className = "form-control mt-1 mb-1";
    questionTxt.placeholder = "Insérez votre question...";

    divCardHeader.append(questionLabel, questionTxt);
    //#endregion

    //#region Card body (Rep + icon suppression)
    const divCardBody = document.createElement("div");
    divCardBody.className = "card-body";
    divCardBody.dataset.editionTarget = "divReponse";

    const divRep = document.createElement("div");
    divRep.className = "mt-auto text-end";
    // divRep.dataset.editionTarget = "addRepBtn";

    const addRepBtn = document.createElement("button");
    addRepBtn.className = "btn btn-bottom-right";
    addRepBtn.dataset.action = "click->edition#ajoutReponse";
    addRepBtn.title = "Ajouter une Réponse";

    const iconBtnRep = document.createElement("i");
    iconBtnRep.className = "bi bi-plus-lg";

    addRepBtn.append(iconBtnRep);
    divRep.append(addRepBtn);
    divCardBody.append( divRep);
     //#endregion

    divCardMain.append(divCardHeader, divCardBody);
    formQcm.append(divCardMain);
  }

}