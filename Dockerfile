FROM node:12-alpine as builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN export YARN_CACHE_FOLDER="$(mktemp -d)" \
  && yarn install --frozen-lockfile --quiet \
  && rm -r "$YARN_CACHE_FOLDER"
COPY . .
RUN yarn build

FROM node:12-alpine
COPY --from=builder /app/package.json /app/yarn.lock /action-release/
RUN export YARN_CACHE_FOLDER="$(mktemp -d)" \
  && cd /action-release \
  && yarn install --frozen-lockfile --production --quiet \
  && rm -r "$YARN_CACHE_FOLDER"

COPY --from=builder /app/dist /action-release/dist/
RUN chmod +x /action-release/dist/index.js

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
