use chirp;

db.users.drop();
db.items.drop();
db.items.drop();
db.follows.drop();
db.likes.drop();
db.media.drop();

db.users.createIndex({ username: 1, email: 1 });
db.items.createIndex({ ownerName: 1 });
db.follows.createIndex({ user: 1, follows: 1 });

sh.addShard("shard1:27018")
sh.addShard("shard2:27018")
sh.addShard("shard3:27018")

sh.enableSharding("chirp")
sh.shardCollection("chirp.users", { "_id": "hashed" } )
sh.shardCollection("chirp.items", { "_id": "hashed" } )
sh.shardCollection("chirp.follows", { "_id": "hashed" } )
sh.shardCollection("chirp.likes", { "_id": "hashed" } )
sh.shardCollection("chirp.media", { "_id": "hashed" } )
