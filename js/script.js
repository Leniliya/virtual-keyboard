import keys from './keys.js';

const BODY = document.querySelector('body');
let keyboard;
let keyboardContent;

function createBasicTemplate() {
  BODY.innerHTML = `<div class="wrapper">
  <h1 class="title">RSS Virtual Keyboard</h1>
  <div class="text-area__wrapper">
    <textarea class="text-area" name="text-area" id="" cols="50" rows="17"></textarea>
  </div>
  <div class="keyboard">
  </div>
  <p class="description">Клавиатура создана в операционной системе Windows<br>Для переключения языка комбинация: левыe
    ctrl + alt</p>
</div> `;
  keyboard = document.querySelector('.keyboard');
}

function createKeyboard() {
  keyboard.innerHTML = '<div class="keyboard__content"></div>';
  keyboardContent = document.querySelector('.keyboard__content');
  keys.forEach((key) => {
    const div = document.createElement('div');
    div.className = `keyboard__key ${key.name}`;
    div.innerHTML = key.en;
    keyboardContent.append(div);
  });
}

function init() {
  createBasicTemplate();
  createKeyboard();
}

init();

function highlightTheKey(code) {
  keys.forEach(() => {
    const pressedKey = document.querySelector(`.${code}`);
    pressedKey.classList.add('keyboard__key_active');
  });
}

function removeHighlight(code) {
  keys.forEach(() => {
    const pressedKey = document.querySelector(`.${code}`);
    pressedKey.classList.remove('keyboard__key_active');
  });
}

document.addEventListener('keydown', (event) => {
  highlightTheKey(event.code);
  event.preventDefault();
});

document.addEventListener('keyup', (event) => {
  removeHighlight(event.code);
});
