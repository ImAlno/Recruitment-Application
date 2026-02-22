import PersonDTO from "../model/PersonDTO";
import db, { Database, Transaction } from "../db";
import {
  personTable,
  roleTable,
  competenceTable,
  competenceProfileTable,
  availabilityTable,
  applicationTable,
  statusTable,
} from "../db/schema";
import { RegisterRequest, AvailabilityResponse } from "../model/types/authApi";
import { InferSelectModel, eq, ne, or } from "drizzle-orm";
import {
  ApplicationSubmissionRequest,
  Competence,
  AvailabilityPeriod,
} from "../model/types/applicationApi";
import { AdminApplicatinResponse } from "../model/types/adminApplicationApi";
import { ApplicationDetailsDTO } from "../model/types/applicationDetails";
import { Validator } from "../util/Validator";
/**
 * This class is responsible for all calls to the database. There shall not be any database-related code outside this class.
 */
class DAO {
  /**
   * Creates a new instance and connects to the database.
   */
  protected database: Database;
  constructor() {
    this.database = db;
  }

  /**
   * @return {Object} database instance from drizzle
   */
  getTransactionManager(): Database {
    return this.database;
  }

  /**
   * Registers a new user into the database.
   * @param {RegisterRequest} userBody The user details for registration.
   * @param {Transaction} transactionObj The active database transaction.
   * @returns {Promise<PersonDTO>} A promise that resolves to the newly created person data transfer object.
   */
  async registerUser(userBody: RegisterRequest, transactionObj: Transaction): Promise<PersonDTO> {
    try {
      Validator.validateRegisterRequest(userBody);
      const [person] = await transactionObj.insert(personTable)
        .values({
          name: userBody.firstName,
          surname: userBody.lastName,
          pnr: userBody.personNumber,
          email: userBody.email,
          password: userBody.password,
          roleId: 2, // All new registered people are applicants          
          username: userBody.username,
        })
        .returning();
      if (!person) {                                            // double check that a person was created and returned, code should not reach
        throw new Error("Person insertion returned empty row"); // this point as an error should be thrown by the db, but this is a backup to be sure
      }
      return this.createPersonDTO(person);
    } catch (error) {
      throw new Error("Failed inserting person", { cause: error });
    }
  }

  /**
   * Checks whether a given username or email already exists in the database.
   * @param {Transaction} transactionObj The active database transaction.
   * @param {string} [username] Optional username to check.
   * @param {string} [email] Optional email to check.
   * @returns {Promise<AvailabilityResponse>} A promise resolving to an object indicating if the username or email are taken.
   */
  async checkUserExistence(
    transactionObj: Transaction,
    username?: string,
    email?: string,
  ): Promise<AvailabilityResponse> {
    try {
      const conditions = [];
      if (username) {
        Validator.validateUsernameParam(username);
        conditions.push(eq(personTable.username, username)); // creates condition: username = 'provided username'
      }
      if (email) {
        Validator.validateEmailParam(email);
        conditions.push(eq(personTable.email, email)); // creates condition: email = 'provided email'
      }

      if (conditions.length === 0) {
        return { usernameTaken: false, emailTaken: false };
      }

      const result = await transactionObj
        .select() // Selects rows from person table which have: username = 'provided username' OR email = 'provided email'
        .from(personTable)
        .where(or(...conditions));

      return {
        usernameTaken: result.some((user) => user.username === username), // checks if any of the resulting rows have a username matching the imput username
        emailTaken: result.some((user) => user.email === email), // checks if any of the resulting rows have a email matching the imput email
      };
    } catch (error) {
      throw new Error("Availability check failed", { cause: error });
    }
  }

  /**
   * Finds a user by their username.
   * @param {string} username The precise username to search for.
   * @param {Transaction} transactionObj The active database transaction.
   * @returns {Promise<PersonDTO>} A promise that resolves to the person data transfer object.
   */
  async findUser(username: string, transactionObj: Transaction): Promise<PersonDTO> {
    try {
      Validator.validateUsernameParam(username);
      const [user] = await transactionObj.select()
        .from(personTable)
        .where(eq(personTable.username, username));

      if (!user) {
        throw new Error("Person selection returned empty row => username matches no person in db or possible db error (unlikely)");
      }
      return this.createPersonDTO(user);
    } catch (error) {
      throw new Error("Failed finding user", { cause: error });
    }
  }

  /**
   * Submits a full application including competences and availability periods.
   * Transaction gets rolled back automatically if an error is thrown.
   * @param {ApplicationSubmissionRequest} submissionBody The full application submission payload.
   * @param {Transaction} transactionObj The active database transaction.
   * @returns {Promise<number>} A promise resolving to the ID of the created application.
   */
  async createApplication(
    submissionBody: ApplicationSubmissionRequest,
    transactionObj: Transaction,
  ): Promise<number> {
    Validator.validateApplicationSubmission(submissionBody);
    await this.addCompetence(
      submissionBody.competences,
      submissionBody.userId,
      transactionObj,
    );
    await this.addAvailability(
      submissionBody.availability,
      submissionBody.userId,
      transactionObj,
    );

    const [row] = await this.addApplication(
      submissionBody.userId,
      transactionObj,
    ); // expecting 1 row of the new application
    if (!row) {
      throw new Error("Application insertion returned empty row");
    }
    return row.applicationId;
  }

  // Helper to insert competence profile mappings into the database.
  private async addCompetence(
    competences: Competence[],
    userId: number,
    transactionObj: Transaction,
  ) {
    try {
      return transactionObj.insert(competenceProfileTable).values(
        competences.map((comp) => ({
          personId: userId,
          competenceId: comp.competence_id,
          yearsOfExperience: comp.years_of_experience.toString(), // yearsOfExperience is given as a number but is a numeric in Drizzle schema
        })),
      );
    } catch (error) {
      throw new Error("Competence insertion failed", { cause: error });
    }
  }

  // Helper to insert availability periods into the database.
  private async addAvailability(
    availability: AvailabilityPeriod[],
    userId: number,
    transactionObj: Transaction,
  ) {
    try {
      return transactionObj.insert(availabilityTable).values(
        availability.map((ava) => ({
          personId: userId,
          fromDate: ava.from_date,
          toDate: ava.to_date,
        })),
      );
    } catch (error) {
      throw new Error("Availability insertion failed", { cause: error });
    }
  }

  // Helper to initially insert the application record and set its status to unhandled.
  private async addApplication(userId: number, transactionObj: Transaction) {
    try {
      return transactionObj
        .insert(applicationTable)
        .values({
          personId: userId,
          statusId: 3, // All applications begin with status 3 => unhandled
          createdAt: new Date().toISOString().split("T")[0],
        })
        .returning();
    } catch (error) {
      throw new Error("Application insertion failed", { cause: error });
    }
  }

  /**
   * Retrieves all applications along with their current status and applicant information.
   * @param {Transaction} transactionObj The active database transaction.
   * @returns {Promise<AdminApplicatinResponse[]>} A promise resolving to a list of all applications overview details.
   */
  async findAll(
    transactionObj: Transaction,
  ): Promise<AdminApplicatinResponse[]> {
    try {
      const result = await transactionObj
        .select({
          applicationId: applicationTable.applicationId,
          firstName: personTable.name,
          lastName: personTable.surname,
          status: statusTable.name,
          createdAt: applicationTable.createdAt,
        })
        .from(applicationTable)
        .innerJoin(
          personTable,
          eq(applicationTable.personId, personTable.personId),
        )
        .innerJoin(
          statusTable,
          eq(applicationTable.statusId, statusTable.statusId),
        );
      return result;
    } catch (error) {
      throw new Error("Failed fetching applications", { cause: error });
    }
  }

  /**
   * Fetches the full details of a specific application by its ID.
   * Includes applicant information, competences, and availability.
   * @param {Transaction} transactionObj The active database transaction.
   * @param {number} applicationId The ID of the application.
   * @returns {Promise<ApplicationDetailsDTO>} A promise resolving to the detailed breakdown of the application.
   */
  async findById(transactionObj: Transaction, applicationId: number): Promise<ApplicationDetailsDTO> {
    Validator.validateApplicationIdParam(applicationId);
    const applicationInfo = await this.getApplicationInfo(
      transactionObj,
      applicationId,
    );

    const competences = await this.getCompetence(
      transactionObj,
      applicationInfo.personId,
    );
    const availability = await this.getAvailability(transactionObj, applicationInfo.personId);

    return {
      applicationId: applicationInfo.applicationId,
      status: applicationInfo.status,
      createdAt: applicationInfo.createdAt,
      competences,
      availability,
      applicant: {
        personId: applicationInfo.personId,
        firstName: applicationInfo.firstName,
        lastName: applicationInfo.lastName,
        email: applicationInfo.email,
      },
    };
  }

  // Helper retrieving availability periods associated with a particular person.
  private async getAvailability(transactionObj: Transaction, personId: number) {
    try {
      const result = await transactionObj
        .select({
          fromDate: availabilityTable.fromDate,
          toDate: availabilityTable.toDate,
        })
        .from(availabilityTable)
        .where(eq(availabilityTable.personId, personId));

      if (result.length === 0) {
        throw new Error("No availabilies found");
      }
      return result;
    } catch (error) {
      throw new Error("Failed getting availablities", { cause: error });
    }
  }

  // Helper retrieving competence profiles linked with a given person id.
  private async getCompetence(transactionObj: Transaction, personId: number) {
    try {
      const result = await transactionObj
        .select({
          competenceId: competenceTable.competenceId,
          competenceName: competenceTable.name,
          yearsOfExperience: competenceProfileTable.yearsOfExperience,
        })
        .from(competenceProfileTable)
        .innerJoin(
          competenceTable,
          eq(competenceProfileTable.competenceId, competenceTable.competenceId),
        )
        .where(eq(competenceProfileTable.personId, personId));

      if (result.length === 0) {
        throw new Error("No competences found");
      }
      return result;
    } catch (error) {
      throw new Error("Failed getting competences", { cause: error });
    }
  }

  // Internal helper that fetches the core generic info regarding an application (status, applicant details)
  private async getApplicationInfo(
    transactionObj: Transaction,
    applicationId: number,
  ) {
    try {
      const [result] = await transactionObj
        .select({
          applicationId: applicationTable.applicationId,
          personId: personTable.personId,
          firstName: personTable.name,
          lastName: personTable.surname,
          email: personTable.email,
          status: statusTable.name,
          createdAt: applicationTable.createdAt,
        })
        .from(applicationTable)
        .innerJoin(
          personTable,
          eq(applicationTable.personId, personTable.personId),
        )
        .innerJoin(
          statusTable,
          eq(applicationTable.statusId, statusTable.statusId),
        )
        .where(eq(applicationTable.applicationId, applicationId))
        .limit(1);

      if (!result) {
        throw new Error(`Application with id ${applicationId} does not exist`); // Should be 404 but whatever... you can't win them all :)
      }
      return result;
    } catch (error) {
      throw new Error(`Failed fetching application: ${applicationId}`, { cause: error });
    }
  }

  // Helper to construct a Person Data Transfer Object explicitly mapping database fields.
  private createPersonDTO(
    personTableDBrow: InferSelectModel<typeof personTable>,
  ): PersonDTO {
    const roleName = personTableDBrow.roleId === 1 ? "recruiter" : "applicant";
    return new PersonDTO(
      personTableDBrow.personId,
      personTableDBrow.name || "",
      personTableDBrow.surname || "",
      personTableDBrow.username || "",
      personTableDBrow.email || "",
      personTableDBrow.pnr || "",
      roleName,
      personTableDBrow.password || "",
    );
  }
}

export default DAO;
