import {filterItems} from "./filterItems.js";
import {createErrorMessage} from "./createErrorMessage.js";


export function searchValidate(input, data, isDeleted = false) {
    const filtered = filterItems(data, input.value, isDeleted);

    if (input.value.trim() === '') {
        createErrorMessage(input, 'Please enter search criteria');
    } else if (filtered.length === 0) {
        createErrorMessage(input, 'No items found. Try different criteria');
    } else {
        createErrorMessage(input);
    }

    return filtered;
}

export function clearSearchError(input) {
    if (input.value.trim() === '') {
        input.value = '';
        createErrorMessage(input);
    }
}