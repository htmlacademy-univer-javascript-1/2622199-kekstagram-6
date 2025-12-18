const BASE_URL = 'https://31.javascript.htmlacademy.pro/kekstagram';

const Route = {
  GET_DATA: '/data',
  SEND_DATA: '/',
};

const Method = {
  GET: 'GET',
  POST: 'POST',
};

const ErrorText = {
  GET_DATA: 'Не удалось загрузить данные. Попробуйте обновить страницу',
  SEND_DATA: 'Не удалось отправить форму. Попробуйте ещё раз',
};

/**
 * Функция для выполнения запроса к серверу
 * @param {string} route - путь запроса
 * @param {string} method - метод запроса
 * @param {FormData} [body] - тело запроса (опционально)
 * @returns {Promise<any>}
 */
const load = async (route, method = Method.GET, body = null) => {
  const url = `${BASE_URL}${route}`;
  const response = await fetch(url, { method, body });

  if (!response.ok) {
    throw new Error(ErrorText[method === Method.GET ? 'GET_DATA' : 'SEND_DATA']);
  }

  return response.json();
};

/**
 * Загружает данные фотографий с сервера
 * @returns {Promise<Array>} - массив объектов фотографий
 */
const getData = async () => {
  try {
    return await load(Route.GET_DATA);
  } catch (error) {
    throw new Error(ErrorText.GET_DATA);
  }
};

/**
 * Отправляет данные формы на сервер
 * @param {FormData} body - данные формы
 * @returns {Promise<any>}
 */
const sendData = async (body) => {
  try {
    return await load(Route.SEND_DATA, Method.POST, body);
  } catch (error) {
    throw new Error(ErrorText.SEND_DATA);
  }
};

export { getData, sendData };
