import express from 'express';
import cors from 'cors';
import mentorRoutes from './routes/mentorias.js';

const app = express()

app.use(cors())

app.use(express.json())

app.use('/mentorias', mentorRoutes);

const database = {
  users: [
    {
      name: "João Víctor",
      idade: 23
    },
        {
      name: "Salles",
      idade: 67
    },
  ]
}

app.get("/users", (req, res) => {

  res.json({
    users: database.users
  })
})

app.post("/", (req, res) => {
  const user = {
    name: req.body.name,
    idade: req.body.idade
  }
  database.users.push(user)
  console.log(req.body)
  console.log("Rota post")
})

app.put("/", (req, res) => {
    res.send("put")
})

app.delete("/", (req, res) => {
    res.send("delete")
})

app.listen(4000, () => {
    
})