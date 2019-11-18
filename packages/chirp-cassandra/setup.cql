CREATE KEYSPACE chirp WITH replication = { 'class' : 'SimpleStrategy', 'replication_factor' : 2 };

use chirp;

CREATE TABLE images (id uuid, user_id text, image blob, used boolean, PRIMARY KEY (id));
