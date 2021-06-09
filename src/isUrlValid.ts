import {URL} from 'url';
export const isUrlValid = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
};
