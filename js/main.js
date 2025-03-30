// ====== ІМПОРТИ ======
import { formValidate } from "./helpers/formValidate.js";
import { createErrorMessage } from "./helpers/createErrorMessage.js";
import { displayDeletedPairs, displayActivePairs } from "./helpers/displayList.js";
import { setAllPairsSelected, updatePairSelection, updateSelectAllCheckbox } from "./helpers/select.js";
import { handleSort } from "./helpers/sort.js";
import { getSelectedPairsForDelete } from "./helpers/getSelectedPairsForDelete.js";
import { loadFromLocalStorage, saveToLocalStorage } from "./helpers/localStorage.js";
import { getSelectedPairsForRestore } from "./helpers/getSelectedPairsForRestore.js";
import { generateUniqueId } from "./helpers/generateUniqueId.js";
import { filterItems } from "./helpers/filterItems.js";
import {
    clearSearchError,
    searchValidate
} from "./helpers/searchValidate.js";
import { toggleModal, updateModalBtnVisibility } from "./helpers/modal.js";

// ====== ОГОЛОШЕННЯ ЗМІННИХ ======
const pairsForm = document.getElementById('pairsForm');
const pairsList = document.getElementById('pairsList');
const deletedPairsList = document.getElementById('deletedPairsList');
const sortButtons = document.querySelectorAll('[data-sort]');
const selectAllCheckbox = document.getElementById('selectAll');
const deleteSelectedBtn = document.getElementById('deleteSelectedPairs');
const showModalBtn = document.getElementById('showModal');
const modal = document.getElementById('modal');

const closeModalBtn = document.getElementById('closeModal');
const sortByDeletedTimeBtn = document.querySelector('[data-deleted-sort="deletedTime"]');
const restoreDeletedBtn = document.getElementById('restoreDeletedPairs');
const searchPairsInput = document.getElementById('pairsSearch');
const searchDeletedInput = document.getElementById('deletedSearch');

// ====== ІНІЦІАЛІЗАЦІЯ ДАНИХ ======
const storedData = loadFromLocalStorage();
let userData = storedData.userData;
let deletedItems = storedData.deletedItems;

// ====== ОНОВЛЕННЯ ІНТЕРФЕЙСУ ======
function refreshInterface() {
    const filteredActivePairs = filterItems(userData, searchPairsInput.value);
    const filteredDeletedPairs = filterItems(deletedItems, searchDeletedInput.value, true);

    displayActivePairs(filteredActivePairs, pairsList);
    displayDeletedPairs(filteredDeletedPairs, deletedPairsList);

    updateSelectAllCheckbox(filteredActivePairs, selectAllCheckbox);
    updateModalBtnVisibility(showModalBtn, deletedItems);
    saveToLocalStorage({ userData, deletedItems });
}

// ======  ХЕНДЛЕРИ ======

//Опрацювання форми
function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const input = form.elements.pairInput;

    const result = formValidate(input.value);
    if (!result.isValid) {
        createErrorMessage(input, result.error);
        return;
    }

    createErrorMessage(input);
    userData.push({ ...result.pair, selected: false, id: generateUniqueId() });
    form.reset();
    refreshInterface();
}

//Опрацювання сортування
function handleSortEvent(e) {
    const field = e.target.getAttribute('data-sort');
    if (field === 'deletedTime') {
        deletedItems = handleSort(field, deletedItems);
    } else {
        userData = handleSort(field, userData);
    }
    refreshInterface();
}

//Опрацювання видалення/відновлення видалених елементів
function handleUpdatePairLists(action) {
    let updatedData =
        action === 'delete' ? getSelectedPairsForDelete(userData, deletedItems)
            : action === 'restore' ? getSelectedPairsForRestore(userData, deletedItems)
                : null;

    if (!updatedData) return;

    userData = updatedData.updatedUserData;
    deletedItems = updatedData.updatedDeletedItems;

    if (action === 'delete' && searchPairsInput.value.trim() !== '') {
        searchValidate(searchPairsInput, userData);
    } else if (action === 'restore' && searchDeletedInput.value.trim() !== '') {
        searchValidate(searchDeletedInput, deletedItems, true);
    }

    refreshInterface();
}

//Опрацювання чек-боксу SelectAll
function handleSelectAllCheckbox(e)  {
    if (searchPairsInput.value.trim() !== '') {
        const filteredActivePairs = filterItems(userData, searchPairsInput.value);
        const filteredPairsId = {};
        filteredActivePairs.forEach(item => {
            filteredPairsId[item.id] = true;
        });
        userData = setAllPairsSelected(userData, e.target.checked, filteredPairsId);
    } else {
        userData = setAllPairsSelected(userData, e.target.checked);
    }
    refreshInterface();
}
//Опрацювання чек-боксів у списках
function handlePairSelectionChange(e) {
    if (e.target.hasAttribute('data-pair-checkbox') ) {
        userData = updatePairSelection(userData, e.target.id, e.target.checked);
    }
    if (e.target.hasAttribute('data-deleted-pair-checkbox')) {
        deletedItems = updatePairSelection(deletedItems, e.target.id, e.target.checked);
    }
    refreshInterface();
}

// ====== ОБРОБНИКИ ПОДІЙ ======

//Обробник форми
pairsForm.addEventListener('submit', handleFormSubmit);

//Обробники сортування
sortButtons.forEach(button => button.addEventListener('click', handleSortEvent));

//Обробники видалення/відновлення видалених пар
deleteSelectedBtn.addEventListener('click', ()=>handleUpdatePairLists('delete'));
restoreDeletedBtn.addEventListener('click', ()=>handleUpdatePairLists('restore'));

//Обробники чек-боксів
selectAllCheckbox.addEventListener('change', handleSelectAllCheckbox);

pairsList.addEventListener('change', handlePairSelectionChange);

deletedPairsList.addEventListener('change', handlePairSelectionChange)

// Обробники пошуку
searchPairsInput.addEventListener('input', () => {

    // const filtered = searchValidate(searchPairsInput, userData);
    const filtered = filterItems(searchPairsInput, userData);
    displayActivePairs(filtered, pairsList);
});

searchDeletedInput.addEventListener('input', () => {
    const filtered = searchValidate(searchDeletedInput, deletedItems,true);
    displayDeletedPairs(filtered, deletedPairsList);
});



searchPairsInput.addEventListener('blur', () => clearSearchError(searchPairsInput));
searchDeletedInput.addEventListener('blur', () => clearSearchError(searchDeletedInput));
pairsForm.elements.pairInput.addEventListener('blur', () => clearSearchError(pairsForm.elements.pairInput));

//Обробники відкриття/закриття модального вікна
    showModalBtn.addEventListener('click', () => {
        displayDeletedPairs(deletedItems, deletedPairsList);
        toggleModal(modal);
    })

    closeModalBtn.addEventListener('click', ()=>toggleModal(modal));

//Загальні
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('visibility-hidden')) {
        modal.classList.toggle('visibility-hidden');
    }
});

// ====== ІНІЦІАЛІЗАЦІЯ ======
refreshInterface();
