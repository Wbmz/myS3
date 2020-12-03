FROM node:14.4.0-alpine
WORKDIR /app
COPY . .
RUN yarn install
RUN
CMD ["node", "./main.js"]