# Ansible

## Instances

For each host in hosts, you should have a separate cloud instance (overlapping instances is not preferred).

### Mongo

Recommended amount of instances:

* 3 instances for `mongo_shard`
* 1 instance for `mongo_config_primary` and 2 instances for `mongo_config_secondary` (3 total for replication and fault-tolerance)
* `webservers` contain our query routers since mongos is pretty lightweight

For MongoDB setup, you also have to configure the following files in the [chirp-mongodb](../packages/chirp-mongodb) package:

* `hosts` with all the relevant hosts
* `config/primary.js` with all the config server instances
* `query/mongos.conf` with all the config server instances (in the `sharding: configDB:` line)
* `shard/init.js` with all the shard instances
