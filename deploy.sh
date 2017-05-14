#!/bin/bash

ssh $REMOTE_IP << EOF
echo "Change to working directory"
cd $APP_DIR
echo "Fetch current repository"
git pull origin master
echo "Install dependencies"
yarn
echo "Create temporary password-file"
touch ~/.vault_pass.txt
echo "Populate temp password file with values"
echo $ENCRYPT_KEY >> ~/.vault_pass.txt
echo "Decrypt vault file"
ansible-vault decrypt vault.yml --vault-password-file ~/.vault_pass.txt
echo "Create .env file"
cp vault.yml .env
echo "Re-encrypt vault file"
ansible-vault encrypt vault.yml --vault-password-file ~/.vault_pass.txt
echo "Remove temp password-file"
rm ~/.vault_pass.txt
echo "Start application"
yarn start
EOF
exit
