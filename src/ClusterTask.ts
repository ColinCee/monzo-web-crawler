import {DuplicateUrlChecker} from './DuplicateUrlChecker';
import Cluster, {TaskFunction} from 'puppeteer-cluster/dist/Cluster';
import {URL} from 'url';
import {isUrlValid} from './isUrlValid';

export const shouldVisitUrl = (
  duplicateUrlChecker: DuplicateUrlChecker,
  startUrl: URL,
  url: URL
) => {
  if (duplicateUrlChecker.hasUrl(url)) {
    return false;
  }

  return url.hostname === startUrl.hostname;
};

export const mapAnchorsToLinks = (elements: Element[]) =>
  elements.map(anchor => (anchor as HTMLAnchorElement).href);

export const createClusterTask = (
  duplicateUrlChecker: DuplicateUrlChecker,
  startUrl: URL,
  cluster: Cluster
): TaskFunction<URL, void> => {
  const addNextLinks = (urls: string[]) => {
    urls
      .filter(url => isUrlValid(url))
      .map(url => new URL(url))
      .filter(url => shouldVisitUrl(duplicateUrlChecker, startUrl, url))
      .forEach(url => cluster.queue(url));
  };

  return async ({page, data}) => {
    if (duplicateUrlChecker.hasUrl(data)) {
      return;
    }

    duplicateUrlChecker.markVisited(data);
    console.log(data.href);
    await page.goto(data.href);

    const urls = await page.$$eval('a', mapAnchorsToLinks);

    await page.close();
    const uniqueUrls = [...new Set(urls)];
    console.log(uniqueUrls);
    addNextLinks(uniqueUrls);
  };
};
