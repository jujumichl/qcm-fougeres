// controllers/select_add_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
    static targets = ["select", "addButton", "form", "input"]

    showInput() {
        this.addButtonTarget.classList.add("d-none")
        this.formTarget.classList.remove("d-none")
        this.inputTarget.focus()
    }

    cancelForm() {
        this.close()
    }

    close() {
        this.formTarget.classList.add("d-none")
        this.addButtonTarget.classList.remove("d-none")
        this.inputTarget.value = ""
    }

    addOption() {
        const value = this.inputTarget.value.trim() // Trim() enlève les espaces au début et à la fin

        if (!value) return // Si la valeur est vide la fonction s'arrête

        const exists = Array.from(this.selectTarget.options) // Intègre la collection HTML des options du select sous forme de tableau JS
        .some(option => option.value === value) // renvoi un @bool => vérifie si la valeur existe ou non parmi les options existantes

        // Envoie une alerte si valeur déjà existante et arrête la fonction
        if (exists) {
            alert("Cette option existe déjà")
            return
        }

        // Sinon, intègre l'option rentré dans le select
        const option = document.createElement("option")
        option.value = value
        option.textContent = value
        option.selected = true

        this.selectTarget.appendChild(option)

        // fermeture de la fenêtre input
        this.close()
    }
}

