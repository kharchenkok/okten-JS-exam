import {validate} from "./helpers/validate.js";
import {handleErrorMessage} from "./helpers/message.js";
import {renderPairItem,renderSelectAll,renderModalDeletedItems} from "./helpers/renders.js";
import {handleSelectAll,handleItemSelect} from "./helpers/select.js";
import {handleSort} from "./helpers/sort.js";
import {deleteSelected} from "./helpers/deleteSelected.js";
import {loadFromLocalStorage,saveToLocalStorage} from "./helpers/localStorage.js";
import { toggleModal } from "./helpers/modal.js";


const pairForm = document.getElementById('pairForm');
const pairsWrapper = document.getElementById('pairsWrapper')
const pairsList = document.getElementById('pairsList');
const sortButtons = document.querySelectorAll('[data-sort]');
const deleteSelectedBtn = document.getElementById('deleteSelected');
const showDeletedItemsBtn = document.getElementById('showDeletedItemsBtn');

// =================
const storedData = loadFromLocalStorage();
let userData = storedData.userData;
let deletedItems = storedData.deletedItems;

console.log('storedData',storedData);

updateUI();

const sortDirections = {
    name: true,
    value: true,
};



function initSelectAll() {
    const selectAllCheckbox = document.getElementById('selectAll');
    if (selectAllCheckbox && !selectAllCheckbox.hasAttribute("data-listener")) {
        selectAllCheckbox.addEventListener("change", (e) => {
            userData = handleSelectAll(userData, e.target.checked);
            updateUI();
        });

        selectAllCheckbox.setAttribute("data-listener", "true");
    }
}

function updateUI() {
    renderPairItem(userData, pairsList);
    renderSelectAll(userData, pairsWrapper);
    initSelectAll();
    saveToLocalStorage({userData, deletedItems});
    if (deletedItems.length > 0) {
        showDeletedItemsBtn.classList.toggle('visibility-hidden', false);
    } else {
        showDeletedItemsBtn.classList.toggle('visibility-hidden', true);
    }
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
    const newId = userData.length ? Math.max(...userData.map(item => item.id)) + 1 : 1;
    userData.push({...result.pair, selected: false,id: newId});
    e.target.reset();
    updateUI();
}





pairForm.addEventListener('submit', handleSubmit);

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

    console.log('deletedItems = updatedDeletedItems', updatedDeletedItems)
    updateUI()
});



pairsList.addEventListener('change', (e) => {
    if (e.target.hasAttribute('data-pair-checkbox')) {
        const id = parseInt(e.target.id);
        const checked = e.target.checked;
        userData = handleItemSelect(userData, id, checked);
        updateUI();
    }
});


// =======modal==========

showDeletedItemsBtn.addEventListener('click', () => {
    renderModalDeletedItems(deletedItems);
    toggleModal('deletedItemsModal');

    addRestoreEventListener();
});


function addRestoreEventListener() {
    const restoreSelectedBtn = document.getElementById('restoreSelectedBtn');
    if (restoreSelectedBtn) {
        restoreSelectedBtn.addEventListener('click', () => {
            const selectedItems = [];

            const checkboxes = document.querySelectorAll('#deletedItemsModal input[type="checkbox"]:checked');
            checkboxes.forEach(checkbox => {
                const itemId = parseInt(checkbox.dataset.itemId);
                const itemToRestore = deletedItems.find(item => item.id === itemId);

                if (itemToRestore) {
                    selectedItems.push(itemToRestore);
                }
            });

            if (selectedItems.length > 0) {
                userData = [...userData, ...selectedItems];
                deletedItems = deletedItems.filter(item => !selectedItems.includes(item));

                saveToLocalStorage({ userData, deletedItems });

                updateUI();
                renderModalDeletedItems(deletedItems); // Перемалюємо модалку з новими даними
            }
        });
    }
}




document.body.addEventListener('click', (e) => {
    if (e.target.id === 'closeModalBtn' || e.target.classList.contains('modal')) {
        const modalId = e.target.closest('.modal') ? e.target.closest('.modal').id : null;
        console.log('modalId', modalId);
        if (modalId) {
            toggleModal(modalId);
        }
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('deletedItemsModal');
        if (modal && !modal.classList.contains('visibility-hidden')) {
            toggleModal('deletedItemsModal');
        }
    }
});






