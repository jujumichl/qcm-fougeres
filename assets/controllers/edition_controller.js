import { Controller } from "@hotwired/stimulus";
import { confirmMess } from "./helpers/confirmMess.js";

// Connects to data-controller="edition"
export default class extends Controller {
  static targets = [
    "reponse",
    "cardReponse",
    "divReponse",
    "type",
    "modalBody",
    "dropdownRep",
    "select",
  ];

  static values = {
    type: { type: String, default: "unique" }
  };

  connect() {
    this.currentRenameValue = null;
  }

  /* =========================
     GESTION DES REPONSES
  ==========================*/

  ajoutReponse() {
    if (this.typeValue === "unique") {
      const template = document.getElementById("reponseUnique");
      const clone = template.content.firstElementChild.cloneNode(true);
      this.cardReponseTarget.append(clone);
    } else if (this.typeValue === "multiple") {
      const template = document.getElementById("reponseMultiple");
      const clone = template.content.firstElementChild.cloneNode(true);
      this.cardReponseTarget.append(clone);
    } else {
      const template = document.getElementById("bodyList");
      let clone = template.content.cloneNode(true);
      this.cardReponseTarget.append(clone);
      // quand dropdown fermer complet (ui compris) = hidden.bs.dropdown
      // quand dropdown ouvert complet (ui compris) = shown.bs.dropdown
      document.getElementById('dropdownMenu').addEventListener('shown.bs.dropdown', evt => {
        document.getElementById('DropdownInput').focus();
      });
      if (this.selectTargets.length > 1) {
        let opt = this.selectTargets[0].options
        for (let o of opt)
          this.addOpt(o)
      }
    }

  }




  changerType() {
    this.typeTargets.forEach((r) => {
      if (r.checked) {
        this.typeValue = r.dataset.editionTypeValue;
      }
    });

    if (this.typeValue === "liste") {
      const template = document.getElementById("headerList");
      const clone = template.content.cloneNode(true);
      this.cardReponseTarget.append(clone);
    }
    this.resetReponse();
    this.ajoutReponse();
  }

  resetReponse() {
    const modalBody = this.modalBodyTarget;
    const choixUser = modalBody.querySelector(
      'input[name="radio"]:checked'
    );

    if (!choixUser) return;

    if (this.typeValue !== choixUser.value) {
      this.divReponseTargets.forEach((target) => target.remove());
    }
  }

  supprReponse(event) {
    event.preventDefault();
    let reponseDiv = event.currentTarget.closest("[data-edition-target='divReponse']");


    if (!reponseDiv) {
      reponseDiv = event.currentTarget.closest("li");
    }

    if (reponseDiv) reponseDiv.remove();
  }

  /* =========================
     DROPDOWN REPONSES
  ==========================*/

  addRepDrop(event) {
    event.preventDefault();

    const input = event.currentTarget.previousElementSibling;
    const value = input.value.trim();
    if (!value) {
      confirmMess(this.application, 'Veuillez écrire votre réponse dans le champs text', "ok")
      return
    };

    const template = document.getElementById("dropdwonRep");
    const clone = template.content.firstElementChild.cloneNode(true);

    const labelBtn = clone.querySelector('[data-edition-target="dropRep"]');
    labelBtn.textContent = value;

    this.dropdownRepTarget.append(clone);
    this.addOptAllSelect(value);

    input.value = "";
  }

  /* =========================
     RENAME DROPDOWN
  ==========================*/

  async renameRepDrop(event) {
    event.preventDefault();
    const li = event.currentTarget.closest("li");

    await this.handleExistingRename();

    const renameBtn = li.querySelector('[data-rename="rename"]');
    const valideBtn = li.querySelector('[data-rename="valide"]');
    const labelBtn = li.querySelector('[data-edition-target="dropRep"]');

    renameBtn.hidden = true;
    valideBtn.hidden = false;

    const originalValue = labelBtn.textContent.trim();
    this.currentRenameValue = originalValue;

    const input = document.createElement("textarea");
    input.className = "form-control flex-grow-1";
    input.value = originalValue;
    input.dataset.renameInput = "true";

    labelBtn.replaceWith(input);
    input.focus();

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.finalizeRename(li, input.value);
      }


    });
  }

  valide(event) {
    event.preventDefault();

    const li = event.currentTarget.closest("li");
    const input = li.querySelector('textarea[data-rename-input="true"]');
    if (!input) return;

    this.finalizeRename(li, input.value);
  }

  finalizeRename(li, value) {
    const input = li.querySelector('textarea[data-rename-input="true"]');
    if (!input) return;

    const renameBtn = li.querySelector('[data-rename="rename"]');
    const valideBtn = li.querySelector('[data-rename="valide"]');

    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-light flex-grow-1 text-start";
    button.dataset.editionTarget = "dropRep";
    button.textContent = value;

    input.replaceWith(button);

    renameBtn.hidden = false;
    valideBtn.hidden = true;
  }

  async handleExistingRename() {
    const input = this.element.querySelector(
      'textarea[data-rename-input="true"]'
    );

    if (!input) return true;

    const li = input.closest("li");

    const keep = await confirmMess(
      this.application,
      "Un renommage est déjà en cours.\nVoulez-vous conserver les modifications ?"
    );

    const value = keep ? input.value : this.currentRenameValue;
    this.finalizeRename(li, value);

    return true;
  }

  /* =========================
     ADD OPTION
  ==========================*/
  /**
   * Add one option to select element
   * @param {Option} option 
   */
  addOpt(option) {
    if (!option.hidden) {
      let last = this.selectTargets.length - 1;
      this.selectTargets[last].append(option.cloneNode(true));
    }
  }

  /**
   * Add one option with text to all select elements
   * @param {String} text 
   */
  addOptAllSelect(text) {
    let opt = document.createElement('option');
    opt.textContent = text;
    for (let select of this.selectTargets) {
      select.append(opt.cloneNode(true));
    }
  }
}


