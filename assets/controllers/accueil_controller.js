import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  // Définition des targets
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
  /**
   * Définition des écouteur d'évènement
   */
  connect() {
    this.nomQcm = null;
    this.onShown = () => {
      this.contentTarget.classList.add("menu-open");
    };

    this.onHidden = () => {
      this.contentTarget.classList.remove("menu-open");
    };

    this.element.addEventListener("shown.bs.offcanvas", this.onShown);
    this.element.addEventListener("hidden.bs.offcanvas", this.onHidden);
  }

  /**
   * Executer lors de la deconnexion de la page, pour supprimer les écouteurs d'évenment 
   */
  disconnect() {
    this.element.removeEventListener("shown.bs.offcanvas", this.onShown);
    this.element.removeEventListener("hidden.bs.offcanvas", this.onHidden);
  }

  getQcmItem(element) {
    return element.closest("li");
  }


  /**
   * //////////////////////////////////////////////////////////////////////////////////
   * A voir avec la BDD
   * Ajout un QCM
   */
  addQcm(evt, nameQCM = "") {
    let nb = this.QCMTargets.length + 1;

    if (nb > 1) {
      if (Number(this.QCMTargets[nb - 2].textContent.split(" ")[1])) {
        const lastQcm = this.QCMTargets[nb - 2];
        nb = Number(lastQcm.textContent.split(" ")[1]) + 1;
      }
    }

    const isModif = this.modeValue === "modif";

    const li = document.createElement("li");
    li.classList.add("list-group-item", "p-0", "d-flex", "align-items-center", "gap-2");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("p-4", "m-2");
    checkbox.dataset.accueilTarget = "case";
    checkbox.dataset.action = "click->accueil#caseSelectedM"
    checkbox.classList.toggle("is-hidden", !isModif);

    const btn = document.createElement("button");
    btn.type = "button";
    btn.classList.add("qcm-btn", "flex-grow-1");
    btn.dataset.accueilTarget = "QCM";
    btn.dataset.action = "click->accueil#select";
    btn.textContent = nameQCM !== "" ? nameQCM : `QCM ${nb}`;

    const div = document.createElement("div");
    div.dataset.accueilTarget = "renameValide";
    div.classList.add("d-flex", "gap-1");
    div.classList.toggle("is-hidden", !isModif);

    const btnRename = document.createElement("button");
    btnRename.type = "button";
    btnRename.classList.add("btn", "btn-outline-warning", "no-border");
    btnRename.dataset.accueilTarget = "rename";
    btnRename.dataset.action = "click->accueil#rename";
    btnRename.classList.toggle("is-hidden", !isModif);

    const pencil = document.createElement("i");
    pencil.classList.add("bi", "bi-pencil");
    btnRename.append(pencil);

    const btnValide = document.createElement("button");
    btnValide.type = "button";
    btnValide.classList.add("btn", "btn-outline-success", "no-border", "is-hidden");
    btnValide.dataset.accueilTarget = "valide";
    btnValide.dataset.action = "click->accueil#valide";

    const check = document.createElement("i");
    check.classList.add("bi", "bi-check");
    btnValide.append(check);

    div.append(btnRename, btnValide);
    li.append(checkbox, btn, div);
    this.listTarget.append(li);
  }


  /**
   * //////////////////////////////////////////////////////////////////////////////////
   * A voir avec la BDD
   * supprime un QCM
   */
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

  /**
   * Met en valeur l'élément sélectionner
   */
  select(event) {
    const btn = event.currentTarget;

    if (this.modeValue === "normal") {
      this.QCMTargets.forEach(b => b.classList.remove("is-selected"));
      btn.classList.add("is-selected");
      return;
    }

    // mode modif
    const checkbox = btn.previousElementSibling;
    checkbox.checked = !checkbox.checked;

    this.caseSelectedM();
  }


  caseSelectedM() {
    // Sync is-selected <-> checkbox
    this.QCMTargets.forEach(qcm => {
      const checkbox = qcm.previousElementSibling;
      qcm.classList.toggle("is-selected", checkbox.checked);
    });

    // Sync "tout sélectionner"
    const checkedCount = this.caseTargets.filter(c => c.checked).length;
    this.caseAllSelectTarget.checked =
      checkedCount === this.caseTargets.length && checkedCount > 0;

  }
  /**
   * Sélectionne toute les cases
   */
  allSelect() {
    const checked = this.caseAllSelectTarget.checked;

    this.caseTargets.forEach(box => {
      box.checked = checked;
    });

    this.syncSelectionFromCases();
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
        if (qcm.classList.contains('is-selected')) {
          qcm.previousElementSibling.checked = true;
        }
      })
      this.caseSelectedM();
    }
    if (!isModif) {
      this.QCMTargets.forEach(b =>
        b.classList.remove("is-selected")
      );
    }

    this.renameValideTargets.forEach(div => {
      div.classList.toggle("is-hidden", !isModif);
      if (!div.children[1].classList.contains('is-hidden')) {
        div.children[1].classList.add('is-hidden');
        div.children[0].classList.remove('is-hidden');
      }
    });

    if (this.hasNameTarget) {
      this.handleExistingRename()
    }
  }


  rename(event) {
    // gérer un éventuel renommage en cours
    this.handleExistingRename();

    const li = this.getQcmItem(event.currentTarget);

    // Boutons rename / valide
    li.querySelector('[data-accueil-target="rename"]').classList.add("is-hidden");
    li.querySelector('[data-accueil-target="valide"]').classList.remove("is-hidden");

    // Bouton QCM actuel
    const qcmBtn = li.querySelector('[data-accueil-target="QCM"]');
    this.nomQcm = qcmBtn.textContent;

    // Création input
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
  }





  valide(event) {
    const li = this.getQcmItem(event.currentTarget);

    // Cacher valide, afficher rename
    li.querySelector('[data-accueil-target="valide"]').classList.add("is-hidden");
    li.querySelector('[data-accueil-target="rename"]').classList.remove("is-hidden");

    const input = li.querySelector('[data-accueil-target="name"]');
    const nom = input.value;

    // Recréer le bouton QCM
    const btn = document.createElement("button");
    btn.type = "button";
    btn.classList.add("qcm-btn", "flex-grow-1");
    btn.dataset.accueilTarget = "QCM";
    btn.dataset.action = "click->accueil#select";
    btn.textContent = nom;

    // Si checkbox cochée, on garde la sélection
    if (li.querySelector('input[type="checkbox"]').checked) {
      btn.classList.add('is-selected');
    }

    const div = li.querySelector('[data-accueil-target="renameValide"]');
    li.insertBefore(btn, div);

    // Supprimer l'input
    input.remove();
  }

  finalizeRename(li, value) {
    const input = li.querySelector('[data-accueil-target="name"]');
    if (!input) return;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.classList.add("qcm-btn", "flex-grow-1");
    btn.dataset.accueilTarget = "QCM";
    btn.dataset.action = "click->accueil#select";
    btn.textContent = value;

    if (li.querySelector('input[type="checkbox"]').checked) {
      btn.classList.add("is-selected");
    }

    const div = li.querySelector('[data-accueil-target="renameValide"]');
    li.insertBefore(btn, div);

    input.remove();

    li.querySelector('[data-accueil-target="valide"]').classList.add("is-hidden");
    li.querySelector('[data-accueil-target="rename"]').classList.remove("is-hidden");
  }



  handleExistingRename() {
    const input = this.element.querySelector('[data-accueil-target="name"]');
    if (!input) return true; // aucun renommage en cours → OK

    const li = input.closest("li");
    const keep = confirm(
      "Un renommage est déjà en cours.\nVoulez-vous conserver les modifications ?"
    );

    const value = keep ? input.value : this.nomQcm;
    this.finalizeRename(li, value);

    return true;
  }

  addCorbeille(liElement){
    // Récupération de la date d'ajourd'hui et mise au format 
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0
    let dd = today.getDate();
    let dd7 = dd + 7;
    if (dd < 10) dd = '0' + dd;
    if (dd7 < 10) dd7 = '0' + dd7;
    if (mm < 10) mm = '0' + mm;
    
    let nameQCM = liElement.children[1].textContent;
    let tr = document.createElement("tr");
    tr.dataset.accueilTarget = "QCMSuppr";
    
    let tdNom = document.createElement('td');
    tdNom.textContent = nameQCM;
    tdNom.classList.add('text-wrap', 'col-4');

    let tdDateSuppr = document.createElement('td');
    tdDateSuppr.textContent = `${dd}/${mm}/${yyyy}`;
    tdDateSuppr.classList.add('text-wrap', 'col-4');

    let tdDateSupprDef = document.createElement('td');
    tdDateSupprDef.textContent = `${dd7}/${mm}/${yyyy}`;
    tdDateSupprDef.classList.add('text-wrap', 'col-4');

    let tdButton = document.createElement('td'); 
    tdButton.classList.add('text-center', 'align-middle');

    let button = document.createElement('button');
    button.type = "button";
    button.classList.add('btn', 'btn-success');
    button.dataset.action = "click->accueil#recupQcm";
    button.textContent = "Récupérer";

    tdButton.append(button);
    tr.append(tdNom, tdDateSuppr, tdDateSupprDef, tdButton);
    this.corbeilleTarget.append(tr);
    liElement.remove();
  }

  recupQcm(evt){
    let nameQCM = evt.currentTarget.closest('tr').children[0].textContent;
    if (this.modeValue !== 'modif') this.modif();
    this.addQcm("", nameQCM);
    evt.currentTarget.closest('tr').remove();
    if (this.modeValue !== 'normal') this.modif();
  }
}