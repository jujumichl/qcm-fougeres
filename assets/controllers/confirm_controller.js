import { Controller } from '@hotwired/stimulus';
import { Modal } from 'bootstrap';

export default class extends Controller {
    static targets = ['message', 'conf', 'ok'];

    connect() {
        this.okModal = new Modal(this.okTarget);
        this.confModal = new Modal(this.confTarget);
    }

    openOk(message) {
        this.messageTargets[1].textContent = message;

        return new Promise((resolve) => {
            this._resolve = resolve;
            this.okModal.show();
        });
    }

    confirmOk() {
        this.okModal.hide();
        this._resolve(true);
    }


    openConf(message) {
        this.messageTargets[0].textContent = message;

        return new Promise((resolve) => {
            this._resolve = resolve;
            this.confModal.show();
        });
    }

    confirmConf() {
        this.confModal.hide();
        this._resolve(true);
    }

    cancelConf() {
        this.confModal.hide();
        this._resolve(false);
    }
}
