export function renderPairItem(data, parentElem) {
    parentElem.innerHTML = '';
    data.forEach((elem) => {
        const itemMarkup=`
        <li class="pair-item" >
            <input class="pair-checkbox visibility-hidden" id="${elem.id}" data-pair-checkbox type="checkbox"${elem.selected ? ' checked' : ''}>
            <span class="custom-checkbox"></span>
            <label for="${elem.id}">${elem.name} = ${elem.value}</label>
        </li>
        `
        parentElem.insertAdjacentHTML('beforeend',itemMarkup);
    });
}

export function renderSelectAll(data, parentElem) {
    const existingSelectAll = document.getElementById('selectAllContainer');
    if (existingSelectAll) {
        existingSelectAll.remove();
    }

    if (data.length >= 2) {
        const selectAllMarkup = `
            <div class="select-all-container" id="selectAllContainer">
                <label class="select-all-label">
                    <input type="checkbox" id="selectAll" ${data.every(item => item.selected) ? 'checked' : ''}> 
                    Select All
                </label>
            </div>
        `;
        parentElem.insertAdjacentHTML('afterbegin', selectAllMarkup);


    }
}

export function renderModalDeletedItems(deletedItems) {
    const modalContent = document.querySelector('#deletedItemsModal .modal-content');
    if (modalContent) {
        modalContent.innerHTML = `
            <h2>Deleted Items</h2>
            ${deletedItems.length === 0 ?
            '<p>No deleted items</p>' :
            deletedItems.map(item => `
                    <div>
                        <input type="checkbox" id="restore-${item.id}" data-item-id="${item.id}">
                        <label for="restore-${item.id}">${item.name} = ${item.value} (Deleted at: ${item.deletedTime})</label>
                    </div>
                `).join('')}
            <button id="closeModalBtn">Close</button>
            <button id="restoreSelectedBtn">Restore Selected</button>
        `;
    }
}

