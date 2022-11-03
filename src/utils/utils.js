export function checkPassword(password) {
  const s_letters = /[a-z]/; // Буквы в нижнем регистре
  const b_letters = /[A-Z]/; // Буквы в верхнем регистре
  const digits = /[0-9]/; // Цифры
  const specials = /[!@#\$%\^\&*\)\(+=._-{}?,\]\[]/; // Спецсимволы
  const s_russian = /[А-Я]/;
  const b_russian = /[а-я]/;

  let is_s = s_letters.test(password);
  let is_b = b_letters.test(password);
  let is_d = digits.test(password);
  let is_sp = specials.test(password);
  let is_rs= s_russian.test(password);
  let is_rb = b_russian.test(password);

  let rating = 0;
  let text = "Простой";

  if (is_s) rating++;
  if (is_b) rating++;
  if (is_d) rating++;
  if (is_sp) rating++;
  if (is_rs) rating++;
  if (is_rb) rating++;

  if (password.length < 6 || (password.length < 8 && rating < 3)) text = "Простой";
  else if (password.length < 8 && rating >= 3) text = "Средний";
  else if (password.length >= 8 && rating < 3) text = "Средний";
  else if (password.length >= 8 && rating >= 3) text = "Надежный";
  else if (password.length >= 8 && rating == 1) text = "Простой";
  else if (password.length >= 8 && rating > 1 && rating < 4) text = "Средний";

  return text;
}

export function isValidURL(string = '') {
  const pattern = new RegExp('^(http(s)?:\\/\\/)' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(string);
}


