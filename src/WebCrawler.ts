import {DuplicateUrlChecker} from './DuplicateUrlChecker';
import {Browser} from 'puppeteer';
import {URL} from 'url';

export class WebCrawler {
  browser: Browser;
  startUrl: URL;
  duplicateUrlCHecker: DuplicateUrlChecker;

  constructor(
    browser: Browser,
    duplicateUrlChecker: DuplicateUrlChecker,
    startUrl: string
  ) {
    this.browser = browser;
    this.duplicateUrlCHecker = duplicateUrlChecker;
    this.startUrl = new URL(startUrl);
  }
  private isUrlValid(url: string) {
    try {
      new URL(url);
      return true;
    } catch (err) {
      return false;
    }
  }

  private shouldVisitUrl(url: URL) {
    if (this.duplicateUrlCHecker.hasUrl(url)) {
      return false;
    }

    return url.hostname === this.startUrl.hostname;
  }

  private async fetchUniqueUrls(url: URL) {
    const page = await this.browser.newPage();
    await page.goto(url.href);

    const urls = await page.$$eval('a', elements =>
      elements.map(anchor => (anchor as HTMLAnchorElement).href)
    );
    await page.close();
    // console.log(urls);
    return urls.filter(url => this.isUrlValid(url)).map(url => new URL(url));
  }

  public async crawl() {
    const queue = [this.startUrl];

    while (queue.length > 0) {
      const currentUrl = queue.shift() as URL;
      if (!this.shouldVisitUrl(currentUrl)) {
        continue;
      }

      console.log(currentUrl.href);
      const urls = await this.fetchUniqueUrls(currentUrl);
      for (const url of urls) {
        queue.push(url);
      }

      this.duplicateUrlCHecker.markVisited(currentUrl);
    }
  }
}
