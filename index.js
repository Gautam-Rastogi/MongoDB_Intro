const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 8000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

const todoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Todo = mongoose.model('Todo', todoSchema);

async function connectToDatabase() {
  try {
    await mongoose.connect('mongodb+srv://shubhamrastogibs_db_user:nwBtao2VHAMLZA7C@cluster0.hody6bc.mongodb.net/todos?appName=Cluster0', {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
}

async function getTodos() {
  return Todo.find({});
}

async function addTodo(title) {
  return Todo.create({ title, completed: false });
}

async function toggleTodo(id) {
  const todo = await Todo.findById(id);
  if (!todo) return null;

  todo.completed = !todo.completed;
  await todo.save();
  return todo;
}

async function deleteTodo(id) {
  return Todo.findByIdAndDelete(id);
}

app.get('/', async (req, res) => {
  try {
    const todos = await getTodos();
    res.render('index', { todos });
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong');
  }
});

app.post('/todos', async (req, res) => {
  const title = req.body.title;
  try {
    await addTodo(title.trim());
  } catch (error) {
    console.error(error);
  }

  res.redirect('/');
});

app.post('/todos/:id/complete', async (req, res) => {
  try {
    await toggleTodo(req.params.id);
  } catch (error) {
    console.error(error);
  }

  res.redirect('/');
});

app.post('/todos/:id/delete', async (req, res) => {
  try {
    await deleteTodo(req.params.id);
  } catch (error) {
    console.error(error);
  }

  res.redirect('/');
});

connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`app running on port ${PORT}`);
  });
});


