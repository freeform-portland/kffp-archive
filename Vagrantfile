# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"
  config.vm.hostname = "machine1"
  config.ssh.insert_key = false
  config.vm.synced_folder "./", "/opt/app"
  config.vm.network "forwarded_port", guest: 3000, host: 3000

  config.vm.provision "ansible" do |ansible|
    ansible.playbook = "ansible_playbook.yml"
  end

  config.vm.provider "virtualbox" do |vb|
    vb.memory = "1024"
  end
end
