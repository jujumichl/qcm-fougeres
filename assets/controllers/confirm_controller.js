import { Controller } from '@hotwired/stimulus';
import { Modal } from 'bootstrap';

export default class extends Controller {
    static targets = ['message'];

    connect() {
        this.modal = new Modal(this.element);
    }

    open(message) {
        this.messageTarget.textContent = message;

        return new Promise((resolve) => {
            this._resolve = resolve;
            this.modal.show();
        });
    }

    confirm() {
        this.modal.hide();
        this._resolve(true);
    }

    cancel() {
        this.modal.hide();
        this._resolve(false);
    }
}
