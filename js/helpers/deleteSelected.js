export default function deleteSelected(data,list) {
    const selectedCheckboxes = list.querySelectorAll('input[type="checkbox"]:checked');
    const selectedIndexes = [...selectedCheckboxes].map(checkbox =>[...list.children].indexOf(checkbox.parentNode));
    return data.filter((_, index) => !selectedIndexes.includes(index));
}
