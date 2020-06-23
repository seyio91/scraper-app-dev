#!/bin/bash -e

SOURCE_IMAGE_APP="${DOCKER_REPO_APP}"
SOURCE_IMAGE_WORKER="${DOCKER_REPO_WORKER}"
SOURCE_IMAGE_PROXY="${DOCKER_REPO_PROXY}"


# lets make sure we always have access to latest image
TARGET_IMAGE_LATEST_APP="${SOURCE_IMAGE_APP}:latest"
TARGET_IMAGE_LATEST_WORKER="${SOURCE_IMAGE_WORKER}:latest"
TARGET_IMAGE_LATEST_PROXY="${SOURCE_IMAGE_PROXY}:latest"

TIMESTAMP=$(date '+%Y%m%d%H%M%S')
# using datetime as part of a version for versioned image
VERSION="${TIMESTAMP}-${TRAVIS_COMMIT}"
# using specific version as well
# it is useful if you want to reference this particular version
# in additional commands like deployment of new Elasticbeanstalk version
TARGET_IMAGE_VERSIONED_APP="${SOURCE_IMAGE_APP}:${VERSION}"
TARGET_IMAGE_VERSIONED_WORKER="${SOURCE_IMAGE_WORKER}:${VERSION}"
TARGET_IMAGE_VERSIONED_PROXY="${SOURCE_IMAGE_PROXY}:${VERSION}"


# update latest version
docker tag ${SOURCE_IMAGE_APP} ${TARGET_IMAGE_LATEST_APP}
docker tag ${SOURCE_IMAGE_WORKER} ${TARGET_IMAGE_LATEST_WORKER}
docker tag ${SOURCE_IMAGE_PROXY} ${TARGET_IMAGE_LATEST_PROXY}

docker push ${TARGET_IMAGE_LATEST_APP}
docker push ${TARGET_IMAGE_LATEST_WORKER}
docker push ${TARGET_IMAGE_LATEST_PROXY}

# push new version
docker tag ${SOURCE_IMAGE_APP} ${TARGET_IMAGE_VERSIONED_APP}
docker tag ${SOURCE_IMAGE_WORKER} ${TARGET_IMAGE_VERSIONED_WORKER}
docker tag ${SOURCE_IMAGE_PROXY} ${TARGET_IMAGE_VERSIONED_PROXY}

docker push ${TARGET_IMAGE_VERSIONED_APP}
docker push ${TARGET_IMAGE_VERSIONED_WORKER}
docker push ${TARGET_IMAGE_VERSIONED_PROXY}