# Chirp

A highly scalable, highly performant, highly blazing-fast Twitter clone.

## Ansible

Contains all the setup/deployment files for all our cloud instances.

## Packages

* `chirp-api` - API service
* `chirp-api-nginx` - Load balancer for `chirp-api` instances
* `chirp-elasticsearch` - Elasticsearch config
* `chirp-mongodb` - MongoDB config for Chirp
* `chirp-ui` - UI
* `chirp-ui-static` - UI that's already built (used for deployment)
