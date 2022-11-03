import React from 'react';
import {View, Text} from 'react-native';

export const transliterate = (() => {
  const scheme = {"Ё":"YO","Й":"I","Ц":"TS","У":"U","К":"K","Е":"E","Н":"N","Г":"G","Ш":"SH","Щ":"SCH","З":"Z","Х":"H","Ъ":"'","ё":"yo","й":"i","ц":"ts","у":"u","к":"k","е":"e","н":"n","г":"g","ш":"sh","щ":"sch","з":"z","х":"h","ъ":"'","Ф":"F","Ы":"I","В":"V","А":"a","П":"P","Р":"R","О":"O","Л":"L","Д":"D","Ж":"ZH","Э":"E","ф":"f","ы":"i","в":"v","а":"a","п":"p","р":"r","о":"o","л":"l","д":"d","ж":"zh","э":"e","Я":"Ya","Ч":"CH","С":"S","М":"M","И":"I","Т":"T","Ь":"'","Б":"B","Ю":"YU","я":"ya","ч":"ch","с":"s","м":"m","и":"i","т":"t","ь":"'","б":"b","ю":"yu"}
  const letterTransform = (letter) => scheme[letter] ? scheme[letter] : (/[a-zA-Z0-9\-=\.]/.test(letter) ? letter : '');

  return (text) => text.split('').map(letterTransform).join('');
})();

export const getRandomFileName = () => {
  const letters = 'abcdefghijklmnopstuvwyz'.split('');
  const lettersCount = letters.length;
  const randomFileNameLetters = [];

  for (let i = 0, size = Math.random() * 10 + 5; i < size; ++i) {
    randomFileNameLetters.push(letters[Math.floor(Math.random() * lettersCount)]);
  }

  return randomFileNameLetters.join('');
};

export const getFileExtension = (file) => {
  const parts = file.split('.');

  return parts.length > 1 ? parts[parts.length - 1] : '';
};

export const parseMoney = function (number = 0, cur = '', beautify = false, n = 2, x = 3, s = ' ', c = '.') {
  const re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')';
  let num = Number(number).toFixed(Math.max(0, ~~n));

  const pennies = num.toString().split('.')[1];

  let currency = cur || 'RUB';
  switch (cur) {
    case 'RUB':
    case 'RUR':
      currency = '₽';
      break;
    case 'USD':
      currency = '$';
      break;
    case 'EUR':
      currency = '€';
      break;
    case 'GBP':
      currency = '£';
      break;
    case 'CHF':
      currency = '₣';
      break;
    default:
      currency = cur;
      break;
  }


  if (beautify) {
    let numBeauti = (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ',')).split('.')[0];


    return [
      <Text>
        {numBeauti}
      </Text>,

      !!n ?
        <View style={{alignItems: 'flex-start', paddingBottom: 2}}>
          <Text style={{fontSize: 12}}>
            .{pennies}
          </Text>
        </View>
        : null,

      <Text>
        {` ${currency}`}
      </Text>
    ]
  }

  return `${(c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','))} ${currency}`;
  /*return (
    <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
      <Text style={{fontSize: 18}}>
        {(c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','))}
      </Text>

      <Text style={{fontSize: 12, color: '#777', marginLeft: 3, marginBottom: 2}}>
        .{pennies}
      </Text>
      <Text style={{fontSize: 18}}>
        {currency}
      </Text>
    </View>
  );*/
};
