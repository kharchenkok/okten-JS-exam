export function filterItems(data, searchText, isDeletedList = false) {
    const trimmed = searchText.trim();
    if (!trimmed) return data;

    const lowerTrimmed = trimmed.toLowerCase();

    return data.filter(item => {
        const nameMatch = item.name.toLowerCase().includes(lowerTrimmed);
        const valueMatch = item.value.toLowerCase().includes(lowerTrimmed);
        const timeMatch = isDeletedList && item.deletedTime
            ? new Date(item.deletedTime).toLocaleString("en-GB").includes(trimmed)
            : false;

        return nameMatch || valueMatch || timeMatch;
    });
}

