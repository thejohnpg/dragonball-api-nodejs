const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './src/database/dragon-ball-db.sqlite3',
  },
});


module.exports = {
  list: async (request, response) => {

    const { page = 1, search = '', sagaId = null } = request.query;
    const itemsPerPage = 10;

    if (sagaId && isNaN(sagaId)) {
      response.status(422).json({
        message: 'The parameter "sagaId" need to be a number'
      })
      return
    }

    try {
      let saga = {};

      if (sagaId) {
        [ saga ] = await knex('sagas_saga').where('id', '=', sagaId)
      }

      const [ totalItemsResult ] = await knex('character_character')
        .count({ count: 1 })
        .whereNotNull('img_character')
        .andWhere('character_character.nm_character', 'like', `%${search}%`)
        .andWhere(function() {
          if (sagaId) {
            this.where('character_character.saga_id_id', '=', sagaId)
          }
        });
      
      const charactersResult = await knex('character_character')
        .select('character_character.*', 'character_type_character.nm_type_character', 'sagas_saga.nm_saga')
        .leftJoin('character_type_character', 'character_character.type_id_id', 'character_type_character.id')
        .leftJoin('sagas_saga', 'character_character.saga_id_id', 'sagas_saga.id')
        .whereNotNull('img_character')
        .andWhere('character_character.nm_character', 'like', `%${search}%`)
        .andWhere(function() {
          if (sagaId) {
            this.where('character_character.saga_id_id', '=', sagaId)
          }
        })
        .limit(itemsPerPage)
        .offset((page - 1) * 10);

      response.status(200).json({
        filter: {
          search,
          saga: saga.id ? {
            id: saga.id,
            name: saga.nm_saga,
          } : 'all',
        },
        pagination: {
          totalItems: totalItemsResult.count,
          itemsPerPage,
          totalPages: Math.ceil(totalItemsResult.count/itemsPerPage),
          currentPage: parseInt(page),
        },
        characters: charactersResult
      });
    } catch (error) {
      response.status(403).json(error);
    }
  },
};
