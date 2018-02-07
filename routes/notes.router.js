'use strict';

// SELECT * FROM table

const express = require('express');
const knex = require('../knex');

// Create an router instance (aka "mini-app")
const router = express.Router();


// TEMP: Simple In-Memory Database
/* 
const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);
*/

// Get All (and search by query)
/* ========== GET/READ ALL NOTES ========== */
router.get('/notes', (req, res, next) => {
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
    .where(function () {
      if (searchTerm) {
        this.where('title', 'like', `%${searchTerm}%`);
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
router.get('/notes/:id', (req, res, next) => {
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
    .where('notes.id', noteId)
    .then(result => {
      if (result) {
        console.log('PRINTING RESULT: ', result);
        
        res.json(result[0]);
      } else {
        next(); // fall-through to 404 handler
      }
    })
    .catch(next);

});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/notes/:id', (req, res, next) => {
  const noteId = req.params.id;
  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateableFields = ['title', 'content'];

  const updateItem = {
    title: title,
    content: content
  }

  updateableFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  /***** Never trust users - validate input *****/
  if (!updateObj.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  /*
  notes.update(noteId, updateObj)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(err => next(err));
  */

  knex('notes')
    .update(updateItem)
    .where('id', noteId)
    .returning(['id', 'title', 'content'])
    .then((result) => {
      res.json(result)
    })
    .catch(err => {
      console.error(err);
    })
});

/* ========== POST/CREATE ITEM ========== */
router.post('/notes', (req, res, next) => {
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

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/notes/:id', (req, res, next) => {
  const id = req.params.id;
  
  /*
  notes.delete(id)
    .then(count => {
      if (count) {
        res.status(204).end();
      } else {
        next();
      }
    })
    .catch(err => next(err));
  */

  knex
    .del()
    .where('id', req.params.id)
    .from('notes')
    .then(count => {
      if (count) {
        res.status(204).end();
      } else {
        next(); // err 404
      }
    })
    .catch(next);
});

module.exports = router;