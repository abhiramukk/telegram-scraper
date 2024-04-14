const options = {
    definition: {
      openapi: "3.1.0",
      info: {
        title: "Telegram Post API with Swagger",
        version: "0.1.0",
        description:
          "Telegram posts API",
      },
      servers: [
        {
          url: "http://localhost:8080",
        },
      ],
    },
    apis: ["./app/routes/*.js"],
  };


module.exports = options;