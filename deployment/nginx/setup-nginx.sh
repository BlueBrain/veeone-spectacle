set -e

if [ -z "${SPECTACLE_BASE_PATH}" ]
then
  echo -n "" > /etc/nginx/conf.d/alias.locations
else
  sed -i "s;%SPECTACLE_BASE_PATH%;${SPECTACLE_BASE_PATH};g" /etc/nginx/conf.d/alias.locations
  sed -i "s;%SPECTACLE_NGINX_HTML_ROOT%;${SPECTACLE_NGINX_HTML_ROOT};g" /etc/nginx/conf.d/alias.locations
fi

sed -i "s;%SPECTACLE_NGINX_HTML_ROOT%;${SPECTACLE_NGINX_HTML_ROOT};g" /etc/nginx/conf.d/default.conf

NGINX_CONF_PATH=/etc/nginx/nginx.conf
NGINX_LOG_DIR=/var/log/nginx

chmod -R 777 /var/cache/nginx
sed -i -e '/user/!b' -e '/nginx/!b' -e '/nginx/d' ${NGINX_CONF_PATH}
sed -i 's!/var/run/nginx.pid!/var/cache/nginx/nginx.pid!g' ${NGINX_CONF_PATH}
ln -sf /dev/stdout ${NGINX_LOG_DIR}/access.log
ln -sf /dev/stderr ${NGINX_LOG_DIR}/error.log
