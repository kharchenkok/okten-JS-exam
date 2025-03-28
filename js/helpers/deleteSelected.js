export function deleteSelected(userData,deletedItems) {
    // return data.filter(item => !item.selected);
    const selectedItems = userData.filter(item =>item.selected);
    const updatedUserData = userData.filter(item =>!item.selected);
    selectedItems.forEach(item =>{
        deletedItems.push({
            ...item,
            deletedTime: new Date().toLocaleString(),
        });
    })
    console.log('updatedUserData', updatedUserData);
    console.log('deletedItems', deletedItems);
    return {
        updatedUserData,
        updatedDeletedItems: deletedItems
    };
}
