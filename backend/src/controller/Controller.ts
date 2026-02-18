import DAO from "../integration/DAO";
import PersonDTO from "../model/PersonDTO";
import { Database } from "../db";
import { RegisterRequest, AvailabilityResponse } from "../model/types/authApi";
import { ApplicationSubmissionRequest } from "../model/types/applicationApi";
import { AdminApplicatinResponse } from "../model/types/adminApplicationApi";
import { ApplicationDetailsDTO } from "../model/types/applicationDetails";
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
      return await this.dao.registerUser(userBody, transactionObj);
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
      if (user.password !== password) {
        return null;  // If we were to throw an error, how do we differentiate db thrown errors from controller thrown errors? custom made error classes? // TODO <=
      }

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
        return await this.dao.findAll(transactionObj);
      },
    );
  }

  async getApplicationById(
    applicationId: number,
  ): Promise<ApplicationDetailsDTO> {
      return await this.database.transaction(
        async (transactionObj) => {
          return await this.dao.findById(transactionObj, applicationId);
        },
      ); 
  }

  // TODO: code in Authorization.ts needs to be updated to only expect a "good" user or an error
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
        return await this.dao.createApplication(submissionBody, transactionObj);
      });
  }
  // TODO Add methods like: registerUser, findUser, login etc to handle bussiness logic and make calls to integration layer
}
export default Controller;
