const { Router } = require('express')
const Todo = require('../models/Todo')
const router = Router()

router.get('/', async (req, res) => {
  const todos = await Todo.find({}).lean()
  let visitsToday = []
  let strtoday = new Date().toJSON().slice(0,10).replace(/-/g,'-');
  for(let i=0;i<todos.length;i++){
    for(let j=0;j<todos[i].visits.length;j++){
      if(strtoday == todos[i].visits[j].date) visitsToday.push({
        name: todos[i].name,
        phone: todos[i].phone,
        time:todos[i].visits[j].time,
        servise:todos[i].visits[j].servise,
        _id: todos[i]._id
      })
    }
  }

  visitsToday.sort(function (a,b){
    if (a.time > b.time) {
      return 1;
    }
    if (a.time < b.time) {
      return -1;
    }
    return 0;
  })

  res.render('index', {
    title: 'Записи',
    isIndex: true,
    visitsToday,
    strtoday
  })
})

router.get('/clients', async (req, res) => {
  const todos = await Todo.find({}).lean()
  res.render('clients', {
    title: "Клиенты",
    isClients: true,
    todos
  })
})

router.get('/create', (req, res) => {
  res.render('create', {
    title: 'Добавить клиента',
    isCreate: true
  })
})

router.post('/create', async (req, res) => {
  const todo = new Todo({
    name: req.body.name,
    phone: req.body.phone
  })

  await todo.save()
  res.redirect('/')
})

router.post('/complete', async (req, res) => {
  const todo = await Todo.findById(req.body.id)

  todo.completed = !!req.body.completed
  await todo.save()

  res.redirect('/')
})

router.post('/thisclient', async (req, res) => {
  const client = await Todo.findById(req.body.id).lean()

  let visits=client.visits

  res.render('client',{
    title:'Клиент',
    client,
    visits
  })
})

router.post('/addNewVisit', async (req, res) => {
  const todo = await Todo.findById(req.body.id)
  console.log(todo)

  let newVisit = {
    date: req.body.date,
    time: req.body.time,
    servise: req.body.servise,
  }
  todo.visits.push(newVisit)
  await todo.save()
  const client = await Todo.findById(req.body.id).lean()
  let visits=client.visits
  res.render('client',{
    title:'Клиент',
    client,
    visits
  })
})

router.post('/dateSwitch', async (req,res)=>{
  const strtoday=req.body.date
  const todos = await Todo.find({}).lean()
  let visitsToday = []
  for(let i=0;i<todos.length;i++){
    for(let j=0;j<todos[i].visits.length;j++){
      if(strtoday == todos[i].visits[j].date) visitsToday.push({
        name: todos[i].name,
        phone: todos[i].phone,
        time:todos[i].visits[j].time,
        servise:todos[i].visits[j].servise,
        _id: todos[i]._id
      })
    }
  }

  visitsToday.sort(function (a,b){
    if (a.time > b.time) {
      return 1;
    }
    if (a.time < b.time) {
      return -1;
    }
    return 0;
  })

  res.render('index', {
    title: 'Записи',
    isIndex: true,
    visitsToday,
    strtoday
  })
})

module.exports = router
