# Chirp

A *highly* scalable, *highly* performant, *highly* blazing-fast Twitter clone.

## Ansible

Contains all the setup/deployment files for all our cloud instances.

For deployment related notes, see the [Ansible](./ansible) folder.

## Packages

* `chirp-api` - API service
* `chirp-api-nginx` - Load balancer for `chirp-api` instances
* `chirp-cassandra` - Cassandra configuration
* `chirp-elasticsearch` - Elasticsearch config
* `chirp-mongodb` - MongoDB config for Chirp
* `chirp-postfix` - Postfix configuration
* `chirp-ui` - UI
* `chirp-ui-static` - UI that's already built (used for deployment)

## Statistics

### Load

Able to handle a load of 1000 concurrent users sending a total 200,000 requests over 10-12 minutes (about 250-300 requests per second). The tail latency (95th percentile) was around 150ms.

### Hardware

Working hardware configuration to achieve the above stats (16 total instances).

* 2 vCPU load balancer
* 2 vCPU Elasticsearch instance
* 4 vCPU Cassandra cluster (2 CPU per node)
* 1 vCPU Postfix, Mail instance
* 6 vCPU MongoDB sharded cluster (3 config servers, 3 shards)
* 6 vCPU API webserver instances (1 sitting in the same instance as Postfix) (1 CPU each instance)

Maximize RAM for each instance (recommended 2 GB per core), but 1 GB/core works too.
