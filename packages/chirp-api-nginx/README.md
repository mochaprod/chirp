# `chirp-nginx`

Load balancer for Chirp.

## Setup

Manually add all instances hosting `chirp-api` to the load balancer `config` file.

## Hardware

In `nginx.conf`, adjust these settings to match your hardware requirements:

- `worker_processes` should be number of cores your machine has.
- `events.worker_connections` is the number of connections per worker process. Typically `RAM / Cores * 2`.
- `http.client_max_body_size` is the max body size of requests. Increase it to support large requests like files and media.
