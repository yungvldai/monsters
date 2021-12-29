import dictionary from './dictionary.json';

export default (status) => dictionary.find((entry) => entry.status === status);
