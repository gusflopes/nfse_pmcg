const valor = "150012";
const reals = valor.substring(0, valor.length - 2);
const cents = valor.substring(valor.length - 2, valor.length);
console.log(`${reals},${cents}`);
console.log(valor.length);