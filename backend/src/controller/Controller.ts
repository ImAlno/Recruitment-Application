import DAO from "../integration/DAO";
import PersonDTO from "../model/PersonDTO";
import bcrypt from 'bcrypt';
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

  /**
   * Registers a new user account and persists it to the database.
   *
   * @param userBody The user registration data.
   * @returns The registered user as a PersonDTO.
   */
  async register(userBody: RegisterRequest): Promise<PersonDTO> {
    return this.database.transaction(async (transactionObj) => {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userBody.password, saltRounds);
      const secureUserBody = {
        ...userBody,
        password: hashedPassword
      };
      return await this.dao.registerUser(secureUserBody, transactionObj);
    });
  }

  /**
   * Checks if a given username or email is available for registration.
   *
   * @param username Optional username to check.
   * @param email Optional email to check.
   * @returns An object indicating the availability status of the provided credentials.
   */
  async isAvailable(
    username?: string,
    email?: string,
  ): Promise<AvailabilityResponse> {
    return this.database.transaction(async (transactionObj) => {
      return await this.dao.checkUserExistence(transactionObj, username, email);
    });
  }

  /**
   * Authenticates a user with a username and password.
   *
   * @param username The user's username.
   * @param password The user's password.
   * @returns A PersonDTO if authentication succeeds, or null if it fails.
   */
  async login(username: string, password: string): Promise<PersonDTO | null> {
    return this.database.transaction(async (transactionObj) => {
      const user = await this.dao.findUser(username, transactionObj);
      if (!await bcrypt.compare(password, user.password!)) {
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

  /**
   * Retrieves all submitted job applications from the database.
   *
   * @returns An array containing all applications.
   */
  async getAllApplications(): Promise<AdminApplicatinResponse[]> {
    return await this.database.transaction(
      async (transactionObj) => {
        return await this.dao.findAll(transactionObj);
      },
    );
  }

  /**
   * Retrieves detailed information about a specific job application by its ID.
   *
   * @param applicationId The unique ID of the application.
   * @returns The detailed application data.
   */
  async getApplicationById(
    applicationId: number,
  ): Promise<ApplicationDetailsDTO> {
    return await this.database.transaction(
      async (transactionObj) => {
        return await this.dao.findById(transactionObj, applicationId);
      },
    );
  }

  /**
   * Extracts essential details of a logged-in user by username.
   *
   * @param username The username of the user.
   * @returns An object containing the user's id, username, and role.
   */
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

  /**
   * Submits and saves a new job application.
   *
   * @param submissionBody The data containing the completely filled application submission.
   * @returns The newly created application ID.
   */
  async createApplication(submissionBody: ApplicationSubmissionRequest): Promise<number> {
    return await this.database.transaction(async (transactionObj) => {
      return await this.dao.createApplication(submissionBody, transactionObj);
    });
  }
  // TODO Add methods like: registerUser, findUser, login etc to handle bussiness logic and make calls to integration layer
}
export default Controller;
