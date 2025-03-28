// export function saveToLocalStorage(userData, deletedItems){
//
//     const data = {
//         userData,
//         deletedItems,
//     };
//     localStorage.setItem('userPairData', JSON.stringify(data));
// }
//
// export function loadFromLocalStorage(){
//     const storedData = localStorage.getItem('userPairData');
//     console.log('storeFromLocalStorage',storedData);
//     return storedData? JSON.parse(storedData) : {userData:[], deletedItems:[]}
// }


export function saveToLocalStorage(data) {
    console.log('Saving data to localStorage:', data);
    localStorage.setItem('userPairData', JSON.stringify(data));
}


export function loadFromLocalStorage() {
    const storedData = localStorage.getItem('userPairData');
    console.log('Loaded data from localStorage:', storedData);
    return storedData ? JSON.parse(storedData) : { userData: [], deletedItems: [] };
}

