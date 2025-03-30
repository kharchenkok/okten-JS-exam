export function setAllPairsSelected(data, isChecked, filteredIds = null) {
    if (filteredIds) {
        return data.map(item => ({
            ...item,
            selected: filteredIds[item.id] ? isChecked : item.selected
        }));
    }
    return data.map(item => ({...item, selected: isChecked}));
}

export function updatePairSelection(data, id, checked) {
    return data.map(item =>
        item.id === id ? {...item, selected: checked} : item
    );
}

export function updateSelectAllCheckbox(data, checkbox) {
    if (data.length === 0) {
        checkbox.checked = false;
        return;
    }
    checkbox.checked = data.every(item => item.selected);
}