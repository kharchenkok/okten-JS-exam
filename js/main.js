import validate from "./helpers/validate.js";
import handleErrorMessage from "./helpers/handleErrorMessage.js";
import sort from "./helpers/sort.js";
import render from "./helpers/render.js";
import deleteSelected from "./helpers/deleteSelected.js";


const pairForm = document.getElementById('pairForm');
const pairsList = document.getElementById('pairsList');
const sortByNameBtn = document.getElementById('sortByName');
const sortByValueBtn = document.getElementById('sortByValue');
const deleteSelectedBtn = document.getElementById('deleteSelected');

let userData = [];

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
    userData.push(result.pair);
    e.target.reset();
    render(userData,pairsList);
}

pairForm.addEventListener('submit', handleSubmit);

sortByNameBtn.addEventListener('click', () => {
   userData = sort(userData, 'name');
    render(userData,pairsList);
});
sortByValueBtn.addEventListener('click', () => {
    userData = sort(userData,'value');
    render(userData, pairsList);
});
deleteSelectedBtn.addEventListener('click', ()=>{
    userData = deleteSelected(userData, pairsList);
    render(userData, pairsList);
});
