
const Datastore = require('nedb');
const db = new Datastore({ filename: './db' });

db.loadDatabase(function (err) {    // Callback is optional
  // Now commands will be executed
});


const insertItem = (doc) => {
  return new Promise((resolve, reject) => {
    db.insert(doc, function (err, newDoc) {
      if (err) {
        reject(err)
      }
      resolve(newDoc)
    });
  })
}

const checkIfExists = (query) => {
  return new Promise((resolve, reject) => {
    db.findOne(query, function (err, docs) {
      if (err) {
        reject(err)
      }
      resolve(docs)
    });
  })
}

const getAll = () => {
  return new Promise((resolve, reject) => {
    db.find({}, function (err, docs) {
      if (err) {
        reject(err)
      }
      resolve(docs)
    });
  })
}

module.exports = {
  db,
  insertItem,
  checkIfExists,
  getAll
}
