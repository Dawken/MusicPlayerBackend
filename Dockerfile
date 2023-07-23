FROM node:18

WORKDIR /MusicPLayerBackend
COPY package.json .
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]