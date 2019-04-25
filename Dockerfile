#
# BASICS
#
# base images
FROM mhart/alpine-node:11.3.0
#
# ENVIRONMENTS
#
# about circle continues integration
ARG CI
ARG CIRCLECI
ARG CIRCLE_BUILD_NUM
ARG CIRCLE_BRANCH
ARG CIRCLE_SHA1
#
# STEPS
#
WORKDIR /usr/src/app
COPY package*.json ./
COPY . .
#
# NODE
#
# installing dependencies
RUN npm install --peer
# running our test
RUN npm run test
