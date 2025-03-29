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
        parentElem.insertAdjacentHTML('afterbegin',itemMarkup);
    });
}


export function renderDeletedItems(deletedItems, parentElem) {
    parentElem.innerHTML = '';
    deletedItems.forEach((item) => {
        const formattedDateTime = new Date(item.deletedTime).toLocaleString("en-GB", { timeZone: "UTC" })
        const itemMarkup=`
        <li class="pair-item deleted-pair-item" >
            <input class="pair-checkbox visibility-hidden" id="${item.id}" data-deleted-pair-checkbox type="checkbox" ${item.selected ? ' checked' : ''}>
            <span class="custom-checkbox"></span>
            <label for="${item.id}">${item.name} = ${item.value} (${formattedDateTime})</label>
        </li>
        `
        parentElem.insertAdjacentHTML('beforeend',itemMarkup);
    });
}