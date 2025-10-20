FROM node:22

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 9876

CMD ["node", "servidor_node.js"]
