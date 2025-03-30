export function saveToLocalStorage(data) {
    try {
        localStorage.setItem('userPairData', JSON.stringify(data));
    } catch (error) {
        console.error('Помилка збереження даних:', error);
    }
}

export function loadFromLocalStorage() {
    try {
        const storedData = localStorage.getItem('userPairData');
        if (!storedData) {
            return { userData: [], deletedItems: [] };
        }

        return JSON.parse(storedData);
    } catch (error) {
        return { userData: [], deletedItems: [] };
    }
}
