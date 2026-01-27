import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['count', 'tot'];

  connect() {
    this.totTarget.textContent = this.countTargets.length;
    console.log('Nombre de boutons :', this.countTargets.length);
  }
  count(){
    this.totTarget.textContent = this.countTargets.length;
  }
  
  select(event) {
  this.countTargets.forEach(btn =>
    btn.classList.remove("is-selected")
  )
  event.currentTarget.classList.add("is-selected")
}


  //this.countTargets.forEach(...)

}
