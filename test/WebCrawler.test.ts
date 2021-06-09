import {mockDeep} from 'jest-mock-extended';
import {Cluster} from 'puppeteer-cluster';
import {WebCrawler} from './../src/WebCrawler';
import {URL} from 'url';

describe('WebCrawler', () => {
  it('queues initial url', async () => {
    const cluster = mockDeep<Cluster>();
    const startUrl = new URL('https://monzo.com');
    const webCrawler = new WebCrawler(cluster, startUrl);

    await webCrawler.crawl();

    expect(cluster.queue).toBeCalledWith(startUrl);
  });
});
