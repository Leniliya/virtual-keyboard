import keys from './keys.js';

const BODY = document.querySelector('body');
const simultaneouslyPressedKeys = new Set();
let textarea;
let lang;
let keyboard;
let keyboardContent;

function createBasicTemplate() {
  BODY.innerHTML = `<div class="wrapper">
  <h1 class="title">RSS Virtual Keyboard</h1>
  <div class="text-area__wrapper">
    <textarea class="text-area" name="text-area" id="" cols="50" rows="10"></textarea>
  </div>
  <div class="keyboard">
  </div>
  <p class="description">Клавиатура создана в операционной системе Windows<br>Для переключения языка комбинация: левыe
    ctrl + alt</p>
</div> `;
  keyboard = document.querySelector('.keyboard');
  textarea = document.querySelector('.text-area');
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
    div.innerHTML = key[localStorage.getItem('lang') || 'en'];
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
    if (!code === 'CapsLock') {
      const pressedKey = document.querySelector(`.${code}`);
      pressedKey.classList.add('keyboard__key_active');
    }
  });
}

function removeHighlight(code) {
  keys.forEach(() => {
    const pressedKey = document.querySelector(`.${code}`);
    pressedKey.classList.remove('keyboard__key_active');
  });
}

function removeAllHighlight() {
  const pressedKey = document.querySelectorAll('.keyboard__key');
  pressedKey.forEach((key) => {
    if (!key === 'CapsLock') {
      key.classList.remove('keyboard__key_active');
    }
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

function performShift() {
  let caps = lang;
  const shiftLeft = document.querySelector('.ShiftLeft');
  const shiftRight = document.querySelector('.ShiftRight');
  if (shiftLeft.classList.contains('keyboard__key_active') || shiftRight.classList.contains('keyboard__key_active')) {
    if (caps === 'en') {
      caps = 'enShiftDown';
    } else if (caps === 'ru') {
      caps = 'ruShiftDown';
    }
  } else if (caps === 'enShiftDown') {
    caps = 'en';
  } else if (caps === 'ruShiftDown') {
    caps = 'ru';
  }

  changeKeyboardValues(caps);
}

function performCapsLock() {
  let caps = lang;
  const capslockKey = document.querySelector('.CapsLock');
  capslockKey.classList.toggle('keyboard__key_active');
  if (capslockKey.classList.contains('keyboard__key_active')) {
    if (caps === 'en') {
      caps = 'enShiftDown';
    } else if (caps === 'ru') {
      caps = 'ruShiftDown';
    }
  } else if (caps === 'enShiftDown') {
    caps = 'en';
  } else if (caps === 'ruShiftDown') {
    caps = 'ru';
  }
  const keySet = document.querySelectorAll('.keyboard__key');
  keySet.forEach((keyDiv) => {
    keys.forEach((key) => {
      if (keyDiv.classList.contains(key.name)) {
        const div = keyDiv;
        div.innerHTML = key[caps];
      }
    });
  });
}

function performKeyAction(inner) {
  switch (inner) {
    case 'Tab':
      textarea.value += '\t';
      break;
    case 'Shift':
      performShift();
      break;
    case 'Alt':
      break;
    case 'Backspace':
      break;
    case 'Enter':
      textarea.value += '\n';
      break;
    case 'CapsLock':
      performCapsLock();
      break;
    case 'Win':
      break;
    case 'Del':
      break;
    case 'Ctrl':
      break;
    default:
      textarea.value += inner;
  }
}

function findInnerHtml(code) {
  const pressedKey = document.querySelectorAll('.keyboard__key');
  let result;
  pressedKey.forEach((key) => {
    if (key.classList.contains(`${code}`)) {
      result = key.innerHTML;
    }
  });
  return result;
}

document.addEventListener('keydown', (event) => {
  const inner = findInnerHtml(event.code);
  highlightTheKey(event.code);
  performKeyAction(inner);
  event.preventDefault();
  simultaneouslyPressedKeys.add(event.code);
  if (isPressedCtrlAndAlt() && !event.repeat) {
    changeLanguage(lang);
  }
});

document.addEventListener('keyup', (event) => {
  removeHighlight(event.code);
  simultaneouslyPressedKeys.delete(event.code);
  performShift();
});

document.addEventListener('mousedown', (event) => {
  if (event.target.classList.contains('keyboard__key')) {
    highlightTheKey(event.target.classList[1]);
    performKeyAction(event.target.innerHTML);
    performShift();
  }
});

document.addEventListener('mouseup', () => {
  removeAllHighlight();
});
