#!/usr/bin/env bash

sudo chown -R www-data:www-data $1

sudo find $1 -type d -exec chmod 755 {} \\;
sudo find $1 -type f -exec chmod 644 {} \\;

echo 'permissions updated'

sudo systemctl restart apache2

echo 'apache server restarted'