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

WORKDIR /now

# copy the full directory
ADD . ./

#
# NODE
#

# installing dependencies
RUN yarn
RUN yarn install --peer

# running our test
RUN yarn test