FROM node:13.8.0-alpine3.11

# Install docker daemon
RUN apk update
RUN apk add docker

# Install node_modules
WORKDIR /app
COPY ./package.json /app/package.json
RUN npm install

# Load in code files
COPY . .

# Run Test Suite
ENV CI=true
RUN npm test

# Build
ENV DB_USERNAME=$BUILD_DB_USERNAME
ENV DB_PASSWORD=$BUILD_DB_PASSWORD
ENV DB_URL=$BUILD_DB_URL
CMD ["npm", "run-script", "start-production"]