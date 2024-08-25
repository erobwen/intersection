
export const production = import.meta.env.PROD;
export const apiPort = production ? 3001 : 3000;