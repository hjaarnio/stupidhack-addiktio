import 'babel-polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import moment from 'moment';
import path from 'path';
import {
  getNumbersWithTask,
  getNumberWithTask,
  getNumbersWithNoTask,
  saveTask,
  deleteTask,
  saveNumber,
  getRandomTask,
  getTask,
} from './dist/db';
import generateId from './dist/generateId';
import { call } from './dist/twilio';

const PORT = process.env.PORT || 3000;
const ACCESS_KEY = process.env.ACCESS_KEY || "password";

const minInterval = 15;
const maxInterval = 60;
const callPeriod = maxInterval-minInterval;

const app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.text({type:'*/*'}));
app.use(express.static('static'))
const root = path.join(__dirname);

app.post('/update', async (req, res) => {
  console.log(req.body, ACCESS_KEY)
  if(!req.body){
    res.sendStatus(400);
    return;
  }
  if(req.body !== ACCESS_KEY){
    res.sendStatus(403);
    return;
  }

  /* create new tasks for numbers if they don't already have some */
  const numbersWithNoTask = await getNumbersWithNoTask();
  //console.log("without task", numbersWithNoTask)
  numbersWithNoTask.forEach(async number => {
    const lastUpdate = number.lastUpdate && moment(number.lastUpdate);
    const timeSinceLast = lastUpdate && moment.duration(moment().diff(lastUpdate)).asMinutes();
    if(!lastUpdate || (timeSinceLast - minInterval)/callPeriod > Math.random()){
      console.log("assigning new task to", number.number)
      // Assign new task
      const taskTemplate = await getRandomTask();
      console.log("having task template", taskTemplate)
      const id = generateId();
      const url = `${taskTemplate.baseUrl}/${id}`.replace('https://', '').replace('-', ' dash ').replace(/\./g, ' dot ').replace(/\//g, ' slash ');
      const xml = `<Response><Say voice="alice">Hello from addict dot i o. You have a task to complete at u r l ${url}</Say></Response>`;
      const task = {
        id: id,
        xml: xml,
        timeToComplete: taskTemplate.timeToComplete
      }
      console.log("having task", task)
      number.lastUpdate = moment().toISOString();
      number.taskInProgress = id;
      saveTask(task);
      saveNumber(number);
      call(number.number, id);
    } else {
      console.log("not enought time since last update")
    }
  })

  const numbersWithTask = await getNumbersWithTask();
  //console.log("with task", numbersWithTask)
  numbersWithTask.forEach(async number => {
    console.log("number", number)
    const lastUpdate = number.lastUpdate && moment(number.lastUpdate);
    const timeSinceLast = lastUpdate && moment.duration(moment().diff(lastUpdate)).asMinutes();
    const task = await getTask(number.taskInProgress);
    console.log(timeSinceLast, task.timeToComplete)
    if(timeSinceLast > task.timeToComplete){
      call(number.number, task.id);
      number.lastUpdate = moment().toISOString();
      saveNumber(number);
    }
  })
  res.sendStatus(200)
})

app.all('/task/:id', async (req, res) => {
  console.log("getting task", req.params.id)
  const task = await getTask(req.params.id);
  console.log(task)
  res.send(task.xml);
  return;
})

app.post('/complete/:id', async (req, res) => {
  console.log("completing task", req.params.id)
  const task = await getTask(req.params.id);
  if(task){
    deleteTask(task);
  }
  res.sendStatus(200)
})

app.get('*', (req, res) => {
  res.sendFile('./static/addiktio-landing.html', {root})
})
app.post('*', (req, res) => {
  console.log(req.body)
  saveNumber({
    number: req.body.number,
  })
  res.sendFile('./static/addiktio-landing.html', {root})
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}!`))
