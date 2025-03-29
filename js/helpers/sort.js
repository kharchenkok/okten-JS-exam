export function handleSort(data, field, ascending) {
    return [...data].sort((a, b) => {
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
}
