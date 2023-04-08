// import {PuppeteerNode} from 'puppeteer'
console.log("Hello World!");

// const puppeteer: PuppeteerNode = require('puppeteer');
const puppeteer = require("puppeteer");

async function hello(url) {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1200, height: 800 },
    });
    const page = await browser.newPage();
    const fileName = `name-${Date.now()}`;

    await page.goto(url);
    // await page.goto("http://www.google.com.br");

    // Try to find a better way to check this.
    // Method Page.pdf() doesn't work on headless browser
    // if (browser._process.spawnargs.includes('--headless')) {
    //   console.log('Print PDF!');
    //   await page.pdf({ path: `./tmp/${fileName}.pdf` });
    // }

    await page.screenshot({ path: `./tmp/${fileName}.png` });

    await browser.close();
  } catch (error) {
    console.error(error);
  }
}

(async () => {
  await hello("http://www.tjms.jus.br");
})();
