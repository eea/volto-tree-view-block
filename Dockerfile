# syntax=docker/dockerfile:1
ARG VOLTO_VERSION
FROM plone/frontend-builder:${VOLTO_VERSION}

ARG ADDON_NAME
ARG ADDON_PATH

RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    apt-get update \
    && apt-get install --no-install-recommends -y chromium libgconf-2-4 libatk1.0-0 libatk-bridge2.0-0 libgdk-pixbuf2.0-0 libgtk-3-0 libgbm-dev libnss3-dev libxss-dev libasound2 \
    && corepack enable

RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    npm install -g jest-junit

COPY --chown=node:node ./ /app/src/addons/${ADDON_PATH}/

RUN /setupAddon
RUN yarn install

ENTRYPOINT ["yarn"]
CMD ["start"]
