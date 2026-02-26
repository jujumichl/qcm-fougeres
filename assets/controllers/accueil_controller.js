import { Controller } from '@hotwired/stimulus';
import { confirmMess } from './helpers/confirmMess.js';
import { Modal } from 'bootstrap';


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
    'confirm',
    'titleDesc',
  ];

  static values = {
    mode: { type: String, default: 'normal' },
  };

  async connect() {
    this.selectedQcms = new Set();
    // File d'attente des <li> à retirer après un passage en corbeille
    this.liQueue = [];

    const offcanvasEl = document.getElementById('offcanvasMenu');
    if (offcanvasEl) {
      const offcanvas = bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl);
      offcanvas.show();
    }

    if (this.QCMTargets.length >= 3) {
      this.txtMidTarget.classList.add('is-hidden');
    }

    await fetch('qcm/corbeille')
      .then(response => response.json())
      .then(data => {
        for (const corb of data.corbeille) {
          const dateSuppr = this._addDays(corb.deletedAt, 7);
          this.addCorbeille(corb.id, corb.nom, corb.deletedAt, dateSuppr);
        }
      });
  }

  disconnect() {
    this.selectedQcms.clear();
    console.info('Accueil controller disconnected');
  }
  //#endregion

  //#region Helpers privés

  /**
   * Ajoute `days` jours à une date au format 'dd/mm/yyyy' et retourne la
   * nouvelle date dans le même format.
   * @param {string} dateStr - date au format 'dd/mm/yyyy'
   * @param {number} days
   * @returns {string}
   */
  _addDays(dateStr, days) {
    const [d, m, y] = dateStr.split('/').map(Number);
    // Les mois JS sont 0-indexés, on soustrait 1 à m
    const date = new Date(Date.UTC(y, m - 1, d));
    date.setUTCDate(date.getUTCDate() + days);
    return date.toLocaleDateString('fr-FR');
  }

  getQcmItem(element) {
    return element.closest('li');
  }

  createQcmButton(id, name) {
    const btn = document.createElement('button');
    btn.dataset.qcmId = id;
    btn.type = 'button';
    btn.classList.add('qcm-btn', 'flex-grow-1');
    btn.dataset.accueilTarget = 'QCM';
    btn.dataset.action = 'click->accueil#select';
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

  /**
   * Retourne le token CSRF stocké dans la meta tag.
   * Assurez-vous d'ajouter dans base.html.twig :
   *   <meta name="csrf-token" content="{{ csrf_token('qcm_action') }}">
   */
  _getCsrfToken() {
    return document.querySelector('meta[name="csrf-token"]')?.content ?? '';
  }
  //#endregion

  //#region Ajout QCM
  async addQcm(evt) {
    evt.preventDefault();

    let nb = this.QCMTargets.length;

    if (nb >= 3) {
      this.txtMidTarget.classList.add('is-hidden');
    }

    if (nb > 0) {
      const lastNum = Number(this.QCMTargets[nb - 1].textContent.split(' ')[1]);
      if (nb > lastNum) {
        nb = nb + 1;
      } else {
        nb = lastNum ? lastNum + 1 : nb + 1;
      }
    } else {
      nb = 1;
    }

    const isModif = this.modeValue === 'modif';

    try {
      let val = {};
      this.titleDescTarget.querySelectorAll('.form-control')
        .forEach(el => {
          if (el.name == "QCM-descr") {
            val["desc"] = el.value;
          } else if (el.name == "QCM-title") {
            val['title'] = el.value;
          } else {
            val['erreur'] = el.name;
            throw new Error(`Error during fetch of title and decription, name of element problem : ${val['erreur']}`)
          }
          el.value = "";
        })

      const template = document.getElementById('qcm-template');
      const li = template.content.firstElementChild.cloneNode(true);

      const repHttp = await this.createQcmEntity(`QCM ${nb}`, val);
      if (!repHttp.ok) {
        throw new Error(`Création non effectuée (code HTTP : ${repHttp.status})`);
      }
      const data = await repHttp.json();
      console.info(`id qcm : ${data.id} ------ Nom qcm : ${data.name}`);


      const btn = this.createQcmButton(data.id, data.name || `QCM ${nb}`);
      this.replaceQcmButton(li, btn);

      if (isModif) {
        li.querySelector('[data-accueil-target="case"]').classList.remove('is-hidden');
        li.querySelector('[data-accueil-target="renameValide"]').classList.remove('is-hidden');
      }

      this.listTarget.append(li);
    } catch (e) {
      console.error(e);
    }
  }

  retrieveQcm(id, name) {
    const isModif = this.modeValue === 'modif';

    try {
      if (!id || !name) {
        throw new Error('id ou nom du QCM manquant');
      }

      const template = document.getElementById('qcm-template');
      const li = template.content.firstElementChild.cloneNode(true);
      const btn = this.createQcmButton(id, name);
      this.replaceQcmButton(li, btn);

      if (isModif) {
        li.querySelector('[data-accueil-target="case"]').classList.remove('is-hidden');
        li.querySelector('[data-accueil-target="renameValide"]').classList.remove('is-hidden');
      }

      this.listTarget.append(li);
    } catch (e) {
      console.error(e);
    }
  }
  //#endregion

  //#region Suppression / Corbeille
  async delQcm() {
    try {
      if (await confirmMess(this.application, 'Voulez vous vraiment supprimer ces QCM ?')) {
        for (const box of this.caseTargets) {
          if (box.checked) {
            const repHttp = await this.trashQcm(box.nextElementSibling.dataset.qcmId);
            if (!repHttp.ok) {
              throw new Error(`Erreur lors de la tentative de suppression du QCM (code http: ${repHttp.status})`);
            }
            const data = await repHttp.json();
            console.info(`qcm id : ${data.id} --- Date de suppression : ${data.dateSuppr}`);
            // On mémorise le <li> pour le retirer après l'ajout en corbeille
            this.liQueue.push(box.closest('li'));
            this.addCorbeille(data.id, data.name, data.date, data.dateSuppr);
          }
        }

        this.caseAllSelectTarget.checked = false;

        if (this.QCMTargets.length < 5) {
          this.txtMidTarget.classList.remove('is-hidden');
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Ajoute une ligne dans le tableau de la corbeille et retire le <li>
   * correspondant de la liste principale.
   */
  addCorbeille(id, name, date, date7) {
    const template = document.getElementById('corbeille-template');
    const tr = template.content.firstElementChild.cloneNode(true);

    tr.children[0].textContent = name;
    tr.children[0].dataset.qcmId = id;
    tr.children[1].textContent = date;
    tr.children[2].textContent = date7;

    this.corbeilleTarget.append(tr);

    // Retire le premier <li> en attente
    if (this.liQueue.length > 0) {
      this.liQueue.shift().remove();
    }
  }

  async recupQcm(evt) {
    const id = evt.target.closest('tr').children[0].dataset.qcmId;

    const repHttp = await this.retrieve(id);

    // On vérifie le statut AVANT de parser le JSON
    if (!repHttp.ok) {
      console.error(`Erreur lors de la tentative de récupération du QCM (code http: ${repHttp.status})`);
      return;
    }

    const data = await repHttp.json();

    if (this.modeValue !== 'modif') this.modif();
    this.retrieveQcm(data.id, data.name);
    evt.target.closest('tr').remove();
    if (this.modeValue !== 'normal') this.modif();
  }
  //#endregion

  //#region Sélection QCM
  async select(event) {
    const btn = event.currentTarget;
    const id = btn.dataset.qcmId;

    if (this.modeValue === 'normal') {
      this.selectedQcms.clear();
      this.selectedQcms.add(id);

      const frame = document.querySelector('turbo-frame#main-content');
      frame.src = `edition/${id}`;
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
      btn.classList.toggle('is-selected', this.selectedQcms.has(id));

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
      this.QCMTargets.forEach(btn => this.selectedQcms.add(btn.dataset.qcmId));
    } else {
      this.selectedQcms.clear();
    }

    this.renderSelection();
  }
  //#endregion

  //#region Mode modification
  async modif() {
    const isModif = this.modeValue !== 'modif';
    this.modeValue = isModif ? 'modif' : 'normal';

    this.baseTarget.classList.toggle('is-hidden', isModif);
    this.modifierTarget.classList.toggle('is-hidden', !isModif);

    this.caseTargets.forEach(c => {
      c.classList.toggle('is-hidden', !isModif);
      c.checked = false;
    });

    this.caseAllSelectTarget.classList.toggle('is-hidden', !isModif);
    this.caseAllSelectTarget.checked = false;

    if (isModif) {
      this.QCMTargets.forEach(qcm => {
        if (this.selectedQcms.has(qcm.dataset.qcmId)) {
          qcm.previousElementSibling.checked = true;
        }
      });
      this.caseSelectedM();
    } else {
      this.selectedQcms.clear();
      this.renderSelection();
    }

    this.renameValideTargets.forEach(div => {
      div.classList.toggle('is-hidden', !isModif);
      if (!div.children[1].classList.contains('is-hidden')) {
        div.children[1].classList.add('is-hidden');
        div.children[0].classList.remove('is-hidden');
      }
    });

    if (this.hasNameTarget) {
      await this.handleExistingRename();
    }
  }
  //#endregion

  //#region Renommage
  async rename(event) {
    const ok = await this.handleExistingRename();
    if (!ok) return;

    const li = this.getQcmItem(event.currentTarget);

    li.querySelector('[data-accueil-target="rename"]').classList.add('is-hidden');
    li.querySelector('[data-accueil-target="valide"]').classList.remove('is-hidden');

    const qcmBtn = li.querySelector('[data-accueil-target="QCM"]');
    const id = qcmBtn.dataset.qcmId;
    this.nomQcm = qcmBtn.textContent;

    const input = document.createElement('input');
    input.classList.add('flex-grow-1');
    input.value = this.nomQcm;
    input.dataset.accueilTarget = 'name';

    const div = li.querySelector('[data-accueil-target="renameValide"]');
    li.insertBefore(input, div);
    input.focus();

    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.finalizeRename(li, input.value);
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        this.finalizeRename(li, this.nomQcm);
      }
    });

    qcmBtn.remove();
    li.dataset.qcmId = id;
  }

  async valide(event) {
    const li = this.getQcmItem(event.currentTarget);
    const id = li.dataset.qcmId;

    li.querySelector('[data-accueil-target="valide"]').classList.add('is-hidden');
    li.querySelector('[data-accueil-target="rename"]').classList.remove('is-hidden');

    const input = li.querySelector('[data-accueil-target="name"]');

    await this.renameQcm(id, input.value);

    const btn = this.createQcmButton(id, input.value);
    this.replaceQcmButton(li, btn);

    input.remove();
  }

  async finalizeRename(li, value) {
    const input = li.querySelector('[data-accueil-target="name"]');
    if (!input) return;

    const id = li.dataset.qcmId;

    await this.renameQcm(id, value);

    const btn = this.createQcmButton(id, value);
    this.replaceQcmButton(li, btn);

    input.remove();

    li.querySelector('[data-accueil-target="valide"]').classList.add('is-hidden');
    li.querySelector('[data-accueil-target="rename"]').classList.remove('is-hidden');
  }

  async handleExistingRename() {
    const input = this.element.querySelector('[data-accueil-target="name"]');
    if (!input) return true;

    const li = input.closest('li');

    const keep = await confirmMess(
      this.application,
      'Un renommage est déjà en cours.\nVoulez-vous conserver les modifications ?'
    );

    const value = keep ? input.value : this.nomQcm;
    this.finalizeRename(li, value);

    return true;
  }
  //#endregion

  //#region Appels API
  async createQcmEntity(nameQcm, val) {
    return fetch('qcm/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: nameQcm, title: val['title'], description: val['desc'], _token: this._getCsrfToken() }),
    });
  }

  async trashQcm(qcmId) {
    return fetch('qcm/delete', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: qcmId, _token: this._getCsrfToken() }),
    });
  }

  async retrieve(qcmId) {
    return fetch('qcm/retrieve', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: qcmId, _token: this._getCsrfToken() }),
    });
  }

  async renameQcm(qcmId, newName) {
    return fetch('qcm/rename', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: qcmId, name: newName, _token: this._getCsrfToken() }),
    });
  }

  async getQcm(id) {
    return fetch(`qcm/${id}`);
  }
  //#endregion
}
