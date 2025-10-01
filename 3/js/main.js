function randomInteger(min, max) {

  const lower = Math.ceil(Math.min(min, max));

  const upper = Math.floor(Math.max(min, max));

  return Math.floor(lower + Math.random() * (upper - lower - 1));
}

function randomElement(elements) {
  return elements[randomInteger(0, elements.length - 1)];
}

function idGeneration() {
  let lastGeneratedId = 0;
  return function() {
    lastGeneratedId += 1;
    return lastGeneratedId;
  };
}

const generateCommentId = idGeneration();

const names = ['Артем', 'Роман', 'Мария', 'Дмитрий', 'София', 'Иван', 'Анна', 'Кирилл', 'Ольга', 'Алексей', 'Екатерина'];

const message = ['Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];

const description = ['Все чики-пуки!',
  'В екате сегодня гололёд(',
  'По секрету всему свету',
  'В кругосветку!'];

function createComments() {
  return {
    id: generateCommentId,
    avatar: 'img/avatar-' + randomInteger(1, 6) + '.svg',
    message: Array.from({ length: randomInteger(1, 2) }, function() {return randomElement(message); }).join(' '),
    name: randomElement(names)
  };
}

function createPhoto(index) {
  return {
    id: index + 1,
    url: 'photos/' + (index + 1) + '.jpg',
    description: randomElement(description),
    likes: randomInteger(15, 200),
    comments: Array.from({ length: randomInteger(0, 30) }, createComments)
  };
}

function generatePhotosArray() {
  return Array.from({ length: 25 }, function(_, index) { return createPhoto(index); });
}

const photos = generatePhotosArray();
