const express = require("express");

const app = express();

const SagasController = require ('./controllers/SagasController');
const CharactersController = require ('./controllers/CharactersController');

app.use(express.json());

app.get("/sagas", SagasController.list);
app.get("/characters", CharactersController.list);

app.listen(3000, function () {
  console.log("Listen on Port 3000!");
});
