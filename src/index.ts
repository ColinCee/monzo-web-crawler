import {WebCrawler} from './WebCrawler';
import puppeteer from 'puppeteer';

const STARTING_URL = 'https://monzo.com';

const main = async () => {
  const browser = await puppeteer.launch({headless: false});
  try {
    const webCrawler = new WebCrawler(browser, STARTING_URL);
    await webCrawler.crawl();
  } catch (e) {
    console.log(e);
  } finally {
    await browser.close();
  }
};

main();
