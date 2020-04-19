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
CMD ["npm", "run-script", "start-production"]