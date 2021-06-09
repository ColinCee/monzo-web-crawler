import {URL} from 'url';

export class DuplicateUrlChecker {
  visitedUrls: Set<String>;

  constructor() {
    this.visitedUrls = new Set();
  }

  private removeTrailingSlash({href}: URL) {
    if (href.endsWith('/')) {
      return href.slice(0, -1);
    }
    return href;
  }

  public hasUrl(url: URL) {
    const formattedUrl = this.removeTrailingSlash(url);
    return this.visitedUrls.has(formattedUrl);
  }

  public markVisited(url: URL) {
    const formattedUrl = this.removeTrailingSlash(url);
    this.visitedUrls.add(formattedUrl);
  }
}
