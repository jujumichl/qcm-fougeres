// assets/controllers/login_controller.js
import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="login"
export default class extends Controller {
  static targets = ["reponse", "divReponse", "addRepBtn", "formQcm", "question"]

  //if (document.getElementsByClassName('btn btn-bottom-right')[0].parentElement.previousElementSibling) {id = 1 } else {if id précédent < 6 -> id pécédent +1 sinon non}

  // Vérifie que le controller est bien connecté et fontionnelle
  connect() {
    console.log("🔥 STIMULUS FONCTIONNE 🔥");
  }

  ajoutReponse(event) {
    event.preventDefault(); // éviter le comportement par défaut du bouton

    // On compte combien de réponses déjà existantes
    let numR = this.reponseTargets.length + 1

    if (numR - 1 > 0) {
      let targetNumR = this.reponseTargets[numR - 2].id;
      targetNumR = targetNumR.split("p")
      numR = Number(targetNumR[1]) + 1
      console.log(numR);
    }

    if (this.reponseTargets.length >= 5) return;

      // Crée le nouvel élément
      const div = document.createElement("div");
      div.classList.add("d-flex", "align-items-center", "gap-3", "mb-3");

      const btnSuppr = document.createElement("button");
      btnSuppr.type = "button";
      btnSuppr.classList.add("btn");
      btnSuppr.title = "supprimer une réponse";
      btnSuppr.dataset.action = "click->edition#supprReponse";

      // Création de l’icône
      const iconSuppr = document.createElement("i");
      iconSuppr.classList.add("bi", "bi-dash-circle");
      iconSuppr.style.color = "red";

      // Ajout de l’icône dans le bouton
      btnSuppr.append(iconSuppr);

      // Créer l'input pour l'utilisateur
      const inputUser = document.createElement("input");
      inputUser.type = "checkbox";
      inputUser.name = "userReponse";
      inputUser.classList.add("form-check-input");
      inputUser.id = `userRep${numR}`;
      inputUser.disabled = true;

      // Créer l'input pour insérer une réponse coté edition
      const inputTxt = document.createElement("input");
      inputTxt.type = "text";
      inputTxt.name = "reponseEdition";
      inputTxt.classList.add("form-control", "me-4");
      inputTxt.id = `rep${numR}`;
      inputTxt.dataset.editionTarget = "reponse";
      if (inputTxt.id == "rep1") {
        inputTxt.placeholder = "Ecrivez une réponse..."
      }

       // bouton qui a été cliqué
      const button = event.currentTarget

      const cardBody = button.closest(".card-body")
      const cardRep = cardBody.querySelectorAll('[data-edition-target="reponse"]')

      div.append(btnSuppr, inputUser, inputTxt);

      cardBody.insertBefore(div, button.parentElement);
  }

  supprReponse(event) {
    event.preventDefault();

    // bouton cliqué
    const button = event.currentTarget;

    // on remonte à la div parente
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