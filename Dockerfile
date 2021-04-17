### BASE
FROM node:lts-alpine3.10 AS base
LABEL maintainer "Peter van Dijk <petervandijk@gmail.com>"
# Set the working directory
WORKDIR /app
# Copy project specification and dependencies lock files
COPY package.json package-lock.json tsconfig.json /tmp/
# Install npm 
RUN apk --no-cache add npm

### DEPENDENCIES
FROM base AS dependencies
# Install Node.js dependencies
RUN cd /tmp && npm i

### RELEASE
FROM base AS development
# Copy app sources
COPY . .
# Copy dependencies
COPY --from=dependencies /tmp/node_modules ./node_modules
# Expose application port
EXPOSE 7070
