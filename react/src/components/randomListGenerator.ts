
// const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const characters = '0123456789abcdef';

const defaultStringLength = 3;

export function generateRandomString(length: number): string {
  let result = '';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export function generateRandomList(length: number, stringLength: number = defaultStringLength): string[] {
  const result = [];
  while(result.length < length) {
    result.push(generateRandomString(stringLength));
  }
  return result;
}