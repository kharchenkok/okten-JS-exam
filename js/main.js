import {validate} from "./helpers/validate.js";
import {handleErrorMessage} from "./helpers/message.js";
import {renderPairItem,renderSelectAll} from "./helpers/renders.js";
import {handleSelectAll,handleItemSelect} from "./helpers/select.js";
import {handleSort} from "./helpers/sort.js";
import {deleteSelected} from "./helpers/deleteSelected.js";



const pairForm = document.getElementById('pairForm');
const pairsWrapper = document.getElementById('pairsWrapper')
const pairsList = document.getElementById('pairsList');
const sortButtons = document.querySelectorAll('[data-sort]');
const deleteSelectedBtn = document.getElementById('deleteSelected');
// ==========================
let userData = [];
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
    userData = deleteSelected(userData);
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





