export function saveToLocalStorage(data) {
    localStorage.setItem('userPairData', JSON.stringify(data));
}


export function loadFromLocalStorage() {
    const storedData = localStorage.getItem('userPairData');
    return storedData ? JSON.parse(storedData) : { userData: [], deletedItems: [] };
}

