const sortDirections = {
    name: true,
    value: true,
    deletedTime: false,
};


export function sortByField(field, data) {
    const ascending = sortDirections[field];
    const sortedData = [...data].sort((a, b) => {
        if (field === 'deletedTime') {
            const timeA = new Date(a[field]).getTime();
            const timeB = new Date(b[field]).getTime();
            return ascending ? timeA - timeB : timeB - timeA;
        }

        const options = { numeric: true, sensitivity: 'base' };
        return ascending
            ? a[field].localeCompare(b[field], undefined, options)
            : b[field].localeCompare(a[field], undefined, options);
    });

    sortDirections[field] = !sortDirections[field];
    return sortedData;
}