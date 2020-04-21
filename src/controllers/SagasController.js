const sqlite3 = require("sqlite3").verbose();

module.exports = {
  async list(request, response) {
    const db = new sqlite3.Database("./src/database/dragon-ball-db.sqlite3");

    const sql = `SELECT DISTINCT * from sagas_saga GROUP BY nm_saga;`;

    db.all(sql, (error, result) => {
      if (error) {
        return response.status(404).json({ error });
      }
      return response.status(200).json({ sagas: result });
    });

    db.close();
  },
};
