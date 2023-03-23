const { createWorker } = require('tesseract.js');
const fs = require('fs');

// cria um worker do Tesseract.js


// configura o caminho da imagem do captcha e a linguagem a ser usada
const captchaImage = fs.readFileSync('./captcha.png');

async function decodeCaptcha(worker, language) {
  const { data: { text } } = await worker.recognize(captchaImage);
  console.log('Texto do captcha:', text);
  await multipleTimes(worker);

  return text;
}

const result = {};

async function multipleTimes(worker) {
  for  (let i = 0; i < 25; i++) {
    console.log(i);
    const { data: { text } } = await worker.recognize(captchaImage);
    console.log(`Texto do captcha(${i+1}): ${text}`);
    result[text] = result[text] ? result[text] + 1 : 1;
  }
  console.log(result);
}

// const languages = ['eng', 'por', 'swe', "afr","amh","ara","asm","aze","aze_cyrl","bel","ben","bod","bos","bre","bul","cat","ceb"];
const languages = ['eng', 'por', 'lat'];

async function* asyncGenerator() {
  for (let i = 0; i < languages.length; i++) {
    console.log(languages[i]);
    yield languages[i];
  }
}

(async function() {
  const generator = asyncGenerator();
  const now = new Date();
  for await (const l of generator) {
    console.log("Iniciando análise da Linguagem: ", l);
    const worker = createWorker({
      logger: m => console.log(m),
    });
    await worker.load();
    await worker.loadLanguage(l);
    await worker.initialize(l);

    await decodeCaptcha(worker, l);
    // console.log("Language: ", l);
    // console.log(result);
    await worker.terminate();
  }
  console.log("The result should be: 'aowD'");
  console.log(result);

  const ms = new Date() - now,
  min = Math.floor((ms/1000/60) << 0).toString().padStart(2, '0'),
  sec = Math.floor((ms/1000) % 60).toString().padStart(2, '0'),
  msec = ms % 1000;

  console.log("Tempo total: " + min + ':' + sec + ':' + msec + 'ms');
})();



