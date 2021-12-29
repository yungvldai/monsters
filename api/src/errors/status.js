import dictionary from './dictionary.json';

const codes = dictionary.reduce((acc, current) => {
  const { msg, status: value } = current;
  const key = msg
    .toUpperCase()
    .replace(/[^A-Za-z_ ]/g, '')
    .split(' ')
    .join('_');
  return {
    ...acc,
    [key]: value
  };
}, {});

export default codes;
