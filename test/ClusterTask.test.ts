import * as isUrlValid from './../src/isUrlValid';
import * as ClusterTask from './../src/ClusterTask';
import {Cluster} from 'puppeteer-cluster';
import {DuplicateUrlChecker} from './../src/DuplicateUrlChecker';
import {URL} from 'url';
import {mock, mockDeep} from 'jest-mock-extended';
import {Page} from 'puppeteer';

jest.mock('../src/isUrlValid');

const startUrl = new URL('https://monzo.com/');
const {shouldVisitUrl, mapAnchorsToLinks, createClusterTask} = ClusterTask;

describe('shouldVisitUrl', () => {
  const duplicateUrlChecker = mock<DuplicateUrlChecker>();
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns false when url is duplicate', () => {
    duplicateUrlChecker.hasUrl.mockReturnValue(true);
    const url = new URL('https://monzo.com/blogs');

    expect(shouldVisitUrl(duplicateUrlChecker, startUrl, url)).toBe(false);
  });

  it('returns false when domain does not match starting', () => {
    duplicateUrlChecker.hasUrl.mockReturnValue(false);
    const url = new URL('https://test.com/blogs');

    expect(shouldVisitUrl(duplicateUrlChecker, startUrl, url)).toBe(false);
  });

  it('returns true when url is not duplicate and is same domain', () => {
    duplicateUrlChecker.hasUrl.mockReturnValue(false);
    const url = new URL('https://monzo.com/blogs');
    expect(shouldVisitUrl(duplicateUrlChecker, startUrl, url)).toBe(true);
  });
});

type TaskFunctionArgs = {
  page: Page;
  data: URL;
  worker: {
    id: number;
  };
};
describe('createClusterTask', () => {
  const duplicateUrlChecker = mock<DuplicateUrlChecker>();
  const cluster = mock<Cluster>();
  const clusterTask = createClusterTask(duplicateUrlChecker, startUrl, cluster);

  const taskArgs = mockDeep<TaskFunctionArgs>();
  const {page, data} = taskArgs;
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('skips page if duplicate', async () => {
    duplicateUrlChecker.hasUrl.mockReturnValue(true);
    await clusterTask(taskArgs);

    expect(page.goto).not.toBeCalled();
  });

  it('looks for anchor links and returns their hrefs', async () => {
    await clusterTask(taskArgs);

    expect(page.$$eval).toBeCalledWith('a', mapAnchorsToLinks);
    expect(page.close).toBeCalled();
  });
  it('should ignore duplicates', async () => {
    page.$$eval.mockReturnValue(
      Promise.resolve(['https://test.com/', 'https://test.com/'])
    );
    jest.spyOn(ClusterTask, 'shouldVisitUrl').mockReturnValue(true);
    jest.spyOn(isUrlValid, 'isUrlValid').mockReturnValue(true);

    await clusterTask(taskArgs);
    expect(cluster.queue).toBeCalledWith(new URL('https://test.com/'));
    expect(cluster.queue).toBeCalledTimes(1);
  });

  it('should filter non valid urls', async () => {
    page.$$eval.mockReturnValue(
      Promise.resolve(['https://test.com/', 'monzo.com'])
    );
    jest.spyOn(ClusterTask, 'shouldVisitUrl').mockReturnValue(true);
    jest
      .spyOn(isUrlValid, 'isUrlValid')
      .mockImplementation(url => url === 'https://test.com/');

    await clusterTask(taskArgs);
    expect(cluster.queue).toBeCalledWith(new URL('https://test.com/'));
    expect(cluster.queue).toBeCalledTimes(1);
  });

  it('should filter by shouldVisitUrl', async () => {
    page.$$eval.mockReturnValue(
      Promise.resolve(['https://test.com/', 'https://monzo.com'])
    );
    jest.spyOn(isUrlValid, 'isUrlValid').mockReturnValue(true);
    jest.spyOn(ClusterTask, 'shouldVisitUrl').mockReturnValue(false);

    await clusterTask(taskArgs);
    expect(cluster.queue).toBeCalledTimes(0);
  });
});
