FROM node:20-alpine

LABEL maintainer="Lavrekha"

WORKDIR /app

COPY backend/package*.json ./

RUN npm install

COPY backend .

EXPOSE 3000


