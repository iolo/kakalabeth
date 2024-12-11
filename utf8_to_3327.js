const KR_MODE = '\x0b'; // ^K
const EN_MODE = '\x01'; // ^A
const KR_MODE_CODE = 0x0b; // ^K
const EN_MODE_CODE = 0x01; // ^A
const CHO_TO_33237 = [
  'R', //ㄱ
  '-', //ㄲ
  'S', //ㄴ
  'E', //ㄷ
  '=', //ㄸ
  'F', //ㄹ
  'A', //ㅁ
  'Q', //ㅂ
  '*', //ㅃ
  'T', //ㅅ
  '<', //ㅆ
  'D', //ㅇ
  'W', //ㅈ
  '>', //ㅉ
  'C', //ㅊ
  'Z', //ㅋ
  'X', //ㅌ
  'V', //ㅍ
  'G', //ㅎ
];
const JUNG_TO_3327 = [
  'K', //ㅏ
  'O', //ㅐ
  'I', //ㅑ
  ';', //ㅒ
  'J', //ㅓ
  'P', //ㅔ
  'U', //ㅕ
  '+', //ㅖ
  'H', //ㅗ
  'HK', //ㅘ
  'HO', //ㅙ
  'HL', //ㅚ
  'Y', //ㅛ
  'N', //ㅜ
  'NJ', //ㅝ
  'NP', //ㅞ
  'NL', //ㅟ
  'B', //ㅠ
  'M', //ㅡ
  'ML', //ㅢ
  'L', //ㅣ
];
const JONG_TO_3327 = [
  '', // fill
  'R', //ㄱ
  '-', //ㄲ
  'RT', //ㄳ
  'S', //ㄴ
  'SW', //ㄵ
  'SG', //ㄶ
  'E', //ㄷ
  'F', //ㄹ
  'FR', //ㄺ
  'FA', //ㄻ
  'FQ', //ㄼ
  'FT', //ㄽ
  'FX', //ㄾ
  'FV', //ㄿ
  'FG', //ㅀ
  'A', //ㅁ
  'Q', //ㅂ
  'QT', //ㅄ
  'T', //ㅅ
  '<', //ㅆ
  'D', //ㅇ
  'W', //ㅈ
  'C', //ㅊ
  'Z', //ㅋ
  'X', //ㅌ
  'V', //ㅍ
  'G', //ㅎ
];

const KO_BEGIN = 0xac00;
const KO_END = 0xd7a3;
const CHO_BEGIN = 0x1100;
const JUNG_BEGIN = 0x1161;
const JONG_BEGIN = 0x11a7;

const NUM_CHO = 19;
const NUM_JUNG = 21;
const NUM_JONG = 28;

// split unicode hangul syllable(code) to hangul jamo(index)
function splitHangul(code) {
  const jong = (code - KO_BEGIN) % NUM_JONG;
  const jung = ((code - KO_BEGIN - jong) / NUM_JONG) % NUM_JUNG;
  const cho = ((code - KO_BEGIN - jong) / NUM_JONG - jung) / NUM_JUNG;
  return [cho, jung, jong];
}

// merge hangul jamo(index) to unicode hangul syllable(code)
function mergeHangul(cho, jung, jong = 0) {
  return KO_BEGIN + cho * NUM_JUNG * NUM_JONG + jung * NUM_JONG + jong;
}

function isHangul(code) {
  return code >= KO_BEGIN && code <= KO_END;
}

function isValidInEitherMode(code) {
  return code === 0x20 || (code >= 0x30 && code <= 0x39);
}

// convert utf8 string to 3327 string
function to3327(str) {
  const result = [];
  let krMode = false;
  for (let i = 0, len = str.length; i < len; i += 1) {
    const code = str.charCodeAt(i);
    if (isHangul(code)) {
      if (!krMode) {
        result.push(KR_MODE);
        krMode = true;
      }
      const [cho, jung, jong] = splitHangul(code);
      result.push(CHO_TO_33237[cho]);
      result.push(JUNG_TO_3327[jung]);
      if (jong) {
        result.push(JONG_TO_3327[jong]);
      }
    } else if (isValidInEitherMode(code)) {
      result.push(String.fromCharCode(code));
    } else {
      if (krMode) {
        result.push(EN_MODE);
        krMode = false;
      }
      result.push(String.fromCharCode(code));
    }
  }
  if (krMode) {
    result.push(EN_MODE);
  }
  return result.join('');
}

// TODO: convert 3327 string to utf8 string
function from3327(str) {
  const result = [];
  const hangul = [];
  let krMode = false;
  let krState = 0;
  for (let i = 0, len = str.length; i < len; i += 1) {
    const code = str.charCodeAt(i);
    if (code === KR_MODE_CODE) {
      krMode = true;
    } else if (code === EN_MODE_CODE) {
      krMode = false;
    } else if (krMode) {
      // TODO: hangul automata
      // ㅎ
      // ㅎ+ㅎ -> (ㅎ)+ㅎ
      // ㅎ+ㅏ
      // ㅎ+ㅏ+ㄴ
      // ㅎ+ㅏ+ㄴ+ㄱ -> (한)+ㄱ
      // ㅎ+ㅏ+ㄹ+ㄱ
      // ㅎ+ㅏ+ㄹ+ㄱ+ㄱ -> (핡)+ㄱ
      // ㅎ+ㅏ+ㄹ+ㄱ+ㅏ -> (할)+ㄱ+ㅏ
      // ㅎ+ㅏ+ㄴ+ㅏ -> (하)+ㄴ+ㅏ
      // ㅎ+ㅗ+ㅏ
      // ㅎ+ㅗ+ㅏ+ㄱ
      // ㅎ+ㅗ+ㅏ+ㄱ+ㄱ -> (확)+ㄱ
      // ㅎ+ㅗ+ㅏ+ㄹ+ㄱ
      // ㅎ+ㅗ+ㅏ+ㄹ+ㄱ+ㄱ -> (홝)+ㄱ
      // ㅎ+ㅗ+ㅏ+ㄹ+ㄱ+ㅏ -> (활)+ㄱ+ㅏ
      // ㅎ+ㅗ+ㅏ+ㄱ+ㅏ -> (화)+ㄱ+ㅏ
      // ㅏ -> (ㅏ)
      // if (isConsonant(code)) {
      // } else if (isVowel(code)) {
      // } else {
      // }
      result.push(String.fromCharCode(code));
    } else {
      result.push(String.fromCharCode(code));
    }
  }
}

//console.log(to3327('한글은 아름답다 ABC 그러나 123 골치아프다'));

// when invoked with nodejs cli:
// ex. $ node utf8_to_3327.js < input.txt > output.txt
if (require?.main === module) {
  process.stdout.write(to3327(require('fs').readFileSync(process.stdin.fd, 'utf-8')));
}
