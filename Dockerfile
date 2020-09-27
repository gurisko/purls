FROM node:12

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

WORKDIR /opt/purls

ADD package.json yarn.lock ./

RUN yarn --pure-lockfile
RUN yarn add pm2 -g

ADD . ./

COPY wait-for-it.sh /usr/local/wait-for-it.sh
RUN chmod +x /usr/local/wait-for-it.sh

EXPOSE 4000

CMD ["yarn", "dev"]
