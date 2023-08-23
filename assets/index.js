document.addEventListener("DOMContentLoaded", () => {
  // Sélection des éléments du DOM
  const copyPasswordWithIcon = document.getElementById("copyPasswordWithIcon");
  const generatePasswordBtn = document.getElementById("generatePassword");
  const hidePassword = document.getElementById("hidePassword");
  const passwordLoader = document.getElementById("passwordLoader");
  const passwordLengthNumber = document.getElementById("passwordLengthNumber");
  const passwordLengthRange = document.getElementById("passwordLengthRange");
  const includeUppercase = document.getElementById("includeUppercase");
  const includeLowercase = document.getElementById("includeLowercase");
  const includeNumbers = document.getElementById("includeNumbers");
  const includeSymbols = document.getElementById("includeSymbols");
  const generatedPassword = document.getElementById("generatedPassword");
  const copyPasswordWithButton = document.getElementById(
    "copyPasswordWithButton"
  );

  initializePasswordGenerator();
  updateGeneratedPassword();

  /**
   * Initialise les options et gère les événements liés au générateur de mot de passe.
   */
  function initializePasswordGenerator() {
    // Initialisation des options
    includeUppercase.checked = true;
    includeLowercase.checked = true;
    includeNumbers.checked = true;
    includeSymbols.checked = true;
    // Gestion des événements
    passwordLengthNumber.addEventListener("input", handlePasswordLengthChange);
    passwordLengthRange.addEventListener("input", handlePasswordLengthChange);
    includeUppercase.addEventListener("change", changePasswordOptions);
    includeLowercase.addEventListener("change", changePasswordOptions);
    includeNumbers.addEventListener("change", changePasswordOptions);
    includeSymbols.addEventListener("change", changePasswordOptions);
    generatePasswordBtn.addEventListener("click", handleGeneratePassword);
    copyPasswordWithIcon.addEventListener("click", handleCopyPassword);
    hidePassword.addEventListener("click", handleHidePassword);
    copyPasswordWithButton.addEventListener(
      "click",
      handleCopyPasswordWithButton
    );
  }

  /**
   * Gère le changement de la longueur du mot de passe en fonction du nombre.
   */
  function handlePasswordLengthChange() {
    passwordLengthRange.value = passwordLengthNumber.value;
    updateGeneratedPassword();
  }

  /**
   * Gère le changement de la longueur du mot de passe en fonction du curseur.
   */
  function handlePasswordLengthChange() {
    passwordLengthNumber.value = passwordLengthRange.value;
    updateGeneratedPassword();
  }

  /**
   * Gère la génération du mot de passe lors du clic sur le bouton "Générer Mot de Passe".
   */
  function handleGeneratePassword() {
    generatePasswordBtn.classList.add("animate-spin");
    updateGeneratedPassword();
    setTimeout(() => {
      generatePasswordBtn.classList.remove("animate-spin");
    }, 500);
  }

  /**
   * Gère la copie du mot de passe lors du clic sur l'icône de copie.
   */
  function handleCopyPassword() {
    copyPasswordWithIcon.classList.add("animate-ping");
    generatedPassword.select();
    generatedPassword.setSelectionRange(0, 99999); // For mobile devices
    navigator.clipboard.writeText(generatedPassword.value);
    window.getSelection().removeAllRanges();
    setTimeout(() => {
      copyPasswordWithIcon.classList.remove("animate-ping");
    }, 500);
    createToast(ToastType.SUCCESS, "Le mot de passe a été copié.");
  }

  /**
   * Gère la masquage/affichage du mot de passe lors du clic sur le bouton "Hide".
   */
  function handleHidePassword() {
    hidePassword.classList.add("animate-ping");
    if (generatedPassword.type === "password") {
      generatedPassword.type = "text"; // Change le type de l'input en "text" pour afficher le texte
    } else {
      generatedPassword.type = "password"; // Change le type de l'input en "password" pour masquer le texte
    }
    setTimeout(() => {
      hidePassword.classList.remove("animate-ping");
    }, 500);
  }

  /**
   * Gère la copie du mot de passe lors du clic sur le bouton "Copier".
   */
  function handleCopyPasswordWithButton() {
    generatedPassword.select();
    generatedPassword.setSelectionRange(0, 99999); // For mobile devices
    navigator.clipboard.writeText(generatedPassword.value);
    window.getSelection().removeAllRanges();
    createToast(ToastType.SUCCESS, "Le mot de passe a été copié.");
  }

  function changePasswordOptions() {
    const numSelectedCheckboxes = document.querySelectorAll(
      "input[type='checkbox']:checked"
    ).length;
    if (numSelectedCheckboxes === 0) {
      /**
       * Empêche de déselectionner le dernier checkbox afin de garder un critère pour le mot de passe
       */
      this.checked = true;
    }
    updateGeneratedPassword();
  }

  // Fonction pour générer un mot de passe en fonction des options sélectionnées
  async function generatePassword(length, options) {
    return new Promise((resolve, reject) => {
      try {
        let characters = "";
        if (options.includeUppercase)
          characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if (options.includeLowercase)
          characters += "abcdefghijklmnopqrstuvwxyz";
        if (options.includeNumbers) characters += "0123456789";
        if (options.includeSymbols) characters += "!@#$%^&*()_-+=<>?";
        let password = "";
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          password += characters.charAt(randomIndex);
        }
        resolve(password);
      } catch (error) {
        reject(error);
      }
    });
  }

  // Fonction pour mettre à jour le mot de passe généré en fonction des options sélectionnées
  async function updateGeneratedPassword() {
    const passwordLength = parseInt(passwordLengthNumber.value);
    const options = {
      includeUppercase: includeUppercase.checked,
      includeLowercase: includeLowercase.checked,
      includeNumbers: includeNumbers.checked,
      includeSymbols: includeSymbols.checked,
    };
    passwordLoader.classList.add("animate-spin");
    try {
      const newPassword = await generatePassword(passwordLength, options);
      generatedPassword.value = newPassword;
      createToast(ToastType.SUCCESS, "Un nouveau mot de passe a été genéré.");
    } catch (error) {
      console.error("Erreur lors de la génération du mot de passe :", error);
      createToast(
        ToastType.DANGER,
        "Une erreur est survenue lors Erreur lors de la génération du mot de passe."
      );
    } finally {
      setTimeout(() => {
        passwordLoader.classList.remove("animate-spin");
      }, 500);
    }
  }
});

/*-------*/
/* TOAST */
/*-------*/

const ToastType = {
  SUCCESS: "success",
  DANGER: "danger",
  WARNING: "warning",
};

const lastToastTime = {
  [ToastType.SUCCESS]: 0,
  [ToastType.WARNING]: 0,
  [ToastType.DANGER]: 0,
};

const toastData = {
  [ToastType.SUCCESS]: {
    style: {
      iconClass: "text-green-500 bg-green-100",
      bgColor: "bg-white",
      textColor: "text-gray-500",
    },
  },
  [ToastType.WARNING]: {
    style: {
      iconClass: "text-yellow-500 bg-yellow-100",
      bgColor: "bg-white",
      textColor: "text-gray-500",
    },
  },
  [ToastType.DANGER]: {
    style: {
      iconClass: "text-red-500 bg-red-100",
      bgColor: "bg-white",
      textColor: "text-gray-500",
    },
  },
};

function createToast(type, message, duration = 3000, cooldownTime = 2000) {
  // console.log(type, message);
  // Vérification de la validité de cooldownTime
  const defaultCoolDownTime = 2000;
  if (typeof cooldownTime !== "number" || cooldownTime < 2000) {
    console.error(
      "Le cooldownTime doit être un entier et au moins égal à " +
        cooldownTime +
        "."
    );
    cooldownTime = defaultCoolDownTime;
  }
  // Attendre avant d'afficher un nouveau toast du même type
  const now = Date.now();
  if (now - lastToastTime[type] < cooldownTime) {
    return;
  }
  lastToastTime[type] = now;
  // Vérification si le type est valide
  if (!Object.values(ToastType).includes(type)) {
    const errorMsg = `Type de toast invalide : ${type}`;
    console.error(errorMsg);
    createToast(ToastType.DANGER, errorMsg);
    return;
  }
  const defaultDuration = 3000;
  // Vérification de la validité de la durée
  if (typeof duration !== "number" || duration < 2000) {
    console.error(
      "La durée du toast doit être un entier et au moins égal à " +
        duration +
        "."
    );
    duration = defaultDuration;
  }
  // Utiliser le tableau associatif toastStyles pour obtenir les propriétés de style
  const { iconClass, bgColor, textColor } =
    toastData[type].style || toastData.default.style;
  const toast = document.createElement("div");
  const toastId = `toast-${Date.now()}`;
  toast.id = toastId;
  toast.className = `flex items-center justify-between w-full max-w-xs p-4 mb-4 ${textColor} ${bgColor} rounded-lg shadow fixed bottom-4 right-4`;
  const content = `
        <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 ${iconClass} rounded-lg mr-2">
            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
            </svg>
            <span class="sr-only">${type} icon</span>
        </div>
        <div class="ml-3 text-sm font-normal">${message}</div>
        <button type="button" class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#${toastId}" aria-label="Close">
            <span class="sr-only">Close</span>
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
        </button>
  `;
  toast.innerHTML = content;
  document.body.appendChild(toast);
  // Supprimer le toast lorsque l'utilisateur clique sur la croix
  const closeButton = toast.querySelector(
    `[data-dismiss-target="#${toastId}"]`
  );
  closeButton.addEventListener("click", function () {
    toast.remove();
  });
  setTimeout(function () {
    toast.remove();
  }, duration);
}
