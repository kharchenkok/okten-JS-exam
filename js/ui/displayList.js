function createPairListItem(data, parentElem, options = {}) {
    const { isDeleted = false, insertPosition = 'afterbegin' } = options;

    parentElem.innerHTML = '';
    data.forEach((item) => {
        const dateInfo = isDeleted ? ` (${new Date(item.deletedTime).toLocaleString("en-GB")})` : '';
        const checkboxType = isDeleted ? 'data-deleted-pair-checkbox' : 'data-pair-checkbox';
        const extraClass = isDeleted ? ' deleted-pair-item' : '';

        const itemMarkup = `
        <li class="pair-item ${extraClass}">
            <label class="pair-label">
                <input class="pair-checkbox visibility-hidden" id="${item.id}" ${checkboxType} type="checkbox"${item.selected ? ' checked' : ''}>
                <span class="custom-checkbox"></span>
                ${item.name} = ${item.value} ${dateInfo}
            </label>
        </li>
        `;
        parentElem.insertAdjacentHTML(insertPosition, itemMarkup);
    });
}

export function displayActivePairs(data, parentElem) {
    createPairListItem(data, parentElem);
}

export function displayDeletedPairs(deletedItems, parentElem) {
    createPairListItem(deletedItems, parentElem, { isDeleted: true });
}