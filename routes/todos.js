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
    title: 'Студия красоты и здоровья ИМАН',
    isIndex: true,
    visitsToday,
    strtoday
  })
})

router.get('/clients', async (req, res) => {
  const todos = await Todo.find({}).lean()
  let val=''
  res.render('clients', {
    title: "Клиенты",
    isClients: true,
    todos,
    val
  })
})

router.get('/create', (req, res) => {
  res.render('create', {
    title: 'Добавить пациента',
    isCreate: true
  })
})

router.post('/create', async (req, res) => {
  const todo = new Todo({
    name: req.body.name,
    phone: req.body.phone1
  })

  await todo.save()
  res.redirect('/')
})

router.post('/thisclient', async (req, res) => {
  const client = await Todo.findById(req.body.id).lean()

  let visits=client.visits
  visits.reverse()

  res.render('client',{
    title:'Пациент',
    client,
    visits
  })
})

router.post('/addNewVisit', async (req, res) => {
  const todo = await Todo.findById(req.body.id)

  let newVisit = {
    date: req.body.date,
    time: req.body.time,
    servise: req.body.servise,
    id:todo._id,
    ind:todo.visits.length
  }
  todo.visits.push(newVisit)
  await todo.save()
  const client = await Todo.findById(req.body.id).lean()
  let visits=client.visits
  visits.reverse()
  res.render('client',{
    title:'Пациент',
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


router.post('/editRatingAndMap', async (req, res) => {
  const todo = await Todo.findById(req.body.id)
  let rating = req.body.rating
  todo.mapClient=req.body.mapClient
  todo.name=req.body.name
  todo.phone=req.body.phone
  if(rating == 1){
    todo.ratingG=true;
    todo.ratingB=false;
    todo.ratingVB=false;
  }else{
    if(rating == 2){
      todo.ratingG=false;
      todo.ratingB=true;
      todo.ratingVB=false;
    }else{
      todo.ratingG=false;
      todo.ratingB=false;
      todo.ratingVB=true;
    } 
  }
  await todo.save()
  const client = await Todo.findById(req.body.id).lean()
  let visits=client.visits
  visits.reverse()
  res.render('client',{
    title:'Пациент',
    client,
    visits
  })
})


router.post('/editing', async (req, res) => {
  var vote = req.body.vote
  const todo = await Todo.findById(req.body.id)
  var ind = req.body.ind
  if(vote=="changec"){
  todo.visits[ind].date = req.body.date
  todo.visits[ind].time = req.body.time
  todo.visits[ind].servise = req.body.servise
  }else{
    todo.visits.splice(ind,1);
    for(let i=ind;i<todo.visits.length;i++){
      todo.visits[i].ind = i;
    }
  }
  todo.markModified('visits');
  await todo.save()
  const client = await Todo.findById(req.body.id).lean()
  let visits=todo.visits
  visits.reverse()
  res.render('client',{
    title:'Пациент',
    client,
    visits
  })
})

router.post('/inpName', async (req, res) => {
  const todos = await Todo.find({}).lean()
  let clients=[]
  let str = req.body.val
  for(let i=0;i<todos.length;i++){
    if(todos[i].name.indexOf(str)!=-1){
      clients.push(todos[i]);
    }
  }
  let val = req.body.val
  res.render('partials/list', {
    title: "Клиенты",
    isClients: true,
    clients,
    val
  })
})

module.exports = router
