// assets/helpers/confirm.js
export async function confirmMess(application, message) {
    const el = document.querySelector('[data-controller="confirm"]');

    if (!el) {
        throw new Error('Confirm modal not found');
    }

    const controller =
        application.getControllerForElementAndIdentifier(el, 'confirm');

    return controller.open(message);
}
