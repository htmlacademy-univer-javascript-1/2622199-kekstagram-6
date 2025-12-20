/**
 * Показывает сообщение пользователю
 * @param {string} message - текст сообщения
 * @param {string} type - тип сообщения (success, error)
 * @param {number} duration - продолжительность показа (мс)
 */
const showAlert = (message, type = 'error', duration = 5000) => {
  const alertContainer = document.createElement('div');
  alertContainer.style.zIndex = '1000';
  alertContainer.style.position = 'fixed';
  alertContainer.style.left = '0';
  alertContainer.style.top = '0';
  alertContainer.style.right = '0';
  alertContainer.style.padding = '15px 10px';
  alertContainer.style.fontSize = '16px';
  alertContainer.style.textAlign = 'center';
  alertContainer.style.backgroundColor = type === 'error' ? '#ff4d4d' : '#4caf50';
  alertContainer.style.color = '#ffffff';
  alertContainer.style.fontWeight = 'bold';
  alertContainer.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
  alertContainer.textContent = message;
  document.body.appendChild(alertContainer);

  if (duration > 0) {
    setTimeout(() => {
      if (alertContainer.parentNode) {
        alertContainer.remove();
      }
    }, duration);
  }
};

export { showAlert };
