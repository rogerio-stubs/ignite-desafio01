const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const foundUser = users.find(user => user.username == username);

  if(!foundUser) return response.status(400).json({message: `User not found`});

  request.username = foundUser;
  return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  const foundUser = users.find(user => user.username == username);

  if(foundUser) return response.status(400).json({error: `Username already exists!`});

  dataUser = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };
  
  users.push(dataUser);
  
  return response.status(201).json(dataUser);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { username } = request;

  return response.status(200).json(username.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { username } = request;
  const { title, deadline } = request.body;

  const dataTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  };

  username.todos.push(dataTodo);

  return response.status(201).json(dataTodo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { username } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;

  const foundTodo = username.todos.find(todo => todo.id == id);

  if(!foundTodo) return response.status(404).json({error: `ToDo not found`});

  foundTodo.title = title;
  foundTodo.deadline = new Date(deadline);

  return response.status(201).json(foundTodo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { username } = request;
  const { id } = request.params;

  const foundTodo = username.todos.find(todo => todo.id == id);

  if(!foundTodo) return response.status(404).json({error: `ToDo not found`});

  foundTodo.done = true;

  return response.status(201).json(foundTodo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { username } = request;
  const { id } = request.params;

  const foundTodo = username.todos.find(todo => todo.id == id);

  if(!foundTodo) return response.status(404).json({error: `ToDo not found`});

  username.todos.splice(id, 1);

  return response.status(204).send();
});

module.exports = app;