export const baseUrl = 'https://mosaic.monster/api/v1';

const api = Object.freeze({
  get: (requestUrl) => {
    return fetch(`${baseUrl}/${requestUrl}`);
  }
});

export default api;