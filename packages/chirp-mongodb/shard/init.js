sh.addShard("shard1:27018")
sh.addShard("shard2:27018")
sh.addShard("shard3:27018")

sh.enableSharding("chirp")
sh.shardCollection("chirp.users", { "_id": "hashed" } )
sh.shardCollection("chirp.items", { "_id": "hashed" } )
sh.shardCollection("chirp.follows", { "_id": "hashed" } )
