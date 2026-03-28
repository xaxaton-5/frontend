#!/bin/sh
set -eu

template="/opt/templates/env-config.template.js"
output="/usr/share/nginx/html/env-config.js"

envsubst '${VITE_API_BASE_URL} ${VITE_WEB_SOCKET_URL}' < "$template" > "$output"
