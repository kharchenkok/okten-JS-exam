export function getSelectedPairsForRestore(userData, deletedItems) {
    const selectedForRestore = deletedItems.filter(item => item.selected);
    const restoredItems = selectedForRestore.map(item => ({
        ...item,
        selected: true,
    }));

    const deletedItemsNotRestored = deletedItems.filter(item =>
        !selectedForRestore.includes(item)
    );

    return {
        updatedUserData: [...userData, ...restoredItems],
        updatedDeletedItems: deletedItemsNotRestored
    };
}