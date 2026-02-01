'use strict';
/**
  const WError = require('verror').WError;
  const Validators = require('../util/Validators');
 */

import { PersonDTO } from "../model/PersonDTO";

/**
 * This class is responsible for all calls to the database. There shall not // ! Need to look into DrizzleORM and see how to convert from sequlize -> DrizzleORM
 * be any database-related code outside this class.
 */
class DAO {
  /**
   * Creates a new instance and connects to the database.
   */
  constructor() {
    /** // TODO need to replace Sequelize with DrizzleORM, env variables can probably stay the same
     const namespace = cls.createNamespace('chat-db');
     Sequelize.useCLS(namespace);
     
     // Determine database host based on environment
     const isDocker = process.env.DOCKER_DB === 'true';
     const host = isDocker ? 'postgres' : process.env.DB_HOST;
     
     this.database = new Sequelize(
         process.env.DB_NAME,
         process.env.DB_USER,
         process.env.DB_PASS,
         {
           host: host, 
           dialect: process.env.DB_DIALECT,
           logging: process.env.NODE_ENV === 'development' ? console.log : false,
           pool: {
             max: 5,
             min: 0,
             acquire: 30000,
             idle: 10000
           }
         },
     );
     User.createModel(this.database); // TODO Sequlize models from model layer, need to create new models and connect with DrizzleORM
     Msg.createModel(this.database);
      */
  }

  /** // TODO Drizzle update required
   * @return {Object} The sequelize transaction manager, which is actually the
   *                  database object. This method is called
   *                  <code>getTransactionMgr</code> since the database is only
   *                  supposed to be used for transaction handling in higher
   *                  layers.
   */
  getTransactionManager() {
    return this.database;
  }

  /** // TODO Drizzle update required
   * Creates non-existing tables, existing tables are not touched.
   *
   * @throws Throws an exception if the database could not be created.
   */
  async createTables() {
    try {
      await this.database.authenticate();
      await this.database.sync({ alter: false, force: false }); // ? How does sync work?
    } catch (err) {
      throw new WError(
        {
          cause: err,
          info: { ChatDAO: 'Failed to call authenticate and sync.' },
        },
        'Could not connect to database.',
      );
    }
  }

  // TODO Add methods which match the requirements of the Controller 

  // ? Old methods as Example:
  /**
   * Searches for a user with the specified username.
   *
   * @param {string} username The username of the searched user.
   * @return {array} An array containing all users with the
   *                 specified username. Each element in the returned
   *                 array is a userDTO. The array is empty if no matching
   *                 users were found.
   * @throws Throws an exception if failed to search for the specified user.
   */
  /** // ? Remove here (to see old methods)
  async findUserByUsername(username) {
    try {
      Validators.isNonZeroLengthString(username, 'username');
      Validators.isAlnumString(username, 'username');
      const users = await User.findAll({
        where: {username: username},
      });
      return users.map((userModel) => this.createUserDto(userModel));
    } catch (err) {
      throw new WError(
          {
            cause: err,
            info: {
              ChatDAO: 'Failed to search for user.',
              username: username,
            },
          },
          `Could not search for user ${username}.`,
      );
    }
  }

  // eslint-disable-next-line require-jsdoc
  createUserDto(userModel) {
    return new UserDTO(
        userModel.id,
        userModel.username,
        userModel.loggedInUntil,
        userModel.createdAt,
        userModel.updatedAt,
        userModel.deletedAt,
    );
  }
  */ // ? Remove here
}

export default DAO;