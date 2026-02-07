
FROM node:20-alpine

LABEL maintainer="Lavrekha"

WORKDIR /app

COPY backend/package*.json ./

RUN npm install

COPY backend .

COPY client ./client

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
