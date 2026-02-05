import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
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
  ];

  static values = {
    mode: { type: String, default: "normal" }
  }

  connect() {
    this.selectedQcms = new Set();

    const offcanvasEl = document.getElementById('offcanvasMenu');

    if (offcanvasEl) {
      const offcanvas = bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl);
      offcanvas.show();
    }
  }



  getQcmItem(element) {
    return element.closest("li");
  }

  addQcm(evt, id = Date.now().toString(), nameQCM = "") {
    let nb = this.QCMTargets.length + 1;

    if (nb > 1) {
      if (Number(this.QCMTargets[nb - 2].textContent.split(" ")[1])) {
        const lastQcm = this.QCMTargets[nb - 2];
        nb = Number(lastQcm.textContent.split(" ")[1]) + 1;
      }
    }

    const isModif = this.modeValue === "modif";

    // Récupération de la template qui nous intéresse
    const template = document.getElementById("qcm-template");
    // Puis clone template
    const li = template.content.firstElementChild.cloneNode(true);

    const btn = this.createQcmButton(id, nameQCM || `QCM ${nb}`);
    this.replaceQcmButton(li, btn);

    if (isModif) {
      li.querySelector('[data-accueil-target="case"]').classList.remove("is-hidden");
      li.querySelector('[data-accueil-target="renameValide"]').classList.remove("is-hidden");
    }

    this.listTarget.append(li);
  }

  delQcm() {
    if (confirm("Voulez vous vraiment supprimer ces QCM ?")) {
      this.caseTargets.forEach(box => {
        if (box.checked) {
          this.addCorbeille(box.closest("li"));
        }
      });
      this.caseAllSelectTarget.checked = false;
    }
  }

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

  modif() {
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

    if (this.hasNameTarget) {
      this.handleExistingRename();
    }
  }

  rename(event) {
    this.handleExistingRename();

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

  handleExistingRename() {
    const input = this.element.querySelector('[data-accueil-target="name"]');
    if (!input) return true;

    const li = input.closest("li");
    const keep = confirm(
      "Un renommage est déjà en cours.\nVoulez-vous conserver les modifications ?"
    );

    const value = keep ? input.value : this.nomQcm;
    this.finalizeRename(li, value);

    return true;
  }

  addCorbeille(liElement) {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();
    let dd7 = dd + 7;

    if (dd < 10) dd = '0' + dd;
    if (dd7 < 10) dd7 = '0' + dd7;
    if (mm < 10) mm = '0' + mm;

    const template = document.getElementById("corbeille-template");
    const tr = template.content.firstElementChild.cloneNode(true);

    tr.children[0].textContent = liElement.children[1].textContent;
    tr.children[0].dataset.qcmId = liElement.children[1].dataset.qcmId;
    tr.children[1].textContent = `${dd}/${mm}/${yyyy}`;
    tr.children[2].textContent = `${dd7}/${mm}/${yyyy}`;

    this.corbeilleTarget.append(tr);
    liElement.remove();
  }

  recupQcm(evt) {
    let nameQCM = evt.currentTarget.closest('tr').children[0].textContent;
    let id = evt.currentTarget.closest('tr').children[0].dataset.qcmId;
    if (this.modeValue !== 'modif') this.modif();
    this.addQcm("", id, nameQCM);
    evt.currentTarget.closest('tr').remove();
    if (this.modeValue !== 'normal') this.modif();
  }

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
}
