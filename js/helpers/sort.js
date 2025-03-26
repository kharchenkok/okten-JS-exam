export default function sort(data,field) {
    return [...data].sort((a, b) => a[field].localeCompare(b[field]));
}