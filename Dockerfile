FROM node:14

WORKDIR /home/node/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn
COPY . .

RUN yarn build
WORKDIR /home/node/app/src/frontend
RUN yarn
RUN yarn dockerBuild
WORKDIR /home/node/app

EXPOSE 25565
EXPOSE 3000

ENTRYPOINT [ "yarn", "start" ]