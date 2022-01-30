#!/usr/bin/env python3
# THIS FILE WILL BE OVERWRITTEN. DO NOT MAKE ANY CHANGES HERE

import atexit
from cassandra.cluster import Cluster
from cassandra.auth import PlainTextAuthProvider

# This is the Zip file you downloaded
SECURE_CONNECT_BUNDLE = '/workspace/bootcamp-fullstack-apps-with-cassandra/secure-connect-workshops.zip'
# This is the "Client Id" value you obtained earlier
USERNAME = "FrPJbiHBGZRlOFeiknAYBqPL"
# This is the "Client Secret" value you obtained earlier
PASSWORD = "PRdqQkiemM76D-dNTZeTwz5aU2s2slLlQkoUB3ADhkxbIMvz+pnI.+9MUiXbMXn3RylTjpFCvhIj8tMQDDFLY6i8C9KU4ol1..o3SxbXDAni5uRdA6BfMPFWcJrJYn_W"
# This is the keyspace name
KEYSPACE = "todos"


secure_connect_bundle = SECURE_CONNECT_BUNDLE
path_to_creds = ''
cluster = Cluster(
    cloud={
        'secure_connect_bundle': SECURE_CONNECT_BUNDLE
    },
    auth_provider=PlainTextAuthProvider(USERNAME, PASSWORD)
)
session = cluster.connect(KEYSPACE)


@atexit.register
def shutdown_driver():
    cluster.shutdown()
    session.shutdown()
