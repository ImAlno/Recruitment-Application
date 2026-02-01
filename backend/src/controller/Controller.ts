import DAO from '../integration/DAO';
import PersonDTO from '../model/PersonDTO';
import db, { Database } from '../db';
import { RegisterRequest } from '../model/RegisterRequest';

/**
 * The application's controller. No other class shall call the model or
 * integration layer.
 */
export class Controller {
  protected dao: DAO;
  protected database: Database;
  /**
  * Creates a new instance.
  */
  constructor() {
    this.dao = new DAO();
    this.database = this.dao.getTransactionManager();
  }

  /**
   * Instantiates a new Controller object.
   *
   * @return {Controller} The newly created controller.
   */
  static async createController(): Promise<Controller> {
    const contr = new Controller();
    return contr;
  }

  async register(userBody: RegisterRequest): Promise<PersonDTO> {
    return this.database.transaction(async (transactionObj) => {
      let registeredUser = await this.dao.registerUser(userBody, transactionObj);
      return registeredUser;
    });
  }

  async isAvailable(username?: string, email?: string) {
    return await this.dao.checkUserExistence(username, email);
  }

  // TODO Add methods like: registerUser, findUser, login etc to handle bussiness logic and make calls to integration layer
}
export default Controller;