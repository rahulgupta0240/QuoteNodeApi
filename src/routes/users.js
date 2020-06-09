import express from 'express';
import {
  getAll,
  findById,
  deleteById,
  updateById
} from '../controllers/users';
import Logger from '../utils/logger';
import {verifyAdmin} from '../utils/authenticate';

const router = new express.Router();
const logger = new Logger('Routes', 'users.js');


/**
* GET request
* Get All User
* VerifyAdmin MiddleWare For Admin Access Only
*/
router.get('/',verifyAdmin, async (req, res) => {
  logger.info('Users GET All');
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
* GET, PUT,DELETE request
* Get User with param id
* Delete User with param id
* Update User with param id
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
      if(result._id == req.user.id || verifyAdmin){
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
  .delete(verifyAdmin, async (req, res) => {

    if(req.params.id == req.user.id){
      res.status(403).json({
        error: 'Admin User Can not be Deleted',
      });

    }
    else{
      logger.info(req.params.id);
      await deleteById(req.params.id);
      res.end(JSON.stringify({ status: 'deleted' }, null, 2));
    }
  });


export default router;
