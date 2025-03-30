// ====== IMPORTS ======
import { formValidate,searchValidate } from "./utils/validations.js";
import { displayErrorMessage,clearSearchError } from "./ui/displayErrorMessage.js";
import { displayDeletedPairs, displayActivePairs } from "./ui/displayList.js";
import { setAllPairsSelected, updatePairSelection, updateSelectAllCheckbox } from "./helpers/select.js";
import { sortByField } from "./helpers/sort.js";
import { getSelectedPairsForDelete } from "./helpers/getSelectedPairsForDelete.js";
import { loadFromLocalStorage, saveToLocalStorage } from "./helpers/localStorage.js";
import { getSelectedPairsForRestore } from "./helpers/getSelectedPairsForRestore.js";
import { generateUniqueId } from "./utils/generateUniqueId.js";
import { filterItems } from "./helpers/filterItems.js";
import { toggleModal, updateModalBtnVisibility } from "./helpers/modal.js";

// ====== VARIABLE DECLARATIONS ======
const pairsForm = document.getElementById('pairsForm');
const pairsList = document.getElementById('pairsList');
const deletedPairsList = document.getElementById('deletedPairsList');
const sortButtons = document.querySelectorAll('[data-sort]');
const selectAllCheckbox = document.getElementById('selectAll');
const deleteSelectedBtn = document.getElementById('deleteSelectedPairs');
const showModalBtn = document.getElementById('showModal');
const modal = document.getElementById('modal');

const closeModalBtn = document.getElementById('closeModal');
const restoreDeletedBtn = document.getElementById('restoreDeletedPairs');
const searchPairsInput = document.getElementById('pairsSearch');
const searchDeletedInput = document.getElementById('deletedSearch');

// ====== DATA INITIALIZATION ======
const storedData = loadFromLocalStorage();
let userData = storedData.userData;
let deletedItems = storedData.deletedItems;

// ====== UI UPDATES ======
function refreshInterface() {
    const filteredActivePairs = filterItems(userData, searchPairsInput.value);
    const filteredDeletedPairs = filterItems(deletedItems, searchDeletedInput.value, true);

    displayActivePairs(filteredActivePairs, pairsList);
    displayDeletedPairs(filteredDeletedPairs, deletedPairsList);

    updateSelectAllCheckbox(filteredActivePairs, selectAllCheckbox);
    updateModalBtnVisibility(showModalBtn, deletedItems);
    saveToLocalStorage({ userData, deletedItems });
}

// ======  HANDLERS ======

//Form handling
function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const input = form.elements.pairInput;

    const result = formValidate(input.value);
    if (!result.isValid) {
        displayErrorMessage(input, result.error);
        return;
    }

    displayErrorMessage(input);
    userData.push({ ...result.pair, selected: false, id: generateUniqueId() });
    form.reset();
    refreshInterface();
}

//Sorting handling
function handleSort(e) {
    const field = e.target.getAttribute('data-sort');
    if (field === 'deletedTime') {
        deletedItems = sortByField(field, deletedItems);
    } else {
        userData = sortByField(field, userData);
    }
    refreshInterface();
}


//Handling deletion/restoration of deleted items
function handleUpdatePairLists(action) {
    let updatedData, filtered, input;

    if (action === 'delete') {
        updatedData = getSelectedPairsForDelete(userData, deletedItems);
        input = searchPairsInput;
    } else if (action === 'restore') {
        updatedData = getSelectedPairsForRestore(userData, deletedItems);
        input = searchDeletedInput;
    }

    if (!updatedData) return;

    userData = updatedData.updatedUserData;
    deletedItems = updatedData.updatedDeletedItems;

    if (input.value.trim() !== '') {
        filtered = action === 'delete'
            ? filterItems(userData, input.value)
            : filterItems(deletedItems, input.value, true);

        const result = searchValidate(filtered, input);
        displayErrorMessage(input, result.isValid ? '' : result.error);
    }

    refreshInterface();
}


//SelectAll checkbox handling
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

//Checkbox handling in lists
function handlePairSelectionChange(e) {
    if (e.target.hasAttribute('data-pair-checkbox') ) {
        userData = updatePairSelection(userData, e.target.id, e.target.checked);
    }
    if (e.target.hasAttribute('data-deleted-pair-checkbox')) {
        deletedItems = updatePairSelection(deletedItems, e.target.id, e.target.checked);
    }
    refreshInterface();
}

//Search handling
function handleSearch(action) {
    let filtered,input;
    if (action === 'deleted'){
        filtered = filterItems(deletedItems, searchDeletedInput.value,true);
        input = searchDeletedInput;
        displayDeletedPairs(filtered, deletedPairsList);

    }
    else if (action === 'active'){
        filtered = filterItems(userData, searchPairsInput.value );
        input = searchPairsInput;
        displayActivePairs(filtered, pairsList);
    }

    const result = searchValidate(filtered, input);
    !result.isValid ? displayErrorMessage(input, result.error): displayErrorMessage(input);

}

// ====== EVENT LISTENER ======

//Form event
pairsForm.addEventListener('submit', handleFormSubmit);

//Sorting event
sortButtons.forEach(button => button.addEventListener('click', handleSort));

//Deletion/restoration events
deleteSelectedBtn.addEventListener('click', ()=>handleUpdatePairLists('delete'));
restoreDeletedBtn.addEventListener('click', ()=>handleUpdatePairLists('restore'));

//Checkbox events
selectAllCheckbox.addEventListener('change', handleSelectAllCheckbox);

pairsList.addEventListener('change', handlePairSelectionChange);
deletedPairsList.addEventListener('change', handlePairSelectionChange);


//Search events
searchPairsInput.addEventListener('input', () => handleSearch('active'));
searchDeletedInput.addEventListener('input', () => handleSearch('deleted'));
searchPairsInput.addEventListener('blur', () => clearSearchError(searchPairsInput));
searchDeletedInput.addEventListener('blur', () => clearSearchError(searchDeletedInput));
pairsForm.elements.pairInput.addEventListener('blur', () => clearSearchError(pairsForm.elements.pairInput));

//Modal events
    showModalBtn.addEventListener('click', () => {
        displayDeletedPairs(deletedItems, deletedPairsList);
        toggleModal(modal);
    })

    closeModalBtn.addEventListener('click', ()=>toggleModal(modal));

//General
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('visibility-hidden')) {
        modal.classList.toggle('visibility-hidden');
    }
});

// ====== INITIALIZATION ======
refreshInterface();
