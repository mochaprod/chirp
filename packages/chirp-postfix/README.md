# chirp-postfix

Configuration files for the Postfix server.

## main.cf

Configured as an open relay -- for production, the `mynetworks` field should be set to something like `192.168.0.0/28` to only allow machines in the same network.

And if we had a verified domain name, the `myhostname` field should be changed to said domain name.

## master.cf

Configured to also listen on port 2525, due to cloud provider instances blocking port 25 to prevent email spam (one of the causes being an open relay, which we have set up).
