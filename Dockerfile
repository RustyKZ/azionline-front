FROM node:latest as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./ .
RUN npm run build

FROM nginx as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf

RUN mkdir -p /etc/nginx/ssl
COPY /ssl/fullchain.pem /etc/nginx/ssl/
COPY /ssl/privkey.pem /etc/nginx/ssl/