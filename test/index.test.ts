import {STARTING_URL} from './../src/index';
import {mockDeep} from 'jest-mock-extended';
import {mocked} from 'ts-jest/utils';
import {main} from '../src/index';
import {Cluster} from 'puppeteer-cluster';
import {WebCrawler} from '../src/WebCrawler';

jest.mock('puppeteer-cluster');
jest.mock('../src/WebCrawler.ts');

const mockCluster = mocked(Cluster);
const mockedCrawler = mocked(WebCrawler);

describe('main', () => {
  it('calls correct functions', async () => {
    const cluster = mockDeep<Cluster>();

    mockCluster.launch.mockReturnValue(Promise.resolve(cluster));
    await main();

    expect(mockCluster.launch).toBeCalledWith({
      concurrency: Cluster.CONCURRENCY_CONTEXT,
      maxConcurrency: 4,
    });
    expect(WebCrawler).toBeCalledWith(cluster, STARTING_URL);
    expect(mockedCrawler.mock.instances[0].crawl).toBeCalled();
    expect(cluster.idle).toBeCalled();
    expect(cluster.close).toBeCalled();
  });
});
