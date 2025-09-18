function lengthString(checkedString, maxLength) {
  if (checkedString.length <= maxLength) {
    return true;
  }
  else {
    return false;
  }
}

lengthString('Строка', 20);

function palindrome(word) {
  const normalWorld = word.replaceAll(' ', '').toLowerCase();
  let cleanString = '';
  for (let i = normalWorld.length - 1; i >= 0; i--) {
    const char = normalWorld[i];
    cleanString += char;
  }
  return normalWorld === cleanString;
}


palindrome('топот');
