FROM buildkite/puppeteer:10.0.0

RUN useradd -ms /bin/bash crawler
USER crawler
WORKDIR /home/crawler

COPY package*.json .
RUN npm install

COPY . .
RUN npm run compile
CMD [ "npm", "start" ]

