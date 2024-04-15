require('express-async-errors');

const migrationsRun = require("./database/sqlite/migrations");

const AppError = require('./utils/AppError');

const express = require('express');

const routes = require('./routes');

migrationsRun(); 

const app = express()
app.use(express.json())

app.use(routes)


app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message
    })
  }

  console.error(error)

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error'
  })
})

const PORT = 3333
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`))
//aqui esta usando o app.listen que é como se fosse para escutar/ observar quando a função iniciar, então aparecer a mensagem do console.log


/*
app.get("/message/:id/:user", (request, response) => { //"/" dentro vai ir o conteúdo da rota. "request" requisição. "response" obtém a resposta. ":id"/":user" é o parâmetro 
  const {id, user} = request.params //params é utilizados para dados simples
  
  response.send(`
  Id da mensagem: ${id}.
  Nome do usuário: ${user}.`);
})

app.get("/users", (request,response) => {
const {page, limit} = request.query; //buscando informações como uma query

response.send(`Página ${page}. Mostrar ${limit}`)

})
*/

