FROM node:12.18.0

ADD package.json /app/
ADD package-lock.json /app/
WORKDIR /app
RUN npm install
ADD . /app
RUN npm run build
