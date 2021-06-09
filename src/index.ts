import {WebCrawler} from './WebCrawler';
import {Cluster} from 'puppeteer-cluster';
import {URL} from 'url';

export const STARTING_URL = new URL('https://monzo.com/i/coronavirus-update');

export const main = async () => {
  const cluster: Cluster<URL> = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 4,
    puppeteerOptions: {
      // @ts-ignore
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
  });

  const crawler = new WebCrawler(cluster, STARTING_URL);
  await crawler.crawl();

  await cluster.idle();
  await cluster.close();
};

main();
