import DAO from '../integration/DAO';
import PersonDTO from '../model/PersonDTO';
import db, { Database } from '../db';
import { RegisterRequest } from '../model/types/authApi';
//import jwt from 'jsonwebtoken';
import ApplicationDAO from '../integration/ApplicationDAO';
import { CompetenceDTO, CreateApplicationDTO } from '../model/CompetenceDTO';

/**
 * The application's controller. No other class shall call the model or
 * integration layer.
 */
export class Controller {
  protected dao: DAO;
  protected database: Database;
  protected applicationDAO: ApplicationDAO
  /**
  * Creates a new instance.
  */
  constructor() {
    this.dao = new DAO();
    this.database = this.dao.getTransactionManager();
    this.applicationDAO = new ApplicationDAO();
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

  async createApplication(applicantId:number, data:CreateApplicationDTO): Promise<void>{
    return this.database.transaction(async (tx) => {
      try{
      
      for (const competence of data.competences) {
        await this.applicationDAO.addCompetence(applicantId, competence, tx);
      }

      for (const availability of data.availability) {
        await this.applicationDAO.addAvailability(applicantId, availability, tx);
      }

    }catch(err){
      console.error("Transaction failed", err)
      throw err;
    }
    })
  }
  // TODO Add methods like: registerUser, findUser, login etc to handle bussiness logic and make calls to integration layer
}
export default Controller;