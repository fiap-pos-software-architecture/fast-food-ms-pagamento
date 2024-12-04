FROM node:18-slim

RUN apt-get update && apt-get install -y nano

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

ENV MYSQL_USER=jm_user_pagamento \
    MYSQL_PASSWORD=jm_password_pagamento \
    MYSQL_DATABASE=tech_challenge_BD_pagamento \
    MYSQL_HOST=mysql-db-pagamento \
    MYSQL_PORT=3306

EXPOSE 3002

CMD [ "npm", "start" ]
