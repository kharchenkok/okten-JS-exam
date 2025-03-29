export function restoreDeletedPairs(deletedItems, userData) {
    const selectedForRestore = deletedItems.filter(item =>
        document.getElementById(`${item.id}`)?.checked
    );

    const restoredItems = selectedForRestore.map((item, index) => ({
        ...item,
        selected: true,
    }));

    const remainingDeletedItems = deletedItems.filter(item =>
        !selectedForRestore.includes(item)
    );

    return {
        updatedUserData: [...userData, ...restoredItems],
        updatedDeletedItems: remainingDeletedItems
    };
}