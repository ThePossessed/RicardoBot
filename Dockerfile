FROM node:latest

#Create directory
RUN mkdir /usr/src/bot
WORKDIR /usr/src/bot

COPY . /usr/src/bot
RUN npm install

CMD ["node", "index.js"]