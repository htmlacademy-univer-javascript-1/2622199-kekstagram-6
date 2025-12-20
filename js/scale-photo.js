const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;
const SCALE_DEFAULT = 55;

let currentScale = SCALE_DEFAULT;
let isSliderInitialized = false;
let currentEffect = 'none';

const domElements = {
  imagePreview: null,
  scaleValueInput: null,
  effectLevelInput: null,
  effectSliderContainer: null,
  effectRadios: null,
  effectLevelElement: null,
  scaleSmallerBtn: null,
  scaleBiggerBtn: null
};

function initDOMElements() {
  domElements.imagePreview = document.querySelector('.img-upload__preview img');
  domElements.scaleValueInput = document.querySelector('.scale__control--value');
  domElements.effectLevelInput = document.querySelector('.effect-level__value');
  domElements.effectSliderContainer = document.querySelector('.effect-level__slider');
  domElements.effectRadios = document.querySelectorAll('input[name="effect"]');
  domElements.effectLevelElement = document.querySelector('.effect-level');
  domElements.scaleSmallerBtn = document.querySelector('.scale__control--smaller');
  domElements.scaleBiggerBtn = document.querySelector('.scale__control--bigger');
}

function initEffectSlider() {
  // Проверяем, подключена ли библиотека
  if (typeof noUiSlider === 'undefined') {
    // eslint-disable-next-line no-console
    console.error('Библиотека noUiSlider не найдена. Убедитесь, что она подключена в HTML.');
    return;
  }
  if (!domElements.effectSliderContainer) {
    // eslint-disable-next-line no-console
    console.warn('Элемент слайдера не найден');
    return;
  }
  if (isSliderInitialized) {
    return;
  }
  try {
    // Уничтожаем предыдущий слайдер, если есть
    if (domElements.effectSliderContainer.noUiSlider) {
      domElements.effectSliderContainer.noUiSlider.destroy();
    }
    noUiSlider.create(domElements.effectSliderContainer, {
      start: [100],
      connect: 'lower',
      range: {
        min: 0,
        max: 100
      },
      step: 1,
      format: {
        to: function(value) {
          return Math.round(value);
        },
        from: function(value) {
          return parseFloat(value);
        }
      }
    });
    isSliderInitialized = true;
    domElements.effectSliderContainer.noUiSlider.on('update', (values) => {
      const level = Math.round(values[0]);
      if (domElements.effectLevelInput) {
        domElements.effectLevelInput.value = level;
      }
      applyEffect(currentEffect, level);
    });
    // eslint-disable-next-line no-console
    console.log('Слайдер эффектов успешно инициализирован');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Ошибка при создании слайдера:', error);
  }
}

function updateScaleValue() {
  if (domElements.scaleValueInput) {
    domElements.scaleValueInput.value = `${currentScale}%`;
  }
  if (domElements.imagePreview) {
    domElements.imagePreview.style.transform = `scale(${currentScale / 100})`;
  }
}

function scaleDown() {
  if (currentScale > SCALE_MIN) {
    currentScale -= SCALE_STEP;
    updateScaleValue();
  }
}

function scaleUp() {
  if (currentScale < SCALE_MAX) {
    currentScale += SCALE_STEP;
    updateScaleValue();
  }
}

function resetScale() {
  currentScale = SCALE_DEFAULT;
  updateScaleValue();
}

function applyEffect(effectName, level = 100) {
  if (!domElements.imagePreview) {
    return;
  }
  currentEffect = effectName;
  let filterValue = 'none';
  switch(effectName) {
    case 'chrome':
      filterValue = `grayscale(${level / 100})`;
      break;
    case 'sepia':
      filterValue = `sepia(${level / 100})`;
      break;
    case 'marvin':
      filterValue = `invert(${level}%)`;
      break;
    case 'phobos':
      filterValue = `blur(${(level / 100) * 3}px)`;
      break;
    case 'heat':
      filterValue = `brightness(${1 + (level / 100) * 2})`;
      break;
  }
  domElements.imagePreview.style.filter = filterValue;
}

function onEffectChange(event) {
  const selectedEffect = event.target.value;
  if (selectedEffect === 'none') {
    // Скрываем слайдер
    if (domElements.effectLevelElement) {
      domElements.effectLevelElement.classList.add('hidden');
    }
    // Сбрасываем эффект
    applyEffect('none', 100);
  } else {
    // Показываем слайдер
    if (domElements.effectLevelElement) {
      domElements.effectLevelElement.classList.remove('hidden');
    }
    // Инициализируем слайдер если нужно
    initEffectSlider();
    // Устанавливаем слайдер на максимум
    if (isSliderInitialized && domElements.effectSliderContainer.noUiSlider) {
      domElements.effectSliderContainer.noUiSlider.set(100);
    }
    // Применяем эффект
    applyEffect(selectedEffect, 100);
  }
}

function initEventHandlers() {
  // Кнопки масштаба
  if (domElements.scaleSmallerBtn) {
    domElements.scaleSmallerBtn.addEventListener('click', scaleDown);
  }
  if (domElements.scaleBiggerBtn) {
    domElements.scaleBiggerBtn.addEventListener('click', scaleUp);
  }  // Радиокнопки эффектов
  if (domElements.effectRadios && domElements.effectRadios.length > 0) {
    domElements.effectRadios.forEach((radio) => {
      radio.addEventListener('change', onEffectChange);
    });
  }
}

function resetEditor() {
  // Сбрасываем масштаб
  resetScale();
  // Сбрасываем эффект
  currentEffect = 'none';
  // Скрываем слайдер
  if (domElements.effectLevelElement) {
    domElements.effectLevelElement.classList.add('hidden');
  }
  // Сбрасываем фильтр изображения
  if (domElements.imagePreview) {
    domElements.imagePreview.style.filter = 'none';
  }
  // Устанавливаем радио "none"
  const noneRadio = document.querySelector('#effect-none');
  if (noneRadio) {
    noneRadio.checked = true;
  }
}

function initScaleEditor() {
  initDOMElements();
  if (!domElements.imagePreview) {
    // eslint-disable-next-line no-console
    console.error('Не найден элемент изображения для превью');
    return;
  }
  // Инициализируем масштаб
  updateScaleValue();
  // Инициализируем обработчики
  initEventHandlers();
  // Сбрасываем состояние
  resetEditor();
}

export {
  initScaleEditor,
  scaleDown,
  scaleUp,
  resetScale,
  applyEffect,
  resetEditor
};
