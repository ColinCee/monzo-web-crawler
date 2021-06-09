import {URL} from 'url';

export class DuplicateUrlChecker {
  private visitedUrls: Set<URL> = new Set();

  public hasUrl(url: URL) {
    return this.visitedUrls.has(url);
  }
  public markVisited(url: URL) {
    this.visitedUrls.add(url);
  }
}
