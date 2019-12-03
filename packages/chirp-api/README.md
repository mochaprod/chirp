# `chirp-api`

API service for Chirp.

## Init

Install dependencies:

```sh
npm install
npm start
```

If changes are made, `git pull` them first.

## Deploy

Deploy as many instances as needed!

Required environment variables:

| Variable | |
|---|---|
| ELASTICSEARCH | Comma-separated IPs for each Elasticsearch node |
| ELASTIC_INDEX | Name of index used for search |
| SMTP | IP of Postfix instance |
| SMTP_PORT | Port Postfix is listening on |
| CASSANDRA | Comma-separated IPs for each Cassandra node |
