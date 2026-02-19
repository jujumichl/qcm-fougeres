import { Controller } from '@hotwired/stimulus';
import { confirmMess } from './helpers/confirmMess.js';

export default class extends Controller {
  //#region init Controller
  static targets = [
    'QCM',
    'case',
    'caseAllSelect',
    'list',
    'content',
    'modifier',
    'base',
    'rename',
    'valide',
    'renameValide',
    'name',
    'corbeille',
    'QCMSuppr',
    'txtMid',
  ];

  static values = {
    mode: { type: String, default: "normal" },
  }

  connect() {
    this.selectedQcms = new Set();

    const offcanvasEl = document.getElementById('offcanvasMenu');
    if (offcanvasEl) {
      const offcanvas = bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl);
      offcanvas.show();
    }
    if (this.QCMTargets.length >= 3) {
      this.txtMidTarget.classList.add('is-hidden');
    }
  }

  disconnect() {
    // Nettoyage lors de la déconnexion du contrôleur
    this.selectedQcms.clear();
    console.log("Accueil controller disconnected");
  }
  //#endregion

  //#region get
  getQcmItem(element) {
    return element.closest("li");
  }
  //#endregion

  //#region add QCM
  async addQcm(evt, nameQCM = "") {

    // nb de QCM
    let nb = this.QCMTargets.length;
    // si plus de 3 alors on cache le text de tuto
    if (nb >= 3) {
      this.txtMidTarget.classList.add('is-hidden');
    }

    ///
    /// déternmination de ce qu'on vas mettre pour le nom générique : "QCM numéros..."
    if (nb > 0) {
      if (Number(this.QCMTargets[nb - 1].textContent.split(" ")[1])) {
        const lastQcm = this.QCMTargets[nb - 1];
        nb = Number(lastQcm.textContent.split(" ")[1]) + 1;
      }
    }
    else {
      nb = nb + 1
    }
    ///

    // mode dans lequel on se trouve
    const isModif = this.modeValue === "modif";
    try {
      /// Création d'un nouveau QCM 
      const template = document.getElementById("qcm-template");
      const li = template.content.firstElementChild.cloneNode(true);
      // création en bdd du QCM + récup du nom + id du QCM
      const repHttp = await this.createQcmEntity(nameQCM || `QCM ${nb}`);
      const statusHttp = repHttp.ok;
      console.log(repHttp);
      if (!statusHttp) {
        throw new Error(`Code HTTP différent de 200, création non effectuée (code HTTP : ${repHttp.status})`)
      }
      const data = await repHttp.json();
      console.log(data.id + " ------ " + data.name);
      const btn = this.createQcmButton(data.id, data.name || `QCM ${nb}`);
      this.replaceQcmButton(li, btn);
      ///

      // afficher ou non les cases de modification en fonction du mode
      if (isModif) {
        li.querySelector('[data-accueil-target="case"]').classList.remove("is-hidden");
        li.querySelector('[data-accueil-target="renameValide"]').classList.remove("is-hidden");
      }


      // ajout du QCM dans le DOM
      this.listTarget.append(li);
    }
    catch (e) {
      console.error(e);
    }

  }
  //#endregion

  //#region delete QCM

  /**
   * main function for make QCM in trash
   */
  async delQcm() {
    try {
      if (await confirmMess(this.application, "Voulez vous vraiment supprimer ces QCM ?")) {
        for (let box of this.caseTargets) {
          if (box.checked) {
            console.info(box.nextElementSibling.dataset.qcmId);
            const repHttp = await this.trashQcm(box.nextElementSibling.dataset.qcmId);
            if (!repHttp.ok) {
              throw new Error(`Erreur lors de la tentative de supprission du QCM (code http: ${repHttp.status})`)
            }
            const data = await repHttp.json()
            console.log(data.id + " ---------  " + data.date)
            this.addCorbeille(box.closest("li"), data.date);
          }
        };
        this.caseAllSelectTarget.checked = false;
        let nb = this.QCMTargets.length;

        if (nb < 5) {
          this.txtMidTarget.classList.remove('is-hidden');
        }
      }
    }
    catch (e) {
      console.error(e);
    }
  }

  /**
   * Add HMTL <li> in trash
   * @param {HTMLElement} liElement <li> element
   * @param {Date} date current date
   */
  addCorbeille(liElement, date) {

    const template = document.getElementById("corbeille-template");
    const tr = template.content.firstElementChild.cloneNode(true);

    tr.children[0].textContent = liElement.children[1].textContent;
    tr.children[0].dataset.qcmId = liElement.children[1].dataset.qcmId;
    tr.children[1].textContent = date;
    tr.children[2].textContent = date;

    this.corbeilleTarget.append(tr);
    liElement.remove();
  }

  /**
   * retrieval QCM function
   * @param {Event} evt 
   */
  recupQcm(evt) {
    let nameQCM = evt.currentTarget.closest('tr').children[0].textContent;
    let id = evt.currentTarget.closest('tr').children[0].dataset.qcmId;
    if (this.modeValue !== 'modif') this.modif();
    this.addQcm("", id, nameQCM);
    evt.currentTarget.closest('tr').remove();
    if (this.modeValue !== 'normal') this.modif();
  }

  //#endregion

  //#region select QCM
  select(event) {
    const btn = event.currentTarget;
    const id = btn.dataset.qcmId;

    if (this.modeValue === "normal") {
      this.selectedQcms.clear();
      this.selectedQcms.add(id);
    } else {
      this.selectedQcms.has(id)
        ? this.selectedQcms.delete(id)
        : this.selectedQcms.add(id);
    }

    this.renderSelection();
  }

  renderSelection() {
    this.QCMTargets.forEach(btn => {
      const id = btn.dataset.qcmId;

      btn.classList.toggle(
        'is-selected',
        this.selectedQcms.has(id)
      );

      const checkbox = btn.previousElementSibling;
      if (checkbox) {
        checkbox.checked = this.selectedQcms.has(id);
      }
    });

    this.caseAllSelectTarget.checked =
      this.selectedQcms.size === this.QCMTargets.length &&
      this.selectedQcms.size > 0;
  }

  caseSelectedM() {
    this.selectedQcms.clear();

    this.caseTargets.forEach(box => {
      if (box.checked) {
        const btn = box.nextElementSibling;
        this.selectedQcms.add(btn.dataset.qcmId);
      }
    });

    this.renderSelection();
  }

  allSelect() {
    if (this.caseAllSelectTarget.checked) {
      this.QCMTargets.forEach(btn =>
        this.selectedQcms.add(btn.dataset.qcmId)
      );
    } else {
      this.selectedQcms.clear();
    }

    this.renderSelection();
  }
  //#endregion

  //#region edit menu
  async modif() {
    const isModif = this.modeValue !== "modif";
    this.modeValue = isModif ? "modif" : "normal";

    this.baseTarget.classList.toggle("is-hidden", isModif);
    this.modifierTarget.classList.toggle("is-hidden", !isModif);

    this.caseTargets.forEach(c => {
      c.classList.toggle("is-hidden", !isModif);
      c.checked = false;
    });

    this.caseAllSelectTarget.classList.toggle("is-hidden", !isModif);
    this.caseAllSelectTarget.checked = false;

    if (isModif) {
      this.QCMTargets.forEach(qcm => {
        if (this.selectedQcms.has(qcm.dataset.qcmId)) {
          qcm.previousElementSibling.checked = true;
        }
      });
      this.caseSelectedM();
    }

    if (!isModif) {
      this.selectedQcms.clear();
      this.renderSelection();
    }

    this.renameValideTargets.forEach(div => {
      div.classList.toggle("is-hidden", !isModif);
      if (!div.children[1].classList.contains('is-hidden')) {
        div.children[1].classList.add('is-hidden');
        div.children[0].classList.remove('is-hidden');
      }
    });

    // attente de la réponse de utilisateur
    if (this.hasNameTarget) {
      await this.handleExistingRename();
    }
  }
  //#region renaming logic
  async rename(event) {
    const ok = await this.handleExistingRename();
    if (!ok) return;

    const li = this.getQcmItem(event.currentTarget);

    li.querySelector('[data-accueil-target="rename"]').classList.add("is-hidden");
    li.querySelector('[data-accueil-target="valide"]').classList.remove("is-hidden");

    const qcmBtn = li.querySelector('[data-accueil-target="QCM"]');
    const id = qcmBtn.dataset.qcmId;
    this.nomQcm = qcmBtn.textContent;

    const input = document.createElement("input");
    input.classList.add("flex-grow-1");
    input.value = this.nomQcm;
    input.dataset.accueilTarget = "name";

    const div = li.querySelector('[data-accueil-target="renameValide"]');
    li.insertBefore(input, div);
    input.focus();

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.finalizeRename(li, input.value);
      }
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        this.finalizeRename(li, this.nomQcm);
      }
    });

    qcmBtn.remove();
    li.dataset.qcmId = id;
  }

  valide(event) {
    const li = this.getQcmItem(event.currentTarget);
    const id = li.dataset.qcmId;

    li.querySelector('[data-accueil-target="valide"]').classList.add("is-hidden");
    li.querySelector('[data-accueil-target="rename"]').classList.remove("is-hidden");

    const input = li.querySelector('[data-accueil-target="name"]');

    const btn = this.createQcmButton(id, input.value);
    this.replaceQcmButton(li, btn);

    input.remove();
  }

  finalizeRename(li, value) {
    const input = li.querySelector('[data-accueil-target="name"]');
    if (!input) return;

    const id = li.dataset.qcmId;

    const btn = this.createQcmButton(id, value);
    this.replaceQcmButton(li, btn);

    input.remove();

    li.querySelector('[data-accueil-target="valide"]').classList.add("is-hidden");
    li.querySelector('[data-accueil-target="rename"]').classList.remove("is-hidden");
  }

  async handleExistingRename() {
    const input = this.element.querySelector('[data-accueil-target="name"]');
    if (!input) return true;

    const li = input.closest("li");

    const keep = await confirmMess(
      this.application,
      "Un renommage est déjà en cours.\nVoulez-vous conserver les modifications ?"
    );

    // si annulation → on remet le nom initial sinon non
    const value = keep ? input.value : this.nomQcm;
    this.finalizeRename(li, value);
  }
  //#endregion

  //#endregion

  //#region Helpers
  createQcmButton(id, name) {
    const btn = document.createElement("button");
    btn.dataset.qcmId = id;
    btn.type = "button";
    btn.classList.add("qcm-btn", "flex-grow-1");
    btn.dataset.accueilTarget = "QCM";
    btn.dataset.action = "click->accueil#select";
    btn.textContent = name;
    return btn;
  }

  replaceQcmButton(li, btn) {
    const old = li.querySelector('[data-accueil-target="QCM"]');
    const div = li.querySelector('[data-accueil-target="renameValide"]');

    if (old) {
      old.replaceWith(btn);
    } else {
      li.insertBefore(btn, div);
    }
  }
  //#endregion


  //#region Entity

  async createQcmEntity(nameQcm) {
    const response = await fetch('qcm/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: nameQcm
      })
    })
    return response;

  }

  async trashQcm(QCMId) {
    const response = await fetch('qcm/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: QCMId
      })
    })
    return response;
  }

  //#endregion

}