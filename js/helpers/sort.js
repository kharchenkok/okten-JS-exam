export function handleSort(data, field, ascending) {
    return [...data].sort((a, b) =>
        ascending
            ? a[field].localeCompare(b[field],undefined, { numeric: true, sensitivity: 'base' })
            : b[field].localeCompare(a[field],undefined, { numeric: true, sensitivity: 'base' })
    );
}






// export function sort(data, field, ascending) {
//     return [...data].sort((a, b) => {
//         // Функція для перевірки, чи починається значення з літери
//         const isLettersFirst = (str) => /^[a-zA-Z]/.test(str);  // Починається з літери
//         const isNumbersFirst = (str) => /^[0-9]/.test(str);  // Починається з цифри
//
//         // Логіка сортування:
//         // 1. Якщо a починається з букви, а b з цифри - a йде першим
//         // 2. Якщо обидва починаються з літер або обидва з цифр - сортуємо за алфавітом/числом
//         const orderA = isLettersFirst(a[field]) ? 0 : 1; // 0 - літери спочатку, 1 - цифри
//         const orderB = isLettersFirst(b[field]) ? 0 : 1;
//
//         // Якщо обидва елементи належать до однієї категорії (літери або цифри)
//         if (orderA === orderB) {
//             // Якщо це числові значення, порівнюємо як числа
//             if (!isNaN(a[field]) && !isNaN(b[field])) {
//                 return ascending ? Number(a[field]) - Number(b[field]) : Number(b[field]) - Number(a[field]);
//             }
//             // Якщо це текстові значення, сортуємо за допомогою localeCompare
//             return ascending
//                 ? a[field].localeCompare(b[field])
//                 : b[field].localeCompare(a[field]);
//         } else {
//             // Якщо один елемент починається з літери, а інший з цифри, сортуємо їх за категорією
//             return orderA - orderB;
//         }
//     });
// }