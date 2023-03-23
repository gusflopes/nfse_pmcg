export async function later(delay: any) {
  if (!delay) delay = 5000;
  return new Promise(function (resolve) {
    setTimeout(resolve, delay);
  });
}

export async function centsToReals(valor: string) {
  // const valor = "150012";
  const reals = valor.substring(0, valor.length - 2);
  const cents = valor.substring(valor.length - 2, valor.length);
  console.log(`${reals},${cents}`);
  return `${reals},${cents}`;
}

// export async function realsToCents(valor: string) {
//   // const valor = "1500,12";
//   const reals = valor.substring(0, valor.length - 3);
//   const cents = valor.substring(valor.length - 2, valor.length);
//   console.log(`${reals}${cents}`);
//   return `${reals}${cents}`;
// }
