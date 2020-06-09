import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/users';
import Logger from '../utils/logger';
import {config} from '../config';

/**
 * Users Controller
 */
const logger = new Logger('Controller', 'users.js');
/**
 * @async
 * getAll Users
 */
export const getAll = async () => {
  logger.silly('in getAll');
  try {
    return await User.find();
  } catch (err) {
  logger.error(err);
    throw new Error(`getAll Err: ${err}`);
  }
};

/**
 * @async
 * Create User
 *  @param {data}
 */
export const createOne = async (data) => {
  logger.silly('in createOne');
  try {
    await User.create(data);
  } catch (err) {
  logger.error(err);
    throw new Error(`createOne Err: ${err}`);
  }
};
/**
 * @async
 * FInd User by Username
 * @param {username}
 */
export const findByUsername = async (username) => {
  logger.silly('in findByUsername');
  try {
    return await User.findOne({username:username});
  } catch (err) {
    logger.error(err);
    throw new Error(`findByEmail Err: ${err}`);
  }
};
/**
 * @async
 * Find User by id
 * @param {id}
 */
export const findById = async (id) => {
  logger.silly('in findById');
  try {
    return await User.findById(id);
  } catch (err) {
    logger.error(err);
    throw new Error(`findById Err: ${err}`);
  }
};

/**
 * @async
 * Update User details by id
 * @param {id,data}
 */
export const updateById = async (id,data) => {
  logger.silly('in updateById');
  try {
	const result=await findById(id);
 if(result.password != data.password){
 // eslint-disable-next-line require-atomic-updates
 data.password = await bcrypt.hashSync(data.password, 10);
	}
    return await User.findOneAndUpdate({_id:id},data,{new:true,returnNewDocument:true} );

  } catch (err) {
    logger.error(err);
    throw new Error(`updateById Err: ${err}`);
  }
};
/**
 * @async
 * Delete User by id
 * @param {id}
 */
export const deleteById = async (id) => {
  logger.silly('in deleteById');
  try {
    return await User.findByIdAndDelete(id, { active: false });
  } catch (err) {
    logger.error(err);
    throw new Error(`deleteById Err: ${err}`);
  }
};



/**
 * @async
 * User Registration method
 * @param {data}
 */

export const register = async (body) => {
  logger.silly('in register');
  const data = { ...body };
  logger.info(JSON.stringify(data, null, 2));
  data.password = await bcrypt.hashSync(data.password, 10);
  await createOne(data);
};
/**
 * @async
 * User Login method
 * @param {body}
 */
export const login = async (body) => {
  const data = { ...body };
  logger.info(JSON.stringify(data, null, 2));
  try {
    const user = await findByUsername(data.username );
    const isAuth = await bcrypt.compareSync(data.password, user.password);

    logger.info(user._id);
     if (isAuth) {
     const token= jwt.sign({ id: user._id }, config.secretkey);

      logger.info(token);
      return {
        id: user._id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        token: token,
        role: user.role
    };
       }
    return false;
  } catch (err) {
    logger.error(err);
    return false;
  }
};
