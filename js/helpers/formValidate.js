export function formValidate(input) {
    const trimmed = input.trim();
    if (trimmed === '') {
        return { isValid: false, error: 'Please enter a valid name=value pair' };
    }
    const pairs = trimmed.split('=').map(pair => pair.trim());


    if (pairs.length !== 2) {
        return { isValid:false, error: 'Input must contain one equals sign (=)' };
    }

    const [name, value] = pairs;

    if (name.length === 0) {
        return { isValid:false, error: 'Name (before equals sign) cannot be empty' };
    }
    if (value.length === 0) {
        return { isValid:false, error: 'Value (after equals sign) cannot be empty' };
    }
    if (!name.match(/^[a-zA-Z0-9]+$/) || !value.match(/^[a-zA-Z0-9]+$/)) {
        return { isValid:false, error: 'Name and value must contain only alphanumeric characters' };
    }

    return { isValid:true, pair: { name, value } };
}