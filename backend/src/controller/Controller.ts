'use strict';

//const Validators = require('../util/Validators');  // ? fix later if implemented
import { DAO } from 'integration/DAO';
import { ApplicantDTO } from 'model/ApplicantDTO';

/**
 * The application's controller. No other class shall call the model or
 * integration layer.
 */
export class Controller {
  /**
   * Creates a new instance.
   */
  protected dao: DAO;
  protected transactionManager: DAO.getTransactionManager; // TODO Maybe need to change to a type later??
  constructor() {
    this.dao = new DAO();
    this.transactionManager = this.dao.getTransactionMgr();
  }

  /**
   * Instantiates a new Controller object.
   *
   * @return {Controller} The newly created controller.
   */
  static async createController(): Promise<Controller> {
    const contr = new Controller();
    await contr.dao.createTables(); // TODO Not sure how we will handle table creation
    return contr;
  }

  // TODO Add methods like: registerUser, findUser, login etc to handle bussiness logic and make calls to integration layer
}
export default Controller;