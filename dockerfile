FROM node:16
WORKDIR /app
COPY ./backend .
RUN npm install
CMD ["npm", "start"]
