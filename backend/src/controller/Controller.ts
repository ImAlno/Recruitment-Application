import DAO from "../integration/DAO";
import PersonDTO from "../model/PersonDTO";
import { Database } from "../db";
import { RegisterRequest, AvailabilityResponse } from "../model/types/authApi";
import { ApplicationSubmissionRequest } from "../model/types/applicationApi";
import { AdminApplicatinResponse } from "../model/types/adminApplicationResponse";
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
      let registeredUser = await this.dao.registerUser(
        userBody,
        transactionObj,
      );
      return registeredUser;
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
      if (!user || user.password !== password) {
        return null;
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

  async isLoggedIn(
    username: string,
  ): Promise<Pick<PersonDTO, "id" | "username" | "role"> | null> {
    return this.database.transaction(async (transactionObj) => {
      const user = await this.dao.findUser(username, transactionObj);
      if (!user) {
        return null;
      }
      return {
        id: user.id,
        username: user.username,
        role: user.role,
      };
    });
  }

  async createApplication(
    submissionBody: ApplicationSubmissionRequest,
  ): Promise<number | null> {
    try {
      const applicationId = await this.database.transaction(
        async (transactionObj) => {
          return await this.dao.createApplication(
            submissionBody,
            transactionObj,
          );
        },
      );
      return applicationId;
    } catch (error) {
      console.error("Failed creating application submission:", error);
      return null;
    }
  }

  async getAllApplications(): Promise<AdminApplicatinResponse[]> {
    try {
      const applicaitons = await this.database.transaction(
        async (transactionObj) => {
          return await this.dao.findAll(transactionObj);
        },
      );
      return applicaitons ?? [];
    } catch (error) {
      console.error("Failed fetching applications");
      return [];
    }
  }

  async getApplicationById(
    applicationId: number,
  ): Promise<ApplicationDetailsDTO | null> {
    try {
      const application = await this.database.transaction(
        async (transactionObj) => {
          return await this.dao.findById(transactionObj, applicationId);
        },
      );
      return application;
    } catch (error) {
      console.error("Error fetching application: ", error);
      return null;
    }
  }
  // TODO Add methods like: registerUser, findUser, login etc to handle bussiness logic and make calls to integration layer
}
export default Controller;
