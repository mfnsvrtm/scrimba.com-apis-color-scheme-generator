const display = document.querySelector('.display');

const colorPicker = document.querySelector('.color-picker');
const sizePicker = document.querySelector('.size-picker');
const modePicker = document.querySelector('.mode-picker');
const button = document.querySelector('button');
const error = document.querySelector('.error');
const popup = document.querySelector('.copy-popup');

function fetchColors() {
    const hex = colorPicker.value.substr(1);
    const mode = modePicker.value;
    const count = sizePicker.value;

    fetch(`https://www.thecolorapi.com/scheme?hex=${hex}&mode=${mode}&count=${count}`)
        .then(response => response.json())
        .then(updateColors)
}

function updateColors(colorscheme) {
    display.replaceChildren(...colorscheme.colors.map(colorToDOM))
}

function colorToDOM(color) {
    const root = document.createDocumentFragment();
    const preview = document.createElement('div');
    const value = document.createElement('div');
    
    function onClick() {
        navigator.clipboard.writeText(color.hex.value);
        popup.textContent = `Copied ${color.hex.value}`;
        fadeIn(popup, 300);
        setTimeout(fadeOut.bind(null, popup, 300), 1500);
    }
    
    preview.className = "color-preview";
    preview.style.backgroundColor = color.hex.value;
    preview.addEventListener('click', onClick);
    
    value.className = "color-value";
    value.innerText = color.hex.value;
    value.addEventListener('click', onClick);
    
    root.className = "color-container";
    root.append(preview, value);
    return root;
}

// https://verstaem.online/blog/fadein-i-fadeout-na-chistom-js/
function fadeIn(el, timeout, display) {
  el.style.opacity = 0;
  el.style.display = display || 'block';
  el.style.transition = `opacity ${timeout}ms`;
  setTimeout(() => {
    el.style.opacity = 1;
  }, 30);
}

// https://verstaem.online/blog/fadein-i-fadeout-na-chistom-js/
function fadeOut(el, timeout) {
  el.style.opacity = 1;
  el.style.transition = `opacity ${timeout}ms`;
  el.style.opacity = 0;

  setTimeout(() => {
    el.style.display = 'none';
  }, timeout);
}

function setButtonColor() {
    const color = colorPicker.value.substr(1);
    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);
    
    const thresh = r + g + b;
    const rgb = (thresh > 255 * 3 / 2) ? { r: 0, g: 0, b: 0 } : { r: 255, g: 255, b: 255 };
    
    const alpha = 0.5;
    
    button.style.color = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
    button.style.backgroundColor = colorPicker.value;
}

function validateSize() {
    const ERROR_MESSAGE = 'Number of colors must be an integer between 1 and 25';
    
    if (!sizePicker.value || isNaN(sizePicker.value)) {
        sizePicker.value = 5;
        setError(ERROR_MESSAGE);
        return false;
    }
    const value = parseInt(sizePicker.value);
    if (value < 1) {
        sizePicker.value = 1;
        setError(ERROR_MESSAGE);
        return false;
    } else if (value > 25) {
        sizePicker.value = 25;
        setError(ERROR_MESSAGE);
        return false;
    }
    
    clearError();
    return true;
}

function setError(message) {
    error.innerHTML = message;
    error.classList.add('visible');
    sizePicker.classList.add('error');
}

function clearError() {
    error.innerHTML = '';
    error.classList.remove('visible');
    sizePicker.classList.remove('error');
}

sizePicker.addEventListener('keydown', (event) => {
    if(event.ctrlKey || event.altKey || event.key.length !== 1) return;
    if (!event.key.match(/[0-9]+/g)) event.preventDefault();
});

button.addEventListener('click', () => {
    if (validateSize())
        fetchColors();
});

colorPicker.addEventListener('input', setButtonColor);

setButtonColor();
fetchColors();