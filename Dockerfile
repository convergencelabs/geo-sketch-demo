FROM node:14 as builder

RUN mkdir /tmp/demo

WORKDIR /tmp/demo

COPY public public
COPY src src
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .

RUN npm ci && \
    npm run build

FROM nginx:stable-alpine

# Patch Vulnerabilities
RUN apk update && \
    apk --no-cache add \
      curl=7.77.0-r1 \
      libcurl=7.77.0-r1 \
      libxml2=2.9.10-r7 \
      libgcrypt=1.8.8-r0

# confd
RUN wget -nv https://github.com/kelseyhightower/confd/releases/download/v0.16.0/confd-0.16.0-linux-amd64 && \
    mv confd-0.16.0-linux-amd64 /usr/local/bin/confd && \
    chmod +x /usr/local/bin/confd
COPY docker/confd /etc/confd/

# nginx
COPY --from=builder /tmp/demo/build /usr/share/nginx/html
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

COPY docker/bin/boot.sh /boot.sh
RUN chmod +x /boot.sh

CMD ["/boot.sh"]