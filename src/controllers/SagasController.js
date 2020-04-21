const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "./src/database/dragon-ball-db.sqlite3",
  },
});

module.exports = {
  list: async (request, response) => {
    try {
      const sagasResult = await knex("sagas_saga")
        .select("sagas_saga.*")
        .limit(4);

      response.status(200).json({
        sagasResult,
      });
    } catch (error) {
      response.status(403).json({
        error,
      });
    }
  },
};
