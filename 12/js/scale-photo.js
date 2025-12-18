const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;
const SCALE_DEFAULT = 55;

let currentScale = SCALE_DEFAULT;
let isSliderInitialized = false;

let uploadOverlay;
let imagePreview;
let scaleValueInput;
let effectLevelInput;
let effectSliderContainer;
let effectRadios;

function initDOMElements() {
  uploadOverlay = document.querySelector('.img-upload__overlay');
  imagePreview = document.querySelector('.img-upload__preview img');
  scaleValueInput = document.querySelector('.scale__control--value');
  effectLevelInput = document.querySelector('.effect-level__value');
  effectSliderContainer = document.querySelector('.effect-level__slider');
  effectRadios = document.querySelectorAll('input[name="effect"]');
}

function initEffectSlider() {
  if (!effectSliderContainer || isSliderInitialized) {
    return;
  }

  noUiSlider.create(effectSliderContainer, {
    start: [100],
    connect: 'lower',
    range: {
      'min': 0,
      'max': 100
    },
    step: 1,
    format: {
      to: function(value) {
        return Math.round(value);
      },
      from: function(value) {
        return Number(value);
      }
    }
  });

  isSliderInitialized = true;

  effectSliderContainer.noUiSlider.on('update', (values) => {
    const value = Math.round(values[0]);
    updateEffectLevel(value);
  });
}

function resetEffectSlider() {
  if (!effectSliderContainer || !isSliderInitialized) {
    return;
  }

  effectSliderContainer.closest('.effect-level').classList.add('hidden');
  effectSliderContainer.noUiSlider.set(100);
  if (effectLevelInput) {
    effectLevelInput.value = '';
  }
}

function updateEffectLevel(value) {
  if (!effectLevelInput || !imagePreview) {
    return;
  }

  effectLevelInput.value = value;

  const selectedEffect = document.querySelector('input[name="effect"]:checked').value;
  applyEffect(selectedEffect, value);
}

function applyEffect(effectName, level = 100) {
  if (!imagePreview) {
    return;
  }

  imagePreview.style.filter = '';

  switch(effectName) {
    case 'chrome':
      imagePreview.style.filter = `grayscale(${level / 100})`;
      break;
    case 'sepia':
      imagePreview.style.filter = `sepia(${level / 100})`;
      break;
    case 'marvin':
      imagePreview.style.filter = `invert(${level}%)`;
      break;
    case 'phobos':
      // eslint-disable-next-line no-case-declarations
      const blurValue = (level / 100) * 3;
      imagePreview.style.filter = `blur(${blurValue}px)`;
      break;
    case 'heat':
      // eslint-disable-next-line no-case-declarations
      const brightnessValue = 1 + (level / 100) * 2;
      imagePreview.style.filter = `brightness(${brightnessValue})`;
      break;
    case 'none':
    default:
      imagePreview.style.filter = 'none';
      break;
  }
}

function updateScaleValue() {
  if (scaleValueInput) {
    scaleValueInput.value = `${currentScale}%`;
  }

  if (imagePreview) {
    imagePreview.style.transform = `scale(${currentScale / 100})`;
  }
}

function scaleDown() {
  currentScale = Math.max(currentScale - SCALE_STEP, SCALE_MIN);
  updateScaleValue();
}

function scaleUp() {
  currentScale = Math.min(currentScale + SCALE_STEP, SCALE_MAX);
  updateScaleValue();
}

function resetScale() {
  currentScale = SCALE_DEFAULT;
  updateScaleValue();
}

function initEventHandlers() {
  const scaleSmallerBtn = document.querySelector('.scale__control--smaller');
  const scaleBiggerBtn = document.querySelector('.scale__control--bigger');

  if (scaleSmallerBtn) {
    scaleSmallerBtn.addEventListener('click', scaleDown);
  }

  if (scaleBiggerBtn) {
    scaleBiggerBtn.addEventListener('click', scaleUp);
  }

  effectRadios.forEach((radio) => {
    radio.addEventListener('change', function() {
      resetScale();
      resetEffectSlider();

      if (this.value !== 'none') {
        const effectSlider = effectSliderContainer.closest('.effect-level');
        if (effectSlider) {
          effectSlider.classList.remove('hidden');
        }

        if (!isSliderInitialized) {
          initEffectSlider();
        }

        effectSliderContainer.noUiSlider.set(100);
        updateEffectLevel(100);
      } else {
        applyEffect('none');
      }
    });
  });

  const uploadFileInput = document.getElementById('upload-file');
  if (uploadFileInput) {
    uploadFileInput.addEventListener('change', function() {
      if (uploadOverlay) {
        uploadOverlay.classList.remove('hidden');
      }

      resetScale();
      resetEffectSlider();

      const noneEffectRadio = document.getElementById('effect-none');
      if (noneEffectRadio) {
        noneEffectRadio.checked = true;
        applyEffect('none');
      }

      if (this.files && this.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
          if (imagePreview) {
            imagePreview.src = e.target.result;
          }
        };
        reader.readAsDataURL(this.files[0]);
      }
    });
  }

  const cancelBtn = document.getElementById('upload-cancel');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      if (uploadOverlay) {
        uploadOverlay.classList.add('hidden');
      }

      const uploadForm = document.getElementById('upload-select-image');
      if (uploadForm) {
        uploadForm.reset();
      }

      resetScale();
      resetEffectSlider();

      if (imagePreview) {
        imagePreview.src = 'img/upload-default-image.jpg';
        imagePreview.style.filter = '';
        imagePreview.style.transform = '';
      }
    });
  }
}

// Основная функция инициализации
export function initScaleEditor() {
  initDOMElements();
  updateScaleValue();
  resetEffectSlider();
  initEventHandlers();
}

// Экспорт функций для внешнего использования
export {
  scaleDown,
  scaleUp,
  resetScale,
  applyEffect,
  updateEffectLevel
};
