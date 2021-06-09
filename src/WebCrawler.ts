import {Browser} from 'puppeteer';
import {URL} from 'url';

export class WebCrawler {
  browser: Browser;
  visitedUrls: Set<URL>;
  startUrl: URL;

  constructor(browser: Browser, startUrl: string) {
    this.browser = browser;
    this.visitedUrls = new Set();
    this.startUrl = new URL(startUrl);
  }

  private shouldVisitUrl(url: URL) {
    if (this.visitedUrls.has(url)) {
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
    console.log(urls);
    await page.close();
    return urls.map(url => new URL(url));
  }

  public async crawl() {
    const queue = [this.startUrl];

    while (queue.length > 0) {
      const currentUrl = queue.shift() as URL;
      console.log(currentUrl.href);
      const urls = await this.fetchUniqueUrls(currentUrl);
      for (const url of urls) {
        if (this.shouldVisitUrl(url)) {
          queue.push(url);
        }
      }

      this.visitedUrls.add(currentUrl);
    }
  }
}
