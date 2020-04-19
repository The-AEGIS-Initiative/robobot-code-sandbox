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
ENV DB_USERNAME=admin
ENV DB_PASSWORD=admin
ENV DB_URL=mongodb://mongo:27017
ENV CI=true
RUN npm test

# Build
ENV DB_USERNAME=$DB_USERNAME
ENV DB_PASSWORD=$DB_PASSWORD
ENV DB_URL=$DB_URL
CMD ["npm", "run-script", "start-production"]