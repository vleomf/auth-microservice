FROM node:alpine

# https://github.com/nodejs/docker-node/issues/384#issuecomment-305208112
RUN apk --no-cache add --virtual native-deps \
  g++ gcc libgcc libstdc++ linux-headers autoconf automake make nasm python git && \
  npm install --quiet node-gyp -g

WORKDIR /app

COPY ./package*.json ./

RUN npm install --silent

COPY . .

# https://stackoverflow.com/a/48643374
RUN npm rebuild bcrypt --update-binary

CMD npm run start:dev