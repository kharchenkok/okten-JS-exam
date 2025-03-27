export function deleteSelected(data) {
    return data.filter(item => !item.selected);
}
