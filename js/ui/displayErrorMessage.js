export function displayErrorMessage(input, message = '') {
    const label = input.closest('label');
    let errorElement = label.querySelector('.input-invalid-message');

    if (!message) {
        errorElement?.remove();
        input.classList.remove('input-invalid');
        return;
    }

    if (!errorElement) {
        errorElement = document.createElement('span');
        errorElement.className = 'input-invalid-message';
        label.appendChild(errorElement);
    }

    errorElement.textContent = message;
    input.classList.add('input-invalid');
}

export function clearSearchError(input) {
    if (input.value.trim() === '') {
        input.value = '';
        displayErrorMessage(input);
    }
}