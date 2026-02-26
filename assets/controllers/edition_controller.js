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
    type: { type: String, default: "unique" },
  };

  connect() {
    this.currentRenameValue = null;

    // ✅ Réinitialise Bootstrap après chaque rendu Turbo
    document.addEventListener('turbo:render', this._initBootstrap.bind(this));
  }

  disconnect() {
    document.removeEventListener('turbo:render', this._initBootstrap.bind(this));
  }

  _initBootstrap() {
    this.element.querySelectorAll('[data-bs-toggle="dropdown"]').forEach(el => {
      bootstrap.Dropdown.getOrCreateInstance(el);
    });
  }

  /* =====================================================
   * ACTIONS — CHANGEMENT DE TYPE
  ===================================================== */

  changerType() {
    for (const r of this.typeTargets) {
      if (r.checked) {
        this.typeValue = r.dataset.editionTypeValue;
        break;
      }
    }

    if (this.typeValue === "liste") {
      const template = document.getElementById("headerList");
      const clone = template.content.cloneNode(true);
      this.cardReponseTarget.append(clone);

      const dropdownEl = this.cardReponseTarget.querySelector('[data-bs-toggle="dropdown"]');
      if (dropdownEl) {
        const dd = new bootstrap.Dropdown(dropdownEl, { autoClose: 'outside' });

        dropdownEl.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          dd.toggle();
        });
      }
    }

    this.ajoutReponse();
  }

  /* =====================================================
   * ACTIONS — GESTION DES REPONSES
  ===================================================== */

  /** Retourne le contenu textuel de tous les boutons du dropdown. */
  syncSelectOpt() {
    return this.dropRepTargets.map(btn => btn.textContent.trim());
  }

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
      // type === "liste"
      const template = document.getElementById("bodyList");
      const clone = template.content.cloneNode(true);
      this.cardReponseTarget.append(clone);

      // Synchronisation des options existantes sur le nouveau <select>
      if (this.hasDropdownRepTarget && this.dropdownRepTarget.childElementCount > 0) {
        const contentDPD = this.syncSelectOpt();
        const lastSelect = this.selectTargets[this.selectTargets.length - 1];
        contentDPD.forEach((content, i) => {
          lastSelect.add(new Option(content, i + 1));
        });
      }
    }
  }

  resetReponse() {
    // Nettoyage du dropdown Bootstrap si présent
    const dropdownEl = this.cardReponseTarget.querySelector('[data-bs-toggle="dropdown"]');
    if (dropdownEl) {
      bootstrap.Dropdown.getInstance(dropdownEl)?.dispose();
    }

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

    if (!elem) return;

    if (elem.localName === "li") {
      const btn = elem.querySelector('[data-edition-target="dropRep"]');
      if (btn) {
        this.delOpt(Number(btn.value));
      }
      elem.remove();
    } else if (this.typeValue === "liste") {
      elem.parentElement.remove();
    } else {
      elem.remove();
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
    for (const select of this.selectTargets) {
      const opt = new Option(text, select.options.length);
      select.add(opt);
    }
  }

  delOpt(index) {
    for (const select of this.selectTargets) {
      const optToRemove = Array.from(select.options).find(opt => Number(opt.value) === index);

      if (optToRemove) {
        select.remove(optToRemove.index);
      } else {
        // Fallback : supprime toutes les options dynamiques si désynchronisé
        Array.from(select.options)
          .filter(opt => opt.value !== "" && !opt.hidden)
          .forEach(opt => select.remove(opt.index));
      }
    }

    this.reindexAllOptions();
  }

  reindexAllOptions() {
    for (const select of this.selectTargets) {
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
