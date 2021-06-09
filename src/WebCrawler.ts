import {DuplicateUrlChecker} from './DuplicateUrlChecker';
import {URL} from 'url';
import {Cluster} from 'puppeteer-cluster';
import {createClusterTask} from './ClusterTask';

export class WebCrawler {
  cluster: Cluster;
  startUrl: URL;
  duplicateUrlChecker = new DuplicateUrlChecker();

  constructor(cluster: Cluster, startUrl: URL) {
    this.cluster = cluster;
    this.startUrl = startUrl;
  }

  private initialiseCluster = async () => {
    const clusterTask = createClusterTask(
      this.duplicateUrlChecker,
      this.startUrl,
      this.cluster
    );
    await this.cluster.task(clusterTask);
  };

  public async crawl() {
    await this.initialiseCluster();
    this.cluster.queue(this.startUrl);
  }
}
