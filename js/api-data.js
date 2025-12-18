import { getData } from './api.js';

let photos = [];

/**
 * Загружает фотографии с сервера
 * @returns {Promise<Array>}
 */
const loadPhotos = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    photos = await getData();
    return photos;
  } catch (error) {
    throw error;
  }
};

/**
 * Возвращает все фотографии
 * @returns {Array}
 */
const getPhotos = () => photos;

/**
 * Возвращает случайные фотографии
 * @param {number} count - количество фотографий
 * @returns {Array}
 */
const getRandomPhotos = (count = 10) => {
  const shuffled = [...photos].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

/**
 * Возвращает самые обсуждаемые фотографии
 * @returns {Array}
 */
const getDiscussedPhotos = () => [...photos].sort((a, b) => b.comments.length - a.comments.length);

export { loadPhotos, getPhotos, getRandomPhotos, getDiscussedPhotos };
