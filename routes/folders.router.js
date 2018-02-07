const express = require('express');
const knex = require('../knex');

const router = express.Router();

// Get All (and search by query)
/* ========== GET/READ ALL NOTES ========== */
router.get('/folders', (req, res, next) => {
  const { searchTerm } = req.query;
  /* 
  notes.filter(searchTerm)
    .then(list => {
      res.json(list);
    })
    .catch(err => next(err)); 
  */

  console.log(searchTerm);
  
  knex
    .select('notes.id', 'title', 'content', 'folder_id', 'folders.name as folder_name')
    .from('notes')
    .leftJoin('folders', 'notes.folder_id', 'folders.id')
    .where(function () {
      if (searchTerm) {
        this.where('title', 'like', `%${searchTerm}%`);
      }
    })
    .where(function () {
      if (req.query.folderId) {
        this.where('folder_id', req.query.folderId)
      }
    })
    .then(results => {
      res.json(results);
      // console.log(results);
    })
    .catch(err => {
      console.error(err);
    })
  
});

/* ========== GET/READ SINGLE NOTES ========== */
router.get('/folders/:id', (req, res, next) => {
  const noteId = req.params.id;

  /*
  notes.find(noteId)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(err => next(err));
  */

  console.log(noteId);
  

  knex
    .select('notes.id', 'title', 'content', 'folder_id', 'folders.name as folder_name')
    .from('notes')
    .leftJoin('folders', 'notes.folder_id', 'folders.id')    
    .where('notes.id', noteId)
    // .where(function () {
    //   if (req.query.folderId) {
    //     this.where('folder_id', req.query.folderId)
    //   }
    // })
    .then(result => {
      if (result) {
        // console.log('PRINTING RESULT: ', result);
        
        res.json(result[0]);
      } else {
        next(); // fall-through to 404 handler
      }
    })
    .catch(next);

});

/* ========== POST/CREATE ITEM ========== */
router.post('/folders', (req, res, next) => {
  const { title, content } = req.body;
  
  const newItem = { title, content };
  /***** Never trust users - validate input *****/
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  /*
  notes.create(newItem)
    .then(item => {
      if (item) {
        res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
      } 
    })
    .catch(err => next(err));
  */

  knex
    .insert(newItem)
    .into('notes')
    .returning(['id', 'title', 'content'])
    .then((result) => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => {console.error(err);});

});

module.exports = router;