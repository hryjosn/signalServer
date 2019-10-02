#!/bin/bash
cd /var/api
pm2 stop web-rtc --silent || : ;pm2 delete web-rtc ;