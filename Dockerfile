FROM node:12

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

WORKDIR /opt/purls

COPY package.json yarn.lock ./

RUN yarn --pure-lockfile

COPY . ./
COPY wait-for-it.sh /usr/local/wait-for-it.sh
RUN chmod +x /usr/local/wait-for-it.sh

EXPOSE 3000

CMD ["yarn", "dev"]
