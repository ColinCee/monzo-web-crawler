import {DuplicateUrlChecker} from '../src/DuplicateUrlChecker';
import {URL} from 'url';

describe('DuplcateUrlChecker', () => {
  let duplicateUrlChecker = new DuplicateUrlChecker();
  beforeEach(() => {
    duplicateUrlChecker = new DuplicateUrlChecker();
  });
  const url = new URL('https://test.com/');

  describe('markVisited', () => {
    it('removes trailing slashes', () => {
      duplicateUrlChecker.markVisited(url);

      expect(duplicateUrlChecker.visitedUrls.has('https://test.com')).toBe(
        true
      );
    });
  });

  describe('hasUrl', () => {
    it.each([
      [url, new Set(['https://test.com']), true],
      [new URL('https://something.com'), new Set(['https://test.com']), false],
    ])('when url: %p | set: %p | returns %p', (url, currentSet, expected) => {
      duplicateUrlChecker.visitedUrls = currentSet;
      expect(duplicateUrlChecker.hasUrl(url)).toBe(expected);
    });

    it('removes trailing slashes', () => {
      duplicateUrlChecker.visitedUrls = new Set(['https://test.com']);

      expect(duplicateUrlChecker.hasUrl(url)).toBe(true);
    });
  });
});
