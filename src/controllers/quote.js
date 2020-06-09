
import Quote from '../models/quote';
import Logger from '../utils/logger';

/**
 * Quote Controller
 */
const logger = new Logger('Controller', 'quote.js');

/**
 * @async
 * Get All Quotes
 */
export const getAll = async () => {
  logger.silly('in getAll');
  try {
    //Populated User Ref Data using populate() To See User info
    return await Quote.find().populate('createdBy');
  } catch (err) {
    logger.error(err);
    throw new Error(`getAll Err: ${err}`);
  }
};
/**
 * @async
 * Create New Quote
 *  @param {data}
 */
export const createOne = async (data) => {
  logger.silly('in createOne');
  try {
      logger.info(data);
    await Quote.create(data);
  } catch (err) {
    logger.error(err);
    throw new Error(`createOne Err: ${err}`);
  }
};


/**
 * @async
 * Find Quote by id
 *  @param {id}
 */
export const findById = async (id) => {
  try {
    logger.silly('in findById');
    //Populated User Ref Data using populate() To See User info
      return await Quote.findById(id).populate('createdBy');
  } catch (err) {
    logger.error(err);
    throw new Error(`findById Err: ${err}`);
  }
};
/**
 * @async
 * Delete Quote By id
 * @param {id}
 */
export const deleteById = async (id) => {
  logger.silly('in deleteById');
  try {
    return await Quote.findByIdAndDelete(id, { active: false });
  } catch (err) {
    logger.error(err);
    throw new Error(`deleteById Err: ${err}`);
  }
};
/**
 * @exports
 * Update Quote by id
 * @param {id,data}
 */
export const updateById = async (id,data) => {
  logger.silly('in updateById');
  try {
    //Populated User Ref Data using populate() To See User info
      return await Quote.findOneAndUpdate({_id:id},data,{new:true,returnNewDocument:true} ).populate('createdBy');
  } catch (err) {
    logger.error(err);
    throw new Error(`updateById Err: ${err}`);
  }
};

