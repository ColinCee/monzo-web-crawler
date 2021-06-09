import {TaskFunction} from 'puppeteer-cluster/dist/Cluster';
import {DuplicateUrlChecker} from './DuplicateUrlChecker';
import {Browser} from 'puppeteer';
import {URL} from 'url';
import {Cluster} from 'puppeteer-cluster';
import {isUrlValid} from './isUrlValid';

export class WebCrawler {
  cluster: Cluster;
  startUrl: URL;
  duplicateUrlChecker = new DuplicateUrlChecker();

  constructor(cluster: Cluster, startUrl: URL) {
    this.cluster = cluster;
    this.startUrl = startUrl;
  }

  private initialiseCluster = async () => {
    const task: TaskFunction<URL, void> = async ({page, data}) => {
      if (this.duplicateUrlChecker.hasUrl(data)) {
        return;
      }
      this.duplicateUrlChecker.markVisited(data);
      console.log(data.href);
      await page.goto(data.href);

      const urls = await page.$$eval('a', elements =>
        elements.map(anchor => (anchor as HTMLAnchorElement).href)
      );

      await page.close();
      // console.log(urls);
      const uniqueUrls = [...new Set(urls)];
      uniqueUrls
        .filter(url => isUrlValid(url))
        .map(url => new URL(url))
        .filter(url => this.shouldVisitUrl(url))
        .forEach(url => this.cluster.queue(url));
    };

    await this.cluster.task(task);
  };

  private shouldVisitUrl(url: URL) {
    if (this.duplicateUrlChecker.hasUrl(url)) {
      return false;
    }

    return url.hostname === this.startUrl.hostname;
  }

  public async crawl() {
    await this.initialiseCluster();
    this.cluster.queue(this.startUrl);
  }
}
