import {
    errorMessageTexts
} from "./errorMessageTexts.js";

const { emptyInput, missingEquals, emptyName,emptyValue,invalidCharacters,emptySearch,noPairsFound} = errorMessageTexts;


export function formValidate(input) {
    const trimmed = input.trim();
    if (trimmed === '') {
        return { isValid: false, error: emptyInput };
    }
    const pairs = trimmed.split('=').map(pair => pair.trim());


    if (pairs.length !== 2) {
        return { isValid:false, error: missingEquals };
    }

    const [name, value] = pairs;

    if (name.length === 0) {
        return { isValid:false, error: emptyName };
    }
    if (value.length === 0) {
        return { isValid:false, error: emptyValue };
    }
    if (!name.match(/^[a-zA-Z0-9]+$/) || !value.match(/^[a-zA-Z0-9]+$/)) {
        return { isValid:false, error: invalidCharacters };
    }

    return { isValid:true, pair: { name, value } };
}


export function searchValidate(data, input) {

    if (input.value.trim() === '') {
        return { isValid: false, error: emptySearch };
    }

    else if (data.length === 0) {
        return { isValid: false, error: noPairsFound };
    }
    return { isValid: true, error: null };
}