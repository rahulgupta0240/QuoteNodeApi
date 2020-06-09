import express from 'express';
import {
  getAll,
  createOne,
  findById,
  updateById,
  deleteById,
} from '../controllers/quote';
import Logger from '../utils/logger';

import {verifyAdmin} from '../utils/authenticate';
const router = new express.Router();
const logger = new Logger('Routes', 'quote.js');


/**
* GET Request
* response in json with all quotes
*/
router
.get('/', async (req, res) => {
  logger.debug('Quotes GET All');
  try {
    const user = await getAll();
    res.end(JSON.stringify(user, null, 2));
  } catch (err) {
    res.status(500).json({
      status: 'failed',
      error: err,
    });
  }
});


/**
* POST request
* Create New Quote
*/

router.post('/', async (req, res) => {
  try {
    const data = req.body;
    logger.info(JSON.stringify(data, null,2));
    await createOne(data);
    res.end(JSON.stringify({ status: 'ok' }));
  } catch (err) {
    res.status(500).json({
      status: 'failed',
      error: err,
    });
  }
});



/**
* GET, PUT,DELETE request
* Get Quote with param ID
* Delete Quote with param ID
* Update Quote with param ID
*/
router
  .route('/:id')
  .get(async (req, res) => {
    try {
      logger.info(req.params.id);
      const result = await findById(req.params.id);
      res.end(JSON.stringify(result, null, 2));
    } catch (err) {
      res.end(JSON.stringify(err));
    }
  })
  .put(async (req, res) => {
    try {
      const result = await findById(req.params.id);
      if(result != null ){
      if(result.createdBy._id == req.user.id || verifyAdmin){
      const data = req.body;
      logger.info(JSON.stringify(data, null,2));
      const result = await updateById(req.params.id,data);
      res.end(JSON.stringify(result, null, 2));
    }
    else{
      res.status(401).json({
        err: 'unauthorized access',
      });
    }}else{
      res.status(404).json({
        err: 'Not FOund',
      });
    }
   } catch (err) {
      res.status(500).json({
        status: 'failed',
        error: err,
      });
    }
  })
  .delete(async (req, res) => {
    const result = await findById(req.params.id);
      if(result != null ){
      if(result.createdBy._id == req.user.id || req.user.role=='Admin'){
    logger.info(req.params.id);
   await deleteById(req.params.id);
    res.end(JSON.stringify({ status: 'deleted' }, null, 2));
      }
    else{
      res.status(401).json({
        err: 'unauthorized access',
      });
    }}else{
      res.status(404).json({
        err: 'Not FOund',
      });
    }
  });


export default router;
