FROM node:14

WORKDIR /home/node/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn
COPY . .

RUN yarn build

EXPOSE 25565

ENTRYPOINT [ "yarn", "start" ]