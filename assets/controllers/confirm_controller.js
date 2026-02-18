import { Controller } from '@hotwired/stimulus';
import { Modal } from 'bootstrap';

export default class extends Controller {
    static targets = ['message'];

    connect() {
        try {
            // Initialiser la modal avec les options de sécurité
            this.modal = new Modal(this.element, {
                backdrop: 'static',
                keyboard: false
            });
        } catch (error) {
            console.error('Erreur lors de l\'initialisation du modal confirm:', error);
        }
    }

    disconnect() {
        // Nettoyage lors de la déconnexion du contrôleur
        if (this.modal) {
            try {
                this.modal.hide();
                this.modal.dispose();
            } catch (error) {
                console.warn('Erreur lors du nettoyage du modal:', error);
            }
        }
    }

    open(message) {
        this.messageTarget.textContent = message;

        return new Promise((resolve) => {
            this._resolve = resolve;
            if (this.modal) {
                this.modal.show();
            }
        });
    }

    confirm() {
        if (this.modal) {
            this.modal.hide();
        }
        this._resolve(true);
    }

    cancel() {
        if (this.modal) {
            this.modal.hide();
        }
        this._resolve(false);
    }
}
