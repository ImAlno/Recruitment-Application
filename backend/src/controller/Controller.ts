import DAO from '../integration/DAO';
import PersonDTO from '../model/PersonDTO';
import { Database } from '../db';
import { RegisterRequest } from '../model/types/authApi';
import { ApplicationSubmissionRequest } from '../model/types/applicationApi';
// import jwt from 'jsonwebtoken';

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

  async login(username: string, password: string): Promise<PersonDTO | null> {
    return this.database.transaction(async (transactionObj) => {
        const user = await this.dao.findUser(username);
        if (!user || user.password !== password) {
          return null;
        }
        
        return new PersonDTO(user.id, user.firstName, user.lastName,user.username, user.email, user.personNumber, user.role);
    });
  }

  async isLoggedIn(username: string): Promise<Pick<PersonDTO, 'id' | 'username' | 'role'> | null> {
    return this.database.transaction(async (transactionObj) => {
        const user = await this.dao.findUser(username);
        if (!user) {
          return null;
        }
        return {
          id: user.id,
          username: user.username,
          role: user.role
        };
    });
  }

  async createApplication(submissionBody: ApplicationSubmissionRequest): Promise<number | null>{
    return this.database.transaction(async (transactionObj) => {
        const applicationId = await this.dao.createApplication(submissionBody, transactionObj);
        if (!applicationId) {
          return null;
        }
        return applicationId;
    });
  }
  
  // TODO Add methods like: registerUser, findUser, login etc to handle bussiness logic and make calls to integration layer
}
export default Controller;