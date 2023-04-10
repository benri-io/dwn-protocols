FROM node:lts
MAINTAINER andor@benri.io

COPY . /app
WORKDIR /app
RUN yarn install
RUN yarn build

FROM nginx:stable-alpine
COPY --from=0 /app/build/ /tmp/build/
RUN mkdir -p /var/www/html
RUN mv /tmp/build/* /var/www/html/
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080
