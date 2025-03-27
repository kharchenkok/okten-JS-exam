export function handleSelectAll(data, isChecked) {
    return data.map(item => ({...item, selected: isChecked}));
}

export function handleItemSelect(data, id, checked) {
    return data.map(item =>
        item.id === id ? {...item, selected: checked} : item
    );
}