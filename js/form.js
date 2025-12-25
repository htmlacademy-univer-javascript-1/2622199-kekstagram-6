import { validateHashtags, getHashtagErrorMessage } from './hashtags.js';
import { isEscapeKey } from './util.js';
import { initImageEditor, resetImageEditor } from './image-editor.js';
import { uploadData } from './fetch.js';
import { showSelectedImage, resetPreview } from './preview.js';

const form = document.querySelector('.img-upload__form');
const fileInput = document.querySelector('.img-upload__input');
const overlay = document.querySelector('.img-upload__overlay');
const cancelButton = document.querySelector('.img-upload__cancel');
const hashtagInput = document.querySelector('.text__hashtags');
const commentInput = document.querySelector('.text__description');
const body = document.body;
const submitButton = document.querySelector('.img-upload__submit');

const MAX_COMMENT_LENGTH = 140;

let hashtagError = '';
let commentError = '';

const validateComment = (value) => value.length <= MAX_COMMENT_LENGTH;

const updateErrorUI = () => {
  const hashtagWrapper = hashtagInput.closest('.img-upload__field-wrapper');
  if (hashtagWrapper) {
    hashtagWrapper.classList.toggle('img-upload__field-wrapper--error', !!hashtagError);

    let errorElement = hashtagWrapper.querySelector('.pristine-error');

    if (hashtagError) {
      errorElement = errorElement || document.createElement('div');
      if (!hashtagWrapper.querySelector('.pristine-error')) {
        errorElement.className = 'pristine-error';
        hashtagWrapper.appendChild(errorElement);
      }
      errorElement.textContent = hashtagError;
    } else if (errorElement) {
      errorElement.remove();
    }
  }

  const commentWrapper = commentInput.closest('.img-upload__field-wrapper');
  if (commentWrapper) {
    commentWrapper.classList.toggle('img-upload__field-wrapper--error', !!commentError);

    let errorElement = commentWrapper.querySelector('.pristine-error');

    if (commentError) {
      errorElement = errorElement || document.createElement('div');
      if (!commentWrapper.querySelector('.pristine-error')) {
        errorElement.className = 'pristine-error';
        commentWrapper.appendChild(errorElement);
      }
      errorElement.textContent = commentError;
    } else if (errorElement) {
      errorElement.remove();
    }
  }
};

const updateSubmitButton = () => {
  const isValid = !hashtagError && !commentError;
  submitButton.disabled = !isValid;
  submitButton.textContent = 'Опубликовать';
};

const updateValidation = () => {
  const hashtagValue = hashtagInput.value;
  hashtagError = validateHashtags(hashtagValue) ? '' : getHashtagErrorMessage(hashtagValue);

  const commentValue = commentInput.value;
  commentError = validateComment(commentValue) ? '' : `Длина комментария не должна превышать ${MAX_COMMENT_LENGTH} символов`;

  updateErrorUI();
  updateSubmitButton();
};

const blockSubmitButton = () => {
  submitButton.disabled = true;
  submitButton.textContent = 'Отправляется...';
};

const unblockSubmitButton = () => {
  updateSubmitButton();
};

const resetForm = () => {
  form.reset();
  resetImageEditor();

  hashtagInput.disabled = false;
  commentInput.disabled = false;

  unblockSubmitButton();
  resetPreview();

  hashtagError = '';
  commentError = '';
  updateErrorUI();
  updateSubmitButton();
};

function closeImageEditor() {
  overlay.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onFormEscKeydown);
  resetForm();
}

function openImageEditor() {
  unblockSubmitButton();

  overlay.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onFormEscKeydown);

  initImageEditor();
  updateSubmitButton();
}

function onFormEscKeydown(evt) {
  if (isEscapeKey(evt)) {
    if (document.activeElement === hashtagInput || document.activeElement === commentInput) {
      return;
    }
    evt.preventDefault();
    closeImageEditor();
  }
}

const onFileInputChange = () => {
  const file = fileInput.files[0];
  if (!file) {
    return;
  }

  if (showSelectedImage(file)) {
    openImageEditor();
  } else {
    fileInput.value = '';
  }
};

const showSuccessMessage = () => {
  const template = document.querySelector('#success').content.cloneNode(true);
  const message = template.querySelector('.success');
  message.style.zIndex = '10000';
  document.body.appendChild(message);

  const close = () => {
    message.remove();
    // eslint-disable-next-line no-use-before-define
    document.removeEventListener('keydown', onEsc);
    document.addEventListener('keydown', onFormEscKeydown);
  };

  const onEsc = (evt) => {
    if (isEscapeKey(evt)) {
      close();
    }
  };

  message.addEventListener('click', (evt) => {
    if (!evt.target.closest('.success__inner')) {
      close();
    }
  });

  message.querySelector('.success__button').addEventListener('click', close);
  document.removeEventListener('keydown', onFormEscKeydown);
  document.addEventListener('keydown', onEsc);
};

const showErrorMessage = () => {
  const template = document.querySelector('#error').content.cloneNode(true);
  const message = template.querySelector('.error');
  message.style.zIndex = '10000';
  document.body.appendChild(message);

  const close = () => {
    message.remove();
    // eslint-disable-next-line no-use-before-define
    document.removeEventListener('keydown', onEsc);
    document.addEventListener('keydown', onFormEscKeydown);
  };

  const onEsc = (evt) => {
    if (isEscapeKey(evt)) {
      close();
    }
  };

  message.addEventListener('click', (evt) => {
    if (!evt.target.closest('.error__inner')) {
      close();
    }
  });

  message.querySelector('.error__button').addEventListener('click', close);
  document.removeEventListener('keydown', onFormEscKeydown);
  document.addEventListener('keydown', onEsc);
};

const onFormSuccess = () => {
  closeImageEditor();
  showSuccessMessage();
};

const onFormError = () => {
  unblockSubmitButton();
  showErrorMessage();
};

const onFormSubmit = (evt) => {
  evt.preventDefault();

  updateValidation();

  if (hashtagError || commentError) {
    updateErrorUI();
  } else {
    blockSubmitButton();
    uploadData(onFormSuccess, onFormError, 'POST', new FormData(form));
  }
};

hashtagInput.addEventListener('input', () => {
  updateValidation();
});

commentInput.addEventListener('input', () => {
  updateValidation();
});

fileInput.addEventListener('change', onFileInputChange);
cancelButton.addEventListener('click', closeImageEditor);
form.addEventListener('submit', onFormSubmit);

hashtagInput.addEventListener('keydown', (evt) => {
  if (isEscapeKey(evt)) {
    evt.stopPropagation();
  }
});

commentInput.addEventListener('keydown', (evt) => {
  if (isEscapeKey(evt)) {
    evt.stopPropagation();
  }
});

export { closeImageEditor, resetForm };
