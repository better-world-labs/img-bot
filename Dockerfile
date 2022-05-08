FROM buildkite/puppeteer
ARG ENVIRONMENT=dev
WORKDIR /app

# 设置时区
RUN rm -rf /etc/localtime && ln -s /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

COPY fonts/ /usr/share/fonts/ 

RUN fc-cache -f -v

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN yarn install

COPY assert/index.html assert/index.html
COPY config/default.js config/default.js
COPY lib lib
COPY template template
COPY index.js index.js

RUN export NODE_ENV=${ENVIRONMENT}
CMD node index.js

EXPOSE 8080
