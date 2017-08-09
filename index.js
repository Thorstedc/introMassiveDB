const express = require('express');
const {json} = require('body-parser');
const cors = require('cors');
const massive = require('massive');
const config = require('./config');
const port = config.port || 3002;
const app = express();

app.use(cors());
app.use(json());

massive(config.massiveConfig).then(dbInstance => {
  app.set('db', dbInstance)
});

app.post('/api/people', (req, res) => {
  const {name, age, location} = req.body
  req.app.get('db').postToPeople([name, age, location]).then(response => res.status('200').json(response))
  .catch(err => res.status('500').json(err));
});

app.get('/api/people', (req, res)=>{
  req.app.get('db').readAllPeople()
    .then(people => res.status('200').json(people))
    .catch(err => res.status('500').json(err));
});

app.put('/api/people/:id',(req, res)=>{
  const {id} = req.params;
  const {name} = req.body;
  req.app.get('db').updateUserName([name, id])
  .then(people => res.status('200').json(people))
  .catch(err => res.status('500').json(err));
})

app.listen(port, () => console.log('listening on ${port}'))
