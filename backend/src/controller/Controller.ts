import DAO from "../integration/DAO";
import PersonDTO from "../model/PersonDTO";
import bcrypt from 'bcrypt';
import { Database } from "../db";
import { RegisterRequest, AvailabilityResponse } from "../model/types/authApi";
import { ApplicationSubmissionRequest } from "../model/types/applicationApi";
import { AdminApplicatinResponse } from "../model/types/adminApplicationApi";
import { ApplicationDetailsDTO } from "../model/types/applicationDetails";
import Logger from "../util/Logger";
// import jwt from 'jsonwebtoken';

/**
 * The application's controller. No other class shall call the model or
 * integration layer.
 */
export class Controller {
  private static logger = new Logger();
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
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userBody.password, saltRounds);
      const secureUserBody = {
        ...userBody,
        password: hashedPassword
      };
      const result = await this.dao.registerUser(secureUserBody, transactionObj);

      Controller.logger.logEvent('USER_REGISTERED', {
        userId: result.id,
        username: result.username,
        email: result.email,
      });

      return result;
    });
  }

  async isAvailable(
    username?: string,
    email?: string,
  ): Promise<AvailabilityResponse> {
    return this.database.transaction(async (transactionObj) => {
      return await this.dao.checkUserExistence(transactionObj, username, email);
    });
  }

  async login(username: string, password: string): Promise<PersonDTO | null> {
    return this.database.transaction(async (transactionObj) => {
      const user = await this.dao.findUser(username, transactionObj);
      if (!await bcrypt.compare(password, user.password!)) {
        return null;
      }

      Controller.logger.logEvent('USER_LOGGED_IN', {
        userId: user.id,
        username: user.username,
        email: user.email,
      });

      return new PersonDTO(
        user.id,
        user.firstName,
        user.lastName,
        user.username,
        user.email,
        user.personNumber,
        user.role,
      );
    });
  }

  async getAllApplications(): Promise<AdminApplicatinResponse[]> {
    return await this.database.transaction(
      async (transactionObj) => {
        const result = await this.dao.findAll(transactionObj);

        Controller.logger.logEvent('ALL_APPLICATIONS_RETRIEVED', {
          count: result.length,
        });
        return result;
      },
    );
  }

  async getApplicationById(
    applicationId: number,
  ): Promise<ApplicationDetailsDTO> {
    return await this.database.transaction(
      async (transactionObj) => {
        const result = await this.dao.findById(transactionObj, applicationId);

        Controller.logger.logEvent('APPLICATION_RETRIEVED', {
          applicationId: result.applicationId,
          status: result.status,
          createdAt: result.createdAt,
        });
        return result;
      },
    );
  }

  async isLoggedIn(username: string): Promise<Pick<PersonDTO, 'id' | 'username' | 'role'>> {
    return this.database.transaction(async (transactionObj) => {
      const user = await this.dao.findUser(username, transactionObj);
      return {
        id: user.id,
        username: user.username,
        role: user.role
      };
    });
  }

  async createApplication(submissionBody: ApplicationSubmissionRequest): Promise<number> {
    return await this.database.transaction(async (transactionObj) => {
      const result = await this.dao.createApplication(submissionBody, transactionObj);

      Controller.logger.logEvent('APPLICATION_CREATED', {
        applicationId: result,
        userId: submissionBody.userId,
      });

      return result;
    });
  }
  // TODO Add methods like: registerUser, findUser, login etc to handle bussiness logic and make calls to integration layer
}
export default Controller;
