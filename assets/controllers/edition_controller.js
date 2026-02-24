import { Controller } from "@hotwired/stimulus";
import { confirmMess } from "./helpers/confirmMess.js";

export default class extends Controller {

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

    if (this.typeValue === "liste") {
      const template = document.getElementById("headerList");
      const clone = template.content.cloneNode(true);
      this.cardReponseTarget.append(clone);

      // Utilisation de la cible Stimulus plutôt que getElementById
      this.cardReponseTarget
        .querySelector('[data-bs-toggle="dropdown"]')
        ?.closest('.nav-item')
        ?.addEventListener('shown.bs.dropdown', () => {
          this.cardReponseTarget.querySelector('#DropdownInput')?.focus();
        });
    }

    this.ajoutReponse();
  }

  /* =====================================================
   * ACTIONS — GESTION DES REPONSES
  ===================================================== */

  // accumulation dans un tableau
  syncSelectOpt() {
    let btnContent = [];
    this.dropRepTargets.forEach(btn => btnContent.push(btn.textContent.trim()));
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
      const clone = template.content.cloneNode(true);
      this.cardReponseTarget.append(clone);

      // Synchronisation des options existantes sur le nouveau <select>
      if (this.dropdownRepTarget.childElementCount > 0) {
        const contentDPD = this.syncSelectOpt();
        // On cible le dernier select ajouté
        const lastSelect = this.selectTargets[this.selectTargets.length - 1];
        contentDPD.forEach((content, i) => {
          lastSelect.add(new Option(content, i + 1));
        });
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
      if (elem.localName === "li") {
        const btn = elem.querySelector('[data-edition-target="dropRep"]');
        if (btn) {
          const btnValue = Number(btn.value);
          this.delOpt(btnValue);
        }
        elem.remove();
      }
      else if (this.typeValue === "liste") {
        elem.parentElement.remove();
      }
      else {
        elem.remove();
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

    const btn = clone.querySelector('[data-edition-target="dropRep"]');
    btn.textContent = value;

    btn.value = this.dropdownRepTarget.childElementCount + 1;

    this.dropdownRepTarget.append(clone);

    this.addOptAllSelect(value);

    input.value = "";
  }

  /* =====================================================
   * ACTIONS — OPTIONS / SELECT
  ===================================================== */


  addOptAllSelect(text) {
    for (let select of this.selectTargets) {
      const opt = new Option(text, select.options.length);
      select.add(opt);
    }
  }

 delOpt(index) {
  for (let select of this.selectTargets) {
    let optToRemove = Array.from(select.options).find(opt => Number(opt.value) === index);

    if (optToRemove) {
      select.remove(optToRemove.index);
    } else {
      // Supprime toutes les options dynamiques si désynchronisé
      Array.from(select.options)
        .filter(opt => opt.value !== "" && !opt.hidden)
        .forEach(opt => select.remove(opt.index));
    }
  }
  // Toujours réindexer, même après un fallback
  this.reindexAllOptions();
}

  reindexAllOptions() {
    for (let select of this.selectTargets) {
      // On saute l'option placeholder (index 0)
      Array.from(select.options).slice(1).forEach((opt, i) => {
        opt.value = i + 1;
      });
    }

    this.dropRepTargets.forEach((btn, i) => {
      btn.value = i + 1;
    });
  }
}