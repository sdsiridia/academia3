import './scss/_style.scss';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  const emailInput = document.getElementById('email');
  const emailWrapper = emailInput?.closest('.input-wrapper');
  const emailError = document.getElementById('email-error');

  const passwordInput = document.getElementById('password');
  const passwordWrapper = passwordInput?.closest('.input-wrapper');
  const passwordError = document.getElementById('password-error');
  const togglePasswordBtn = document.getElementById('toggle-password');

  const submitBtn = document.getElementById('submit-btn');
  const globalAlert = document.getElementById('global-alert');
  const alertText = document.getElementById('alert-text');

  if (!form || !emailInput) return;

  // Lista de errores de tipografía comunes en dominios populares
  const DOMAIN_TYPOS = {
    'gmai.com': 'gmail.com',
    'gamil.com': 'gmail.com',
    'gmial.com': 'gmail.com',
    'gmaill.com': 'gmail.com',
    'hotmial.com': 'hotmail.com',
    'hotmai.com': 'hotmail.com',
    'outlok.com': 'outlook.com',
    'outloo.com': 'outlook.com',
    'yaho.com': 'yahoo.com',
    'yahou.com': 'yahoo.com',
    'iclou.com': 'icloud.com',
  };

  // Expresión regular robusta para formato de email (RFC 5322 simplificado)
  const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  let emailTouched = false;
  let passwordTouched = false;

  /**
   * Valida la dirección de email
   * @param {string} value
   * @returns {{ isValid: boolean, message: string, suggestion?: string }}
   */
  function validateEmail(value) {
    const trimmed = value.trim();

    if (!trimmed) {
      return {
        isValid: false,
        message: 'El correo electrónico es obligatorio.',
      };
    }

    if (!EMAIL_REGEX.test(trimmed)) {
      if (!trimmed.includes('@')) {
        return {
          isValid: false,
          message: 'Falta el símbolo "@" en la dirección de correo.',
        };
      }
      const parts = trimmed.split('@');
      if (!parts[1] || !parts[1].includes('.')) {
        return {
          isValid: false,
          message: 'Introduce un dominio válido después del "@" (ejemplo: .com, .es).',
        };
      }
      return {
        isValid: false,
        message: 'Introduce un formato de correo electrónico válido (ej: alumno@conquerblocks.com).',
      };
    }

    // Verificar posibles erratas en dominios frecuentes
    const [user, domain] = trimmed.toLowerCase().split('@');
    if (DOMAIN_TYPOS[domain]) {
      const suggestedEmail = `${user}@${DOMAIN_TYPOS[domain]}`;
      return {
        isValid: false,
        message: `¿Quisiste decir `,
        suggestion: suggestedEmail,
      };
    }

    return { isValid: true, message: '' };
  }

  /**
   * Muestra u oculta el estado visual del campo de email
   */
  function applyEmailValidation(showErrorsOnlyIfTouched = true) {
    if (showErrorsOnlyIfTouched && !emailTouched) return;

    const res = validateEmail(emailInput.value);

    if (res.isValid) {
      emailWrapper?.classList.remove('has-error');
      emailWrapper?.classList.add('has-success');
      emailInput.setAttribute('aria-invalid', 'false');
      if (emailError) {
        emailError.classList.remove('is-visible');
        emailError.innerHTML = '';
      }
    } else {
      emailWrapper?.classList.remove('has-success');
      emailWrapper?.classList.add('has-error');
      emailInput.setAttribute('aria-invalid', 'true');

      if (emailError) {
        emailError.classList.add('is-visible');
        if (res.suggestion) {
          emailError.innerHTML = `
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            <span>${res.message}</span>
            <button type="button" class="suggestion-btn" id="email-suggestion-btn" data-email="${res.suggestion}">${res.suggestion}</button>?
          `;

          // Event listener para autocompletar la sugerencia
          const suggestionBtn = document.getElementById('email-suggestion-btn');
          suggestionBtn?.addEventListener('click', () => {
            emailInput.value = res.suggestion;
            applyEmailValidation(false);
            emailInput.focus();
          });
        } else {
          emailError.innerHTML = `
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            <span>${res.message}</span>
          `;
        }
      }
    }

    return res.isValid;
  }

  /**
   * Valida el campo de contraseña
   */
  function validatePassword(showErrorsOnlyIfTouched = true) {
    if (showErrorsOnlyIfTouched && !passwordTouched) return true;
    if (!passwordInput) return true;

    const value = passwordInput.value;
    let isValid = true;
    let message = '';

    if (!value) {
      isValid = false;
      message = 'Por favor, introduce tu contraseña.';
    } else if (value.length < 6) {
      isValid = false;
      message = 'La contraseña debe tener al menos 6 caracteres.';
    }

    if (isValid) {
      passwordWrapper?.classList.remove('has-error');
      passwordWrapper?.classList.add('has-success');
      passwordInput.setAttribute('aria-invalid', 'false');
      if (passwordError) {
        passwordError.classList.remove('is-visible');
        passwordError.innerHTML = '';
      }
    } else {
      passwordWrapper?.classList.remove('has-success');
      passwordWrapper?.classList.add('has-error');
      passwordInput.setAttribute('aria-invalid', 'true');
      if (passwordError) {
        passwordError.classList.add('is-visible');
        passwordError.innerHTML = `
          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          <span>${message}</span>
        `;
      }
    }

    return isValid;
  }

  // Listeners de email
  emailInput.addEventListener('blur', () => {
    emailTouched = true;
    applyEmailValidation(false);
  });

  emailInput.addEventListener('input', () => {
    if (emailTouched) {
      applyEmailValidation(false);
    }
  });

  // Listeners de contraseña
  if (passwordInput) {
    passwordInput.addEventListener('blur', () => {
      passwordTouched = true;
      validatePassword(false);
    });

    passwordInput.addEventListener('input', () => {
      if (passwordTouched) {
        validatePassword(false);
      }
    });
  }

  // Alternar visibilidad de la contraseña
  togglePasswordBtn?.addEventListener('click', () => {
    if (!passwordInput) return;
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';

    togglePasswordBtn.setAttribute(
      'aria-label',
      isPassword ? 'Ocultar contraseña' : 'Ver contraseña'
    );

    // SVG icon toggle
    togglePasswordBtn.innerHTML = isPassword
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
          <line x1="1" y1="1" x2="23" y2="23"></line>
        </svg>`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>`;
  });

  // Envío del formulario
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    emailTouched = true;
    passwordTouched = true;

    const isEmailValid = applyEmailValidation(false);
    const isPasswordValid = validatePassword(false);

    if (!isEmailValid) {
      emailInput.focus();
      return;
    }

    if (!isPasswordValid && passwordInput) {
      passwordInput.focus();
      return;
    }

    // Proceso de login exitoso
    if (submitBtn) {
      submitBtn.classList.add('is-loading');
      submitBtn.disabled = true;
      const btnText = submitBtn.querySelector('.btn-text');
      if (btnText) btnText.textContent = 'Verificando credenciales...';
    }

    // Simulación de respuesta de backend
    setTimeout(() => {
      if (submitBtn) {
        submitBtn.classList.remove('is-loading');
        submitBtn.disabled = false;
        const btnText = submitBtn.querySelector('.btn-text');
        if (btnText) btnText.textContent = 'Entrar a la plataforma';
      }

      if (globalAlert && alertText) {
        globalAlert.className = 'auth-alert is-visible is-success';
        globalAlert.innerHTML = `
          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <span id="alert-text">¡Validación exitosa! Acceso concedido al Campus Virtual de Conquer Blocks.</span>
        `;
        globalAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 1200);
  });
});
