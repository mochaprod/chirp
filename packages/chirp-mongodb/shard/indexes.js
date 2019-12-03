use chirp;
db.users.createIndex({ username: 1, email: 1 });
db.items.createIndex({ ownerName: 1 });
db.follows.createIndex({ user: 1, follows: 1 });
