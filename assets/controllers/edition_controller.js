import { Controller } from "@hotwired/stimulus";
import { confirmMess } from "./helpers/confirmMess.js";

/**
 * Controller Edition
 * Gestion complète :
 * - Type de question
 * - Réponses dynamiques
 * - Dropdown éditable
 * - Synchronisation des <select>
 */
export default class extends Controller {

  /* =====================================================
   * CONFIGURATION STIMULUS
  ===================================================== */

  static targets = [
    "reponse",
    "cardReponse",
    "divReponse",
    "type",
    "modalBody",
    "dropdownRep",
    "select",
    "dropRep",
    "Questions",
  ];

  static values = {
    type: { type: String, default: "unique" }
  };

  connect() {
    this.currentRenameValue = null;
  }

  /* =====================================================
   * ACTIONS — CHANGEMENT DE TYPE
  ===================================================== */

  changerType() {
    this.typeTargets.forEach((r) => {
      if (r.checked) {
        this.typeValue = r.dataset.editionTypeValue;
      }
    });

    this.resetReponse();

    if (this.typeValue === "liste") {
      const template = document.getElementById("headerList");
      const clone = template.content.cloneNode(true);
      this.cardReponseTarget.append(clone);
    }

    this.ajoutReponse();
  }

  /* =====================================================
   * ACTIONS — GESTION DES REPONSES
  ===================================================== */
  syncSelectOpt() {
    // Synchronisation options si plusieurs select
    let btnListe = this.dropRepTarget.querySelectorAll('[data-edition-target="dropRep"]');
    let btnContent;
    btnListe.forEach(btn => btnContent = [btn.textContent]);
    return btnContent;
  }

  ajoutReponse() {

    if (this.typeValue === "unique") {
      const template = document.getElementById("reponseUnique");
      const clone = template.content.firstElementChild.cloneNode(true);
      this.cardReponseTarget.append(clone);
    }

    else if (this.typeValue === "multiple") {
      const template = document.getElementById("reponseMultiple");
      const clone = template.content.firstElementChild.cloneNode(true);
      this.cardReponseTarget.append(clone);
    }

    else {
      const template = document.getElementById("bodyList");
      let clone = template.content.cloneNode(true);
      this.cardReponseTarget.append(clone);

      // Focus automatique sur input dropdown
      document.getElementById('dropdownMenu')
        .addEventListener('shown.bs.dropdown', () => {
          document.getElementById('DropdownInput').focus();
        });
      if (this.dropdownRepTarget.childElementCount > 0) {
        let contentDPD = this.syncSelectOpt();
        let compt = 0;
        contentDPD.forEach(content => clone.append(new Option(content, select.options.length)))
      }
    }
  }

  resetReponse() {
    this.cardReponseTarget.remove();

    const cardRep = document.createElement('div');
    cardRep.classList.add('card-body', 'position-relative');
    cardRep.dataset.editionTarget = "cardReponse";

    this.QuestionsTarget.insertAdjacentElement("afterend", cardRep);
  }

  supprReponse(event) {
    event.preventDefault();

    let elem = event.currentTarget.closest("[data-edition-target='divReponse']");
    if (!elem) elem = event.currentTarget.closest("li");

    if (elem) {
      elem.remove();

      if (elem.localName === "li") {
        let btnValue = elem.children[0].children[1].value;
        this.delOpt(Number(btnValue));
      }
    }
  }

  /* =====================================================
   * ACTIONS — DROPDOWN
  ===================================================== */

  addRepDrop(event) {
    event.preventDefault();

    const input = event.currentTarget.previousElementSibling;
    const value = input.value.trim();

    if (!value) {
      confirmMess(
        this.application,
        'Veuillez écrire votre réponse dans le champs text',
        "ok"
      );
      return;
    }

    const template = document.getElementById("dropdwonRep");
    const clone = template.content.firstElementChild.cloneNode(true);

    const Btn = clone.querySelector('[data-edition-target="dropRep"]');
    Btn.textContent = value;

    // Value = position (1-based)
    Btn.value = document
      .querySelector('[data-edition-target="dropdownRep"]')
      .childElementCount + 1;

    this.dropdownRepTarget.append(clone);
    sessionStorage
    this.addOptAllSelect(value);

    input.value = "";
  }

  /* =====================================================
   * ACTIONS — OPTIONS / SELECT
  ===================================================== */

  addOpt(text) {
    let lastSelect = this.selectTargets[this.selectTargets.length - 1];
    let opt = new Option (text, lastSelect.options.length);
    lastSelect.append(opt);
  }

  addOptAllSelect(text) {
    for (let select of this.selectTargets) {
      const opt = new Option(text, select.options.length);
      select.add(opt);
    }
  }

  delOpt(index) {
    for (let select of this.selectTargets) {
      if (select.options[index]) {
        select.remove(index);
      }
    }
    this.reindexAllOptions();
  }

  reindexAllOptions() {
    for (let select of this.selectTargets) {
      Array.from(select.options).forEach((opt, i) => {
        opt.value = i + 1;
      });
    }

    this.dropRepTargets.forEach((btn, i) => {
      btn.value = i + 1;
    });
  }


}
