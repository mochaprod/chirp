# Ansible

## Instances

For each host in hosts, you should have a separate cloud instance (overlapping instances is not preferred).

Don't forget to open up the relevant ports:

* Cassandra: 9042
* Elasticsearch: 9200
* Mongo: 27017 - 27019
* Postfix: 2525 (default is 25, but there are firewall issues with cloud providers atm) -- `.yml` in progress
* Webserver: 80

### Mongo

Recommended amount of instances:

* 3 instances for `mongo_shard`
* 1 instance for `mongo_config_primary` and 2 instances for `mongo_config_secondary` (3 total for replication and fault-tolerance)
* `webservers` contain our query routers since `mongos` is pretty lightweight

You also have to configure the following files in the [chirp-mongodb](../packages/chirp-mongodb) package:

* `hosts` with all the relevant hosts
* `config/primary.js` with all the config server instances
* `query/mongos.conf` with all the config server instances (in the `sharding: configDB:` line)
* `shard/init.js` with all the shard instances
