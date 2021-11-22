FROM node:lts-alpine
ENV NODE_ENV=production

RUN mkdir /app
WORKDIR /app

COPY . /app/

# install production dependencies
RUN npm ci

CMD ["npm", "run", "prod"]