import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || "";
const MONGO_DB = 'stupidhack';

const mongo_client = new MongoClient(MONGODB_URI);


const db = new Promise((resolve, reject) => {
  mongo_client.connect(function(err) {
    if(err){
      console.log(err);
      return;
    }
    console.log("Connected successfully to db server");

    const db = mongo_client.db(MONGO_DB);
    resolve(db);
  });
});

async function getNumbersWithNoTask(){
  const numbers = (await db).collection('numbers');
  if(!numbers) {
    console.log("no numbers collection")
    return;
  }
  console.log("running find")
  return numbers.find({taskInProgress: {$exists: false}});
}

async function getNumbersWithTask(){
  const numbers = (await db).collection('numbers');
  const timeNow = new Date();
  if(!numbers) return;
  return numbers.find({taskInProgress: {$exists: true}});
}

async function saveTask(task){
  (await db).collection('tasks').updateOne({id: task.id}, {$set: task}, {upsert: true});
}

async function saveNumber(number){
  (await db).collection('numbers').updateOne({number: number.number}, {$set: number}, {upsert: true});
}

async function deleteTask(task){
  (await db).collection('tasks').deleteOne({id: task.id});
  (await db).collection('numbers').updateOne({taskInProgress: task.id}, {$unset: {taskInProgress: true}});
}

async function getNumberWithTask(id){
  const numbers = (await db).collection('numbers');
  return numbers.find({taskInProgress: id}).next();
}

async function getRandomTask(){
  const tasks = (await db).collection('taskTemplates');
  return tasks.aggregate([{ $sample: { size: 1 } }]).next();
}
async function getTask(id){
  const tasks = (await db).collection('tasks');
  return tasks.findOne({id: id});
}

export default db;
export {
  getNumbersWithNoTask,
  getNumbersWithTask,
  getNumberWithTask,
  saveTask,
  saveNumber,
  deleteTask,
  getRandomTask,
  getTask,
}
/*
  numbers:
    {
      number: '+358503479536',
      lastUpdate: 'Date.toISOString()',
      taskInProgress: 'id' ?
    }
  tasks:
    {
      id: 'id',
      xml: '<Response>
        <Say voice="alice">You have a task to complete at url example.addikt.io/BlueFancyPenguin</Say>
      </Response>',
    }
  taskTemplates:
    {
      baseUrl: 'example.addikt.io/',
      timeToComplete: 2
    }

  */
