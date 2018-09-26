FROM node:8

WORKDIR /app

COPY . ./

RUN yarn

EXPOSE 3000

CMD ["npm", "start"]