export function updateModalBtnVisibility(btn,conditionArr ) {
    btn.classList.toggle('visibility-hidden', conditionArr.length === 0);
}
export function toggleModal(modal) {
    modal.classList.toggle('visibility-hidden');
}

