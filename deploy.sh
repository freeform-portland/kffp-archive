#!/bin/bash

ssh $REMOTE_IP << EOF
cd $APP_DIR
git pull origin master
yarn
touch ~/.vault_pass.txt
echo $ENCRYPT_KEY >> ~/.vault_pass.txt
ansible-vault decrypt vault.yml --vault-password-file ~/.vault_pass.txt
rm ~/.vault_pass.txt
yarn start
EOF
