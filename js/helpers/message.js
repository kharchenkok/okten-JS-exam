export function handleErrorMessage(input, message = '') {
    const label = input.closest('label');
    let errorElement = label.querySelector('.input-error');

    if (!message) {
        errorElement?.remove();
        input.classList.remove('input-invalid');
        return;
    }

    if (!errorElement) {
        errorElement = document.createElement('span');
        errorElement.className = 'input-error';
        label.appendChild(errorElement);
    }

    errorElement.textContent = message;
    input.classList.add('input-invalid');
}