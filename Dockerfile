# The multi stage set up *saves* up image size by avoiding the dev dependencies
# required to produce dist/
FROM node:18-alpine as builder
WORKDIR /app
# This layer will invalidate upon new dependencies
COPY package.json yarn.lock ./
RUN export YARN_CACHE_FOLDER="$(mktemp -d)" \
  && yarn install --frozen-lockfile --quiet \
  && rm -r "$YARN_CACHE_FOLDER"
# If there's some code changes that causes this layer to
# invalidate but it shouldn't, use .dockerignore to exclude it
COPY . .
RUN yarn build

FROM node:18-alpine as app
COPY package.json yarn.lock /action-release/
# On the builder image, we install both types of dependencies rather than
# just the production ones. This generates /action-release/node_modules
RUN export YARN_CACHE_FOLDER="$(mktemp -d)" \
  && cd /action-release \
  && yarn install --frozen-lockfile --production --quiet \
  && rm -r "$YARN_CACHE_FOLDER"

# Copy the artifacts from `yarn build`
COPY --from=builder /app/dist /action-release/dist/
RUN chmod +x /action-release/dist/index.js

RUN printf '[safe]\n    directory = *\n' > /etc/gitconfig

# XXX: This could probably be replaced with a standard CMD
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
