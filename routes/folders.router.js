'use strict';

const express = require('express');
const router = express.Router();

const knex = require('../knex');

// const { UNIQUE_VIOLATION } = require('pg-error-constants');


// Get All (and search by query)
/* ========== GET/READ ALL FOLDERS ========== */
router.get('/folders', (req, res, next) => {
  // const { searchTerm } = req.query;
  // explain: don't need this ^
  /* 
  notes.filter(searchTerm)
    .then(list => {
      res.json(list);
    })
    .catch(err => next(err)); 
  */

  // console.log(searchTerm);
  
  knex
    .select('id', 'name')
    .from('folders')
    .then(results => {
      res.json(results);
    })
    .catch(next);
});

/* ========== GET/READ SINGLE FOLDERS ========== */
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

  // console.log(noteId);
  

  knex
    .select('id', 'name')
    .where('id', noteId)
    .from('folders')
    .then(results => {
      if (results) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(next);
});

/* ========== POST/CREATE ITEM ========== */
router.post('/folders', (req, res, next) => {
  const { name } = req.body;
  
  
  // let noteId;
  
  /***** Never trust users - validate input *****/
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }
  
  const newItem = { name };

  /*
  notes.create(newItem)
    .then(item => {
      if (item) {
        res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
      } 
    })
    .catch(err => next(err));
  */

  // Insert new note, instead of returning all the fields, just return the new `id`
  knex
    .insert(newItem)
    .into('folders')
    .returning('id', 'name')
    .then(([results]) => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => {
      if (err.code === UNIQUE_VIOLATION && err.constraint === 'folders_name_key') {
        err = new Error('Folder name is already taken');
        err.status = 409;
      } 
      next(err);
    });
});

module.exports = router;