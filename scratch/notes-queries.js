'use strict';

const express = require('express');

// Create an router instance (aka "mini-app")
const router = express.Router();

const knex = require('../knex');

// knex.select(1).then(res => console.log(res)).next();


router.get('/notes', (req, res, next) => {
  // const { searchTerm } = req.query;
  /* 
  notes.filter(searchTerm)
    .then(list => {
      res.json(list);
    })
    .catch(err => next(err)); 
  */
  console.log(req.query.searchTerm);
  next();
});