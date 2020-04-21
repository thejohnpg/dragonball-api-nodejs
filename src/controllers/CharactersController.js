const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './src/database/dragon-ball-db.sqlite3',
  },
});


module.exports = {
  list: async (request, response) => {

    const { page = 1, search = '' } = request.query;
    const itemsPerPage = 10;

    try {
      const [ totalItemsResult ] = await knex('character_character')
        .count({ count: 1 })
        .whereNotNull('img_character')
        .where('character_character.nm_character', 'like', `%${search}%`);
      
      const charactersResult = await knex('character_character')
        .select('character_character.*', 'character_type_character.nm_type_character', 'sagas_saga.nm_saga')
        .leftJoin('character_type_character', 'character_character.type_id_id', 'character_type_character.id')
        .leftJoin('sagas_saga', 'character_character.saga_id_id', 'sagas_saga.id')
        .whereNotNull('img_character')
        .where('character_character.nm_character', 'like', `%${search}%`)
        .limit(itemsPerPage)
        .offset((page - 1) * 10);

      response.status(200).json({
        pagination: {
          search,
          totalItems: totalItemsResult.count,
          itemsPerPage,
          totalPages: Math.ceil(totalItemsResult.count/itemsPerPage),
          currentPage: parseInt(page),
        },
        characters: charactersResult
      });
    } catch (error) {
      response.status(422).json(error);
    }
  },
};
