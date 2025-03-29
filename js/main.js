import {validate} from "./helpers/validate.js";
import {handleErrorMessage} from "./helpers/message.js";
import {renderDeletedItems,renderPairItem} from "./helpers/renders.js";
import {handleSelectAll, handleItemSelect, handleSelectAllCheckbox} from "./helpers/select.js";
import {handleSort} from "./helpers/sort.js";
import {deleteSelected} from "./helpers/deleteSelected.js";
import {loadFromLocalStorage,saveToLocalStorage} from "./helpers/localStorage.js";
import {restoreDeletedPairs} from "./helpers/restoreDeletedPairs.js";
import {generateUniqueId} from "./helpers/generateUniqueId.js";
import {filterItems} from "./helpers/filterItems.js";



const pairsForm = document.getElementById('pairsForm');
const pairsList = document.getElementById('pairsList');
const sortButtons = document.querySelectorAll('[data-sort]');
const selectAllCheckbox = document.getElementById('selectAll');

const deleteSelectedBtn = document.getElementById('deleteSelected');
const showModalBtn = document.getElementById('showModal');
const modal = document.getElementById('modal');
const deletedItemsList = document.getElementById('deletedItemsList');
const closeModalBtn = document.getElementById('closeModal');
const sortByDeletedTimeBtn = document.querySelector('[data-deleted-sort="deletedTime"]');
const restoreDeletedBtn = document.getElementById('restoreDeletedItems');
const searchPairsInput = document.getElementById('pairsSearch');
const searchDeletedInput = document.getElementById('deletedSearch');


// =================
const storedData = loadFromLocalStorage();
let userData = storedData.userData;
let deletedItems = storedData.deletedItems;


const sortDirections = {
    name: true,
    value: true,
    deletedTime: false,
};

function updateUI() {
    const filteredUserData = filterItems(userData, searchPairsInput.value);
    const filteredDeletedItems = filterItems(deletedItems, searchDeletedInput.value, true);

    renderPairItem(filteredUserData, pairsList);
    renderDeletedItems(filteredDeletedItems, deletedItemsList);

    handleSelectAllCheckbox(filteredUserData, selectAllCheckbox);
    initSelectAll();
    updateShowModalButton();
    saveToLocalStorage({ userData, deletedItems });
}

function updateShowModalButton() {
    showModalBtn.classList.toggle('visibility-hidden', deletedItems.length === 0);
}

function initSelectAll() {
    if (selectAllCheckbox && !selectAllCheckbox.hasAttribute("data-listener")) {
        selectAllCheckbox.addEventListener("change", (e) => {
            userData = handleSelectAll(userData, e.target.checked);
            updateUI();
        });

        selectAllCheckbox.setAttribute("data-listener", "true");
    }

    handleSelectAllCheckbox(userData,selectAllCheckbox);
}

function handleSubmit(e) {
    e.preventDefault();
    const inputElement = e.target.querySelector('#pairInput');
    const inputValue = inputElement.value;
    const result = validate(inputValue);

    if (!result.isValid) {
        handleErrorMessage(inputElement, result.error);
        return;
    }

    handleErrorMessage(inputElement);
    const newId  = generateUniqueId();
    userData.push({...result.pair, selected: false,id: newId});
    e.target.reset();
    updateUI();
}

function initModalHandlers() {
    showModalBtn.addEventListener('click', () => {
        renderDeletedItems(deletedItems, deletedItemsList);
        modal.classList.toggle('visibility-hidden');
    });

    closeModalBtn.addEventListener('click', () => {
        modal.classList.toggle('visibility-hidden');
    });

    sortByDeletedTimeBtn.addEventListener('click', (e) => {

        const field = e.target.getAttribute('data-deleted-sort');
        const isAscending = sortDirections[field];
        deletedItems = handleSort(deletedItems, field, isAscending);

        renderDeletedItems(deletedItems, deletedItemsList);
        sortDirections[field] = !sortDirections[field];
        saveToLocalStorage({userData, deletedItems});
    });

    restoreDeletedBtn.addEventListener('click', () => {
        const result = restoreDeletedPairs(deletedItems, userData);
        userData = result.updatedUserData;
        deletedItems = result.updatedDeletedItems;
        updateUI();

        const filteredDeletedItems = filterItems(deletedItems, searchDeletedInput.value, true);
        if (filteredDeletedItems.length === 0) {
            handleErrorMessage(searchDeletedInput, 'Нічого не знайдено після видалення. Спробуйте інші критерії.');
        } else {
            handleErrorMessage(searchDeletedInput);
        }
        renderDeletedItems(filteredDeletedItems, deletedItemsList);
    });
}

pairsForm.addEventListener('submit', handleSubmit);


sortButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const field = button.getAttribute('data-sort');
        const isAscending = sortDirections[field];

        userData = handleSort(userData, field, isAscending);
        updateUI();
        sortDirections[field] = !sortDirections[field];
    });
});


deleteSelectedBtn.addEventListener('click', ()=>{
    const { updatedUserData, updatedDeletedItems } = deleteSelected(userData,deletedItems);
    userData = updatedUserData;
    deletedItems = updatedDeletedItems;
    const filteredUserData = filterItems(userData, searchPairsInput.value);
    if (filteredUserData.length === 0) {
        handleErrorMessage(searchPairsInput, 'Нічого не знайдено після видалення. Спробуйте інші критерії.');
    } else {
        handleErrorMessage(searchPairsInput);
    }
    updateUI()
});

// Обробники подій для пошуку
searchPairsInput.addEventListener('input', () => {
    const filtered = filterItems(userData, searchPairsInput.value);
    renderPairItem(filtered, pairsList);

    if (searchPairsInput.value.trim() === '') {
        handleErrorMessage(searchPairsInput, 'Будь ласка, введіть критерії пошуку.');
    } else if (filtered.length === 0) {
        handleErrorMessage(searchPairsInput, 'Нічого не знайдено. Спробуйте інші критерії.');
    } else {
        handleErrorMessage(searchPairsInput);
    }
});

searchDeletedInput.addEventListener('input', () => {
    const filtered = filterItems(deletedItems, searchDeletedInput.value, true);
    renderDeletedItems(filtered, deletedItemsList);

    if (searchDeletedInput.value.trim() === '') {
        handleErrorMessage(searchDeletedInput, 'Будь ласка, введіть критерії пошуку.');
    } else if (filtered.length === 0) {
        handleErrorMessage(searchDeletedInput, 'Нічого не знайдено. Спробуйте інші критерії.');
    } else {
        handleErrorMessage(searchDeletedInput);
    }
});

// Обробники подій для blur
searchPairsInput.addEventListener('blur', () => {
    if (searchPairsInput.value.trim() === '') {
        handleErrorMessage(searchPairsInput);
    }
});

searchDeletedInput.addEventListener('blur', () => {
    if (searchDeletedInput.value.trim() === '') {
        handleErrorMessage(searchDeletedInput);
    }
});


pairsList.addEventListener('change', (e) => {
    if (e.target.hasAttribute('data-pair-checkbox')) {
        const id = e.target.id;
        const checked = e.target.checked;

        userData = handleItemSelect(userData, id, checked);

        updateUI()

    }
});
deleteSelectedBtn.addEventListener('click', () => {
    const { updatedUserData, updatedDeletedItems } = deleteSelected(userData, deletedItems);
    userData = updatedUserData;
    deletedItems = updatedDeletedItems;
    updateUI();

    const filteredDeletedItems = filterItems(deletedItems, searchDeletedInput.value, true);
    renderDeletedItems(filteredDeletedItems, deletedItemsList);
});


document.body.addEventListener('click', (e) => {

    if (e.target.id === "modal") {
        modal.classList.toggle('visibility-hidden');

    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        modal.classList.toggle('visibility-hidden');
    }
});

initModalHandlers();
updateUI();


