import bubbly from './animation/bubbly-bg';

import '../styles/style';

import Tests from './tests';


const startBtn = document.getElementById('start'),
    form = document.getElementsByTagName('form')[0],
    inputName = document.getElementById('name'),
    inputEmail = document.getElementById('email');

inputName.addEventListener('keyup', () => startBtn.disabled = !(inputName.value.trim() && /^[a-z]{3,10}(-|_)?[a-z]{3,10}(-\d{4})?@[a-z]{1,6}\.(com|ru)$/i.test(inputEmail.value.trim())));
inputEmail.addEventListener('keyup', () => startBtn.disabled = !(inputName.value.trim() && /^[a-z]{3,10}(-|_)?[a-z]{3,10}(-\d{4})?@[a-z]{1,6}\.(com|ru)$/i.test(inputEmail.value.trim())));

let test = new Tests();

startBtn.addEventListener('click', () => {
        test.startTest();
        startBtn.parentNode.remove();
        form.classList.add('none');
    }
);

window.addEventListener('load', bubbly({
    colorStart: '#0e0e93',
    colorStop: '#ff1a2b',
    bubbleFunc: () => `hsla(0, 100%, 50%, ${Math.random() * 0.25})`
}));