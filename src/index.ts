import {DuplicateUrlChecker} from './DuplicateUrlChecker';
import {WebCrawler} from './WebCrawler';
import puppeteer from 'puppeteer';

const STARTING_URL = 'https://monzo.com/i/coronavirus-update';

const main = async () => {
  const browser = await puppeteer.launch({headless: false});
  const duplicateUrlChecker = new DuplicateUrlChecker();
  try {
    const webCrawler = new WebCrawler(
      browser,
      duplicateUrlChecker,
      STARTING_URL
    );
    await webCrawler.crawl();
  } catch (e) {
    console.log(e);
  } finally {
    await browser.close();
  }
};

main();
