# Chirp

A highly scalable, highly performant, highly blazing-fast Twitter clone.

## Ansible

Contains all the setup/deployment files for all our cloud instances.

For deployment related notes, see the [Ansible](./ansible) folder.

## Packages

* `chirp-api` - API service
* `chirp-api-nginx` - Load balancer for `chirp-api` instances
* `chirp-elasticsearch` - Elasticsearch config
* `chirp-mongodb` - MongoDB config for Chirp
* `chirp-cassandra` - Cassandra configuration
* `chirp-postfix` - Postfix configuration
* `chirp-ui` - UI
* `chirp-ui-static` - UI that's already built (used for deployment)

## Statistics

*Load* Able to handle a load of 1000 concurrent users sending a total 200,000 requests over 10-12 minutes (about 250-300 requests per second).

### Hardware

Working hardware configuration to achieve the above stats.

* 2 CPU load balancer
* 2 CPU Elasticsearch instance
* 4 CPU Cassandra cluster (2 CPU per node)
* 1 CPU Postfix, Mail instance
* 6 CPU MongoDB sharded cluster (3 config servers, 3 shards)
* 6 CPU API webserver instances (1 sitting in the same instance as Postfix) (1 CPU each instance)

Maximize RAM for each instance (recommended 2 GB per core), but 1 GB/core works too
