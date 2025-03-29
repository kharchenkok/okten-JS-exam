
export function filterItems(items, searchText, isDeletedList = false) {
    if (!searchText.trim()) return items; // Якщо поле порожнє, повертаємо всі елементи

    return items.filter(item => {
        const nameMatch = item.name.toLowerCase().includes(searchText.toLowerCase());
        const valueMatch = item.value.toLowerCase().includes(searchText.toLowerCase());
        const timeMatch = isDeletedList && item.deletedTime
            ? new Date(item.deletedTime).toLocaleString("en-GB", { timeZone: "UTC" }).includes(searchText)
            : false;

        return nameMatch || valueMatch || timeMatch;
    });
}

