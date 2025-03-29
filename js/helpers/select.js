export function handleSelectAll(data, isChecked) {
    return data.map(item => ({...item, selected: isChecked}));
}

export function handleItemSelect(data, id, checked) {
    return data.map(item =>
        item.id === id ? {...item, selected: checked} : item
    );
}

export function handleSelectAllCheckbox(data,checkbox) {

    checkbox.checked = data.every(item => item.selected);


}