const { createWorker } = require('tesseract.js');
const fs = require('node:fs')
// import { createWorker } from 'tesseract.js';

// cria um worker do Tesseract.js
const worker = createWorker({
  logger: m => console.log(m),
});

// configura o caminho da imagem do captcha e a linguagem a ser usada
const captchaImage = fs.readFileSync('./captcha.png');
// const language = 'eng';

async function decodeCaptcha(language) {
  // carrega a imagem do captcha e reconhece o texto usando o Tesseract OCR
  // await worker.load();
  // await worker.loadLanguage(language);
  // await worker.initialize(language);
  const { data: { text } } = await worker.recognize(captchaImage);
  console.log('Texto do captcha:', text);
  await multipleTimes(worker)
  // await worker.terminate();
  return text;
}


// carrega a imagem do captcha e reconhece o texto usando o Tesseract OCR
// (async () => {
//   console.log('Iniciando')
//   await worker.load();
//   await worker.loadLanguage(language);
//   await worker.initialize(language);
//   // const { data: { text } } = await worker.recognize('https://nfse.pmcg.ms.gov.br/NotaFiscal/imagens/gd.php?gd_code=?ZmdzQg==');
//   const { data: { text } } = await worker.recognize(captchaImage);
//   console.log('Texto do captcha:', text);
//   await multipleTimes()
//   await worker.terminate();
// })();


const result = {}

async function multipleTimes(worker) {
  for  (let i = 0; i < 25; i++) {
    console.log(i)
    const { data: { text } } = await worker.recognize(captchaImage);
    console.log(`Texto do captcha(${i}): ${text}`);
    result[text] = result[text] ? result[text] + 1 : 1
  }
  console.log(result)
}

// export const solveCaptcha = async (captchaImage: string) => {
//   const worker = createWorker({
//     logger: m => console.log(m),
//   });
//   const language = 'eng';
//   await worker.load();
//   await worker.loadLanguage(language);
//   await worker.initialize(language);
//   const { data: { text } } = await worker.recognize(`../../${captchaImage}`);
//   console.log('Texto do captcha:', text);
//   await worker.terminate();
//   return text;
// }


// async function* asyncGenerator() {
//   for (let i = 0; i < languages.length; i++) {
//     console.log(languages[i])
//     yield languages[i]
//   }
// }

// (async function() {
//   for await (const l of asyncGenerator) {
//     await decodeCaptcha(l)

// }})()

const languages = ['eng', 'por', 'swe'];

async function* asyncGenerator() {
  for (let i = 0; i < languages.length; i++) {
    console.log(languages[i]);
    yield languages[i];
  }
}

(async function() {
  const generator = asyncGenerator();
  for await (const l of generator) {
    console.log("Language: ", l)
    await worker.load();
    await worker.loadLanguage(l);
    await worker.initialize(l);
  
    await decodeCaptcha(worker)
    console.log("Language: ", l)
    console.log(result)
    await worker.terminate()
    }
  
  console.log(result)

})();

