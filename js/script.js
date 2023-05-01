import keys from './keys.js';

const BODY = document.querySelector('body');
const simultaneouslyPressedKeys = new Set();
let lang;
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

function setLocalStorage() {
  localStorage.setItem('lang', lang);
}

function getLocalStorage() {
  if (localStorage.getItem('lang')) {
    lang = localStorage.getItem('lang');
  } else {
    lang = 'en';
  }
}

window.addEventListener('beforeunload', setLocalStorage);
window.addEventListener('load', getLocalStorage);

function createKeyboard() {
  keyboard.innerHTML = '<div class="keyboard__content"></div>';
  keyboardContent = document.querySelector('.keyboard__content');
  keys.forEach((key) => {
    const div = document.createElement('div');
    div.className = `keyboard__key ${key.name}`;
    div.innerHTML = key[localStorage.getItem('lang')];
    keyboardContent.append(div);
  });
}

function changeKeyboardValues(currentLang) {
  const keySet = document.querySelectorAll('.keyboard__key');
  keySet.forEach((keyDiv) => {
    keys.forEach((key) => {
      if (keyDiv.classList.contains(key.name)) {
        const div = keyDiv;
        div.innerHTML = key[currentLang];
      }
    });
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

function isPressedCtrlAndAlt() {
  if (simultaneouslyPressedKeys.has('ControlLeft') && simultaneouslyPressedKeys.has('AltLeft')) {
    return true;
  }
  return false;
}

function changeLanguage(curLang) {
  switch (curLang) {
    case 'en':
      lang = 'ru';
      changeKeyboardValues(lang);
      break;
    case 'ru':
      lang = 'en';
      changeKeyboardValues(lang);
      break;
    case 'ruShiftDown':
      lang = 'enShiftDown';
      changeKeyboardValues(lang);
      break;
    case 'enShiftDown':
      lang = 'ruShiftDown';
      changeKeyboardValues(lang);
      break;
    default:
      changeKeyboardValues(lang);
  }
}

document.addEventListener('keydown', (event) => {
  highlightTheKey(event.code);
  event.preventDefault();
  simultaneouslyPressedKeys.add(event.code);
  if (isPressedCtrlAndAlt() && !event.repeat) {
    changeLanguage(lang);
  }
});

document.addEventListener('keyup', (event) => {
  removeHighlight(event.code);
  simultaneouslyPressedKeys.delete(event.code);
});
