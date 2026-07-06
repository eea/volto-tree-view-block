# syntax=docker/dockerfile:1
ARG VOLTO_VERSION
FROM plone/frontend-builder:${VOLTO_VERSION}

ARG ADDON_NAME
ARG ADDON_PATH
ARG CHROMIUM_VERSION=149.0.7827.196-1


ENV HOST="0.0.0.0"
ENV CHROME_BIN="/usr/bin/chromium"
ENV CHROMIUM_BIN="/usr/bin/chromium"
ENV CYPRESS_BROWSER_PATH="/usr/bin/chromium"

# Install Cypress dependencies (matching eeacms/frontend-builder)
USER root
RUN apt-get update -q \
    && apt-get install -qy --no-install-recommends \
        libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb \
    && apt-get install "chromium=${CHROMIUM_VERSION}" \
      "chromium-common=${CHROMIUM_VERSION}"; \
    rm -rf /var/lib/apt/lists/*

USER node

COPY --chown=node:node ./ /app/src/addons/${ADDON_PATH}/

RUN /setupAddon
RUN yarn add jest-junit
RUN yarn install

ENTRYPOINT ["yarn"]
CMD ["start"]
