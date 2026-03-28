FROM node:22 AS build

ARG VITE_API_BASE_URL=http://localhost:5000/api
ARG VITE_WEB_SOCKET_URL=ws://localhost:5001/ws

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_WEB_SOCKET_URL=$VITE_WEB_SOCKET_URL

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
