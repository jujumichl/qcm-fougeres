<<<<<<< HEAD
import { Application } from "@hotwired/stimulus";

/**
 * Renvoie un message de confirmation personnalisé
 * @param {Application} application doit être = à this.application 
 * @param {String} message Message que l'on souhaite écrire 
 * @param {string} type conf ou ok
 * @returns 
 */
export async function confirmMess(application, message, type="conf") {
    const el = document.querySelector('[data-controller="confirm"]');

    if (!el) {
        throw new Error('Modal not found');
=======
// assets/helpers/confirm.js
export async function confirmMess(application, message) {
    const el = document.querySelector('[data-controller="confirm"]');

    if (!el) {
        throw new Error('Confirm modal not found');
>>>>>>> origin/develop
    }

    const controller =
        application.getControllerForElementAndIdentifier(el, 'confirm');
<<<<<<< HEAD
    if (!type){
        throw new Error('Type is not defined');
    }
    else{
        if (type.toLowerCase() === "conf"){
            return controller.openConf(message);
        }
        else if (type.toLowerCase() === "warning"){
            return controller.openWarn(message);
        }
        else {
            controller.openOk(message);
        }
    }
=======

    return controller.open(message);
>>>>>>> origin/develop
}
