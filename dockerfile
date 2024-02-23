FROM node:18.15.0-alpine
WORKDIR home/node/index
COPY . .
RUN npm install
EXPOSE 8080
CMD ["node","index.js"]