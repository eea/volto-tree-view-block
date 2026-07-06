# syntax=docker/dockerfile:1
ARG VOLTO_VERSION
FROM plone/frontend-builder:${VOLTO_VERSION}

ARG ADDON_NAME
ARG ADDON_PATH
ARG CHROMIUM_MAJOR=149


ENV HOST="0.0.0.0"
ENV CHROME_BIN="/usr/bin/chromium"
ENV CHROMIUM_BIN="/usr/bin/chromium"
ENV CYPRESS_BROWSER_PATH="/usr/bin/chromium"

# Install Cypress dependencies (matching eeacms/frontend-builder)
USER root
RUN apt-get update -q \
    && apt-get install -qy --no-install-recommends \
        libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb \
    && chromium_version="$(apt-cache madison chromium | awk -v major="${CHROMIUM_MAJOR}" '$3 ~ "^" major "\\." { print $3; exit }')"; \
    if [ -z "${chromium_version}" ]; then \
      echo "ERROR: chromium ${CHROMIUM_MAJOR}.x is not available from configured apt repositories"; \
      apt-cache policy chromium chromium-common || true; \
      apt-cache madison chromium chromium-common || true; \
      exit 1; \
    fi; \
    apt-get install -qy --no-install-recommends \
      "chromium=${chromium_version}" \
      "chromium-common=${chromium_version}"; \
    && rm -rf /var/lib/apt/lists/*

USER node

COPY --chown=node:node ./ /app/src/addons/${ADDON_PATH}/

RUN /setupAddon
RUN yarn add jest-junit
RUN yarn install

ENTRYPOINT ["yarn"]
CMD ["start"]
