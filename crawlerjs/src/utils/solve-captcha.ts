// const { createWorker } = require('tesseract.js');
import { createWorker } from 'tesseract.js';

// cria um worker do Tesseract.js
// const worker = createWorker({
//   logger: m => console.log(m),
// });

// configura o caminho da imagem do captcha e a linguagem a ser usada
// const captchaImage = 'captcha.png';
// const language = 'eng';

// carrega a imagem do captcha e reconhece o texto usando o Tesseract OCR
// (async () => {
//   await worker.load();
//   await worker.loadLanguage(language);
//   await worker.initialize(language);
//   const { data: { text } } = await worker.recognize(captchaImage);
//   console.log('Texto do captcha:', text);
//   await worker.terminate();
// })();


const worker = createWorker({
  workerPath: 'https://unpkg.com/tesseract.js@v2.0.0/dist/worker.min.js',
  langPath: 'https://tessdata.projectnaptha.com/4.0.0',
  corePath: 'https://unpkg.com/tesseract.js-core@v2.0.0/tesseract-core.wasm.js',
});

export const solveCaptcha = async (captchaImage: string) => {
  const worker = createWorker({
    logger: m => console.log(m),
  });

  const language = 'eng';
  await worker.load();
  await worker.loadLanguage(language);
  await worker.initialize(language);
  const { data: { text } } = await worker.recognize(`../../${captchaImage}`);
  console.log('Texto do captcha:', text);
  await worker.terminate();
  return text;
}