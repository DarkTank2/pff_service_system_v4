FROM nginx:latest

RUN apt-get update && apt-get upgrade -y

COPY /dist /usr/share/nginx/html/stationary

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]