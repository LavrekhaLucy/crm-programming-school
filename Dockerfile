FROM node:20-alpine

LABEL maintainer="Lavrekha"

WORKDIR /app

COPY backend/package.json backend/package-lock.json ./

RUN npm install

COPY backend .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
