import { MESSAGES, NAMES } from './data.js';

const getRandomInteger = (min, max) => {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

const createIdGenerator = () => {
  let lastGeneratedId = 0;
  return () => {
    lastGeneratedId += 1;
    return lastGeneratedId;
  };
};

const createComment = () => {
  const generateCommentId = createIdGenerator();
  const messageCount = getRandomInteger(1, 2);
  let message = '';
  for (let i = 0; i < messageCount; i++) {
    message += getRandomArrayElement(MESSAGES);
    if (i < messageCount - 1) {
      message += ' ';
    }
  }
  return {
    id: generateCommentId(),
    avatar: `img/avatar-${getRandomInteger(1, 6)}.svg`,
    message: message,
    name: getRandomArrayElement(NAMES)
  };
};

export { getRandomInteger, getRandomArrayElement, createIdGenerator, createComment };

