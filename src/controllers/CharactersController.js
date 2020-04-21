const sqlite3 = require("sqlite3").verbose();

module.exports = {
    list(request, response) {
    const db = new sqlite3.Database("./src/database/dragon-ball-db.sqlite3");

    const { page = 1 } = request.query;

    const totalItems = [];
    const itemsPerPage = 10;

    const sqlTotalItens = `SELECT COUNT(*) FROM character_character`;
    
    // Total Itens in Character
    db.all(sqlTotalItens,(error, total) => {
        return totalItems.push(total)
    })

    // Info Total Pages 
    console.log(totalItems)

    const sql = 
    `SELECT character_character.*, character_type_character.nm_type_character, sagas_saga.nm_saga
    FROM character_character 
    LEFT JOIN character_type_character 
    ON character_character.type_id_id = character_type_character.id
    LEFT JOIN sagas_saga
    ON character_character.saga_id_id = sagas_saga.id
    WHERE fighting_power > 0
	LIMIT ${itemsPerPage} OFFSET ${(page - 1) * 10};`;

    db.all(sql, (error, result) => {
      if (error) {
        return response.status(404).json({ error });
      }
      return response.status(200).json({ characters: result });
    });
    db.close();
  },
};
