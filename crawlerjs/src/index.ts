// const {
// Key,
// until,
//   Condition,
//   WebDriver,
// } = require("selenium-webdriver");
import fs from 'node:fs';
import { Builder, By, Key, until, WebDriver } from "selenium-webdriver";
import { later } from "./utils";
import { solveCaptcha } from './utils/solve-captcha';

require("dotenv/config");

const nfse = {
  tomador: {
    cpfCnpj: "73013650125",
    name: "GUSTAVO FERREIRA LOPES",
    cep: "79041-080",
    numero: "2520",
    email: "gusflopes86@gmail.com",
  },
  valor: "100", // in cents
  item: "Item Teste",
  descricao: "Nota Fiscal emitida como teste",
  quantidade: "1",
};

async function localizarEmpresa(driver: WebDriver, searchParam: string) {
  const elements1 = await driver.findElements(By.css("tr .gridResultado1"));
  const elements2 = await driver.findElements(By.css("tr .gridResultado2"));
  // .then((r) => console.log(`linha 15: ${r.length}`));
  const elements = [...elements1, ...elements2];
  console.log(`total: ${elements.length}`);
  console.log(elements[0].findElement);

  let result;

  for (let e of elements) {
    const text = await e.getText();
    console.log(text);
    if (text.includes(searchParam)) {
      console.log("ESTE É O CORRETO!");
      result = e;
    }
    console.log("-----");
  }
  return result;
}

async function hello() {
  let driver = await new Builder().forBrowser("chrome").build();
  let vars: any = {};

  try {
    await driver.get("https://nfse.pmcg.ms.gov.br/NotaFiscal/index.php");
    // await driver.manage().window().setRect({ x: 1214, y: 729 });
    vars["root"] = await driver.getWindowHandle();
    await driver.switchTo().window(vars["root"]);
    await driver.switchTo().frame(1);
    await driver.findElement(By.css("#fundopopup")).click();
    await driver.findElement(By.linkText("Acesso ao Sistema")).click();
    await driver.findElement(By.id("rLogin")).sendKeys(process.env.USER_LOGIN);
    await driver
      .findElement(By.id("rSenha"))
      .sendKeys(process.env.USER_PASSWORD);
    await driver.findElement(By.id("rSelo")).isEnabled();
    // const catpcha = await driver.findElement(By.xpath(`*[@id="coluna5B"]/form/table/tbody/tr[3]/td[4]/img`))
    const catpcha = await driver.findElement(By.css(`td > img`))
    console.log(catpcha)
    // document.querySelector("#coluna5B > form > table > tbody > tr:nth-child(3) > td:nth-child(4) > img")
    // #coluna5B > form > table > tbody > tr:nth-child(3) > td:nth-child(4) > img
    // /html/body/div[2]/div[1]/div/div[2]/div/div[2]/div[1]/div[2]/form/table/tbody/tr[3]/td[4]/img
    // *[@id="coluna5B"]/form/table/tbody/tr[3]/td[4]/img

    // Tirar uma screenshot do element com id rSelo e descobrir captcha usando tesseract
    const screenshot = await catpcha.takeScreenshot();
    fs.writeFileSync('captcha.png', screenshot, 'base64');

    const texto2 = await solveCaptcha('captcha.png')
    // const texto = await solveCaptcha(screenshot)

    console.log(texto2)
    await later(5000);
    await driver.quit()

    await driver.findElement(By.css("#btnEntrar")).click();

    // Selecionar Empresa
    await driver.findElement(By.linkText("Selecionar Empresa")).click();
    const userToSelect = await localizarEmpresa(driver, "LOPES CONTABILIDADE");
    await userToSelect?.click();

    // Emitir NFSe
    await driver.findElement(By.linkText("Emitir Nota Fiscal")).click();
    // Selecionar Cliente
    await driver.wait(until.elementLocated(By.id("rTomCpfCnpjSel")));
    await driver
      .findElement(By.id("rTomCpfCnpjSel"))
      .sendKeys(nfse.tomador.cpfCnpj);
    await driver.findElement(By.id("rTomRazaoSocial")).click();
    await later(5000);
    await driver
      .findElement(By.id("rTomRazaoSocial"))
      .sendKeys(Key.HOME, Key.chord(Key.SHIFT, Key.END), nfse.tomador.name);
    await driver
      .findElement(By.id("rTomCep"))
      .sendKeys(Key.HOME, Key.chord(Key.SHIFT, Key.END), nfse.tomador.cep);
    await driver.findElement(By.id("rTomNumero")).click();
    await later(3000);
    await driver
      .findElement(By.id("rTomNumero"))
      .sendKeys(Key.HOME, Key.chord(Key.SHIFT, Key.END), nfse.tomador.numero);
    await driver
      .findElement(By.id("rTomEmail"))
      .sendKeys(Key.HOME, Key.chord(Key.SHIFT, Key.END), nfse.tomador.email);

    await later(1500);
    // avanncar
    const btnAvancar = await driver.findElement(
      By.xpath(`//*[@id="btnAvancar"]`)
    );
    // console.log(btnAvancar)
    await btnAvancar.click();
    await later(3000);
    // await driver.findElement(By.id("btnAvancar")).click()
    // Selecionar Código de Atividade
    await driver.wait(until.elementLocated(By.id("rCodAtv")));
    await driver.findElement(By.id("rCodAtv")).click();
    {
      await later(1500);
      await driver
        .findElement(By.css("#rCodAtv > option:nth-child(2)"))
        .click();
    }
    await later(3000);
    await driver.findElement(By.id("btnAvancar")).click();

    // Dados da Nota Fiscal
    await driver.findElement(By.id("rDescrNota")).click();
    await driver.findElement(By.id("rDescrNota")).sendKeys(nfse.descricao);
    await driver.findElement(By.id("rItemDescricao")).sendKeys(nfse.item);
    await driver.findElement(By.id("rItemQtd")).click();
    await driver.findElement(By.id("rItemQtd")).sendKeys(nfse.quantidade);
    await driver.findElement(By.id("rItemValUnit")).click();
    await driver.findElement(By.id("rItemValUnit")).sendKeys(nfse.valor);
    await driver.findElement(By.css(".body")).click();
    // await later(1000);;

    let startLoop = Date.now();
    while (true) {
      console.log("ainda não");
      const btnStyle = await (
        await driver.findElement(By.id("btnAdd"))
      ).getAttribute("style");
      if (
        btnStyle ===
        `background: url("imagens/Ok_16x16.png"); width: 18px; height: 18px;`
      ) {
        console.log("pronto para clicar");
        break;
      }
      if (Date.now() - startLoop > 5000) {
        console.log("timeout");
        break;
      }
    }

    await driver.findElement(By.id("btnAdd")).click();

    console.log("Pronto para emitir a Nota Fiscal!");
    await later(10000);

    // console.log(element);
  } catch (err) {
    console.log(err);
  } finally {
    console.log("Finalizado sem erro");
  }
}

hello();
