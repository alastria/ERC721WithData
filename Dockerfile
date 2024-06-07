FROM node:20-alpine
WORKDIR /app

COPY ./package.json /app/package.json
RUN npm install

COPY ./contracts /app/contracts
COPY tsconfig.json /app/tsconfig.json
COPY ./hardhat.config.ts /app/hardhat.config.ts
RUN npm run build

COPY . /app
CMD ["npm", "start"]