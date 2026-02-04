// assets/controllers/login_controller.js
import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="login"
export default class extends Controller {
  static targets = ["reponse", "cardReponse", "divReponse","type", "modalBody"]
  static values = {
    type: { Type: String, default: "unique" }
  }

  ajoutReponse() {
    // On compte combien de réponses déjà existante
    // let num = this.reponseTargets.length + 1

    /**  Permet de générer et d’insérer un chiffre unique dans l’ID des réponses
    if (num - 1 > 0) {
      
        Récupère l'id de l'avant avant dernière réponse
        exemple d'id pour la 1ère réponse : rep1 
       
      let targetNum = this.reponseTargets[num - 2].id;

      //On fais un split pour récupérer que le chiffre
      targetNum = targetNum.split("p");

      // On ajoute 1 à chaque boucle
      num = Number(targetNum[1]) + 1;
    }*/

      // Boucle pour déterminer le type d'input générer
      if (this.typeValue === "unique") {
        const templateUnique = document.getElementById("reponseUnique");

        const cloneRepUnique = templateUnique.content.firstElementChild.cloneNode(true);

        this.cardReponseTarget.append(cloneRepUnique);
      }

      else if (this.typeValue === "multiple") {
        const templateMultiple = document.getElementById("reponseMultiple");

        const cloneRepMultiple = templateMultiple.content.firstElementChild.cloneNode(true);

        this.cardReponseTarget.append(cloneRepMultiple);
      }

      else {
        const templateListe = document.getElementById("reponseListe");

        const cloneRepListe = templateListe.content.firstElementChild.cloneNode(true);

        this.cardReponseTarget.append(cloneRepListe);
      }
  }

  resetReponse(){
    const modalBody = this.modalBodyTarget;
    const choixUser = modalBody.querySelector('input[name="radio"]:checked');

    if(this.typeValue !== choixUser.value ){
      this.divReponseTargets.forEach(target => target.replaceChildren());
    }
  }

  supprReponse(event) {
    event.preventDefault();
    // bouton cliqué
    const button = event.currentTarget;

    // on remonte à la div parente qui contient les inputs et le bouton supprimer
    const reponseDiv = button.parentElement;

    reponseDiv.remove();
  }

  changerType() {
    const selectedType = this.typeTargets.find(r => r.checked).value;
    this.typeValue = selectedType;
     console.log (this.typeValue);
  }

  /**
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
  }*/

}