export function deleteSelected(userData,deletedItems) {
    const selectedItems = userData.filter(item =>item.selected);
    const updatedUserData = userData.filter(item =>!item.selected);
    selectedItems.forEach(item =>{
        deletedItems.push({
            ...item,
            deletedTime: new Date().toISOString(),
            selected: false
        });
    })
    return {
        updatedUserData,
        updatedDeletedItems: deletedItems
    };
}
