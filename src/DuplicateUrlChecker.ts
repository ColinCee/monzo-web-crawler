import {URL} from 'url';

export class DuplicateUrlChecker {
  private visitedUrls: Set<String> = new Set();

  public hasUrl(url: URL) {
    return this.visitedUrls.has(url.href);
  }
  public markVisited(url: URL) {
    this.visitedUrls.add(url.href);
  }
}
