# Monzo WebCrawler Coding Exercise

### Built With

- [puppeteer](https://github.com/puppeteer/puppeteer)
- [puppeteer-cluster](https://github.com/thomasdondorf/puppeteer-cluster)
- [typescript](https://github.com/google/gts)
- [gts](https://github.com/google/gts)

<!-- GETTING STARTED -->

## Getting Started (Docker)

To get a local copy up and running follow these simple steps.

### Prerequisites

Docker is the recommend way to run the program as it requires the least setup.
Install it from the [docker website](https://www.docker.com/products/docker-desktop)

### Installation

1. Build the image
   ```sh
   docker build -t crawler .
   ```
2. Run the built image
   ```sh
   docker run -it crawler
   ```

## Getting Started (Node)

This method is good if you're planning to do local development

### Prerequisites

Install [Node](https://nodejs.org/en/) or using [NVM](https://github.com/nvm-sh/nvm)

### Installation

1. Install NPM packages
   ```sh
   npm install
   ```
2. Run the code
   ```sh
   npm start
   ```

### Tests

Run tests with the following command

```sh
npm test
```
