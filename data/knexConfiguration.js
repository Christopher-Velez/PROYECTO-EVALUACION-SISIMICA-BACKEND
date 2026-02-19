import dotenv from "dotenv";
dotenv.config();

const knexConfiguration = {
  development: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
  },
};

export default knexConfiguration;
