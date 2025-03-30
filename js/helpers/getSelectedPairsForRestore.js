export function getSelectedPairsForRestore(userData, deletedItems) {
    const selectedForRestore = deletedItems.filter(item => item.selected);
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