FROM node:22-alpine

WORKDIR /app

COPY WebSite/package*.json ./

RUN npm install

COPY WebSite/ .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]