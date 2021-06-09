import {isUrlValid} from './../src/isUrlValid';
import {URL} from 'url';

describe('isUrlValid', () => {
  it.each([
    ['', false],
    ['test.com', false],
    ['https://test.com', true],
    ['http://test.co.uk', true],
    ['https://somehing.com/', true],
  ])('when url: %p | returns %p', (url, expected) => {
    expect(isUrlValid(url)).toBe(expected);
  });
});
