export default function render(data,list) {
    list.innerHTML = '';
    data.forEach((elem, index) => {
        const itemMarkup=`
        <li class="pair-item">
            <input class="pair-checkbox visibility-hidden" type="checkbox" id="pair-${index}">
            <span class="custom-checkbox"></span>
            <label for="pair-${index}">${elem.name} = ${elem.value}</label>
        </li>
        `
        list.insertAdjacentHTML('beforeend',itemMarkup);
    });
}