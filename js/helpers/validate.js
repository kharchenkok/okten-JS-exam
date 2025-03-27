export function validate(input) {
    const trimmed = input.trim();
    if (trimmed === '') {
        return { isValid: false, error: 'Input cannot be empty' };
    }
    const pairs = trimmed.split('=').map(pair => pair.trim());
    let isValid;

    if (pairs.length !== 2) {
        isValid = false;
        return { isValid, error: 'Input must contain one equals sign (=)' };
    }

    const [name, value] = pairs;

    if (!name.match(/^[a-zA-Z0-9]+$/) || !value.match(/^[a-zA-Z0-9]+$/)) {
        isValid = false;
        return { isValid, error: 'Name and value must contain only alphanumeric characters' };
    }
    isValid=true;
    return { isValid, pair: { name, value } };
}