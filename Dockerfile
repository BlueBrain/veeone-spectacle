ARG SPECTACLE_NGINX_IMAGE_VERSION=stable-alpine

FROM bbpgitlab.epfl.ch:5050/viz/veeone/spectacle/base:latest as builder

WORKDIR /app
ADD . /app

ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run test && \
    npm run build

# Build Nginx server
FROM nginx:${SPECTACLE_NGINX_IMAGE_VERSION}

# This argument specifies the "subdirectory" path for the build version
# of the application e.g. if we run it on http://bbpteam.epfl.ch/viz/spectacle/
# then SPECTACLE_BASE_PATH argument should be `viz/spectacle`
ARG SPECTACLE_BASE_PATH=""

ARG SPECTACLE_NGINX_HTML_ROOT=/usr/share/nginx/html
ARG SPECTACLE_BUILD_PATH=/app/dist

# Copy app artifacts
COPY --from=builder ${SPECTACLE_BUILD_PATH} ${SPECTACLE_NGINX_HTML_ROOT}

# Fix a bug that occurs only in Kaniko.
# @see https://github.com/GoogleContainerTools/kaniko/issues/1278
RUN test -e /var/run || ln -s /run /var/run

# Add Nginx configuration file and change the base path
ADD ./nginx/default.conf /etc/nginx/conf.d
ADD ./nginx/alias.locations /etc/nginx/conf.d

# Set up Nginx cache and log directories
ADD ./nginx/setup-nginx.sh /tmp
RUN chmod +x /tmp/setup-nginx.sh && /tmp/setup-nginx.sh

# Add permissions for Nginx user
RUN chown -R nginx:nginx ${SPECTACLE_NGINX_HTML_ROOT} && chmod -R 755 ${SPECTACLE_NGINX_HTML_ROOT} && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d

RUN touch /var/run/nginx.pid
RUN chown -R nginx:nginx /var/run/nginx.pid

USER nginx
