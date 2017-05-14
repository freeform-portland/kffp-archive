#!/bin/bash

ssh $REMOTE_IP 'bash -s < deploy.sh'

echo $BUCKET_NAME

# ssh into server
# pull latest repo
# run yarn install
# consider whether new env vars need to be added
# restart pm2
