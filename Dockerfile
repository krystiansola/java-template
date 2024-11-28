FROM asyncapi/cli:2.11.0

LABEL authors="krystiansola"
WORKDIR /app/java-template
COPY ./components .
COPY ./hooks .
COPY ./template .
COPY ./utils .
COPY ./package.json .
COPY ./package-lock.json .

RUN npm install --force