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
import { AdminApplicatinResponse } from "../model/types/adminApplicationResponse";
import { ApplicationDetailsDTO } from "../model/types/applicationDetails";
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

  // TODO: fix proper error handling
  async registerUser(
    userBody: RegisterRequest,
    transactionObj: Transaction,
  ): Promise<PersonDTO> {
    try {
      const result = await transactionObj
        .insert(personTable)
        .values({
          name: userBody.firstName,
          surname: userBody.lastName,
          pnr: userBody.personNumber,
          email: userBody.email,
          password: userBody.password,
          roleId: 2, // TODO: look into better solution
          username: userBody.username,
        })
        .returning();
      if (result.length === 0) {
        throw new Error("Failed to register user");
      }
      return this.createPersonDTO(result[0]!);
    } catch (error) {
      throw error;
    }
  }

  async checkUserExistence(
    transactionObj: Transaction,
    username?: string,
    email?: string,
  ): Promise<AvailabilityResponse> {
    try {
      const conditions = [];
      if (username) conditions.push(eq(personTable.username, username)); // creates condition: username = 'provided username'
      if (email) conditions.push(eq(personTable.email, email)); // creates condition: email = 'provided email'

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
      throw new Error("Availability check failed in db", { cause: error });
    }
  }

  // TODO: fix proper error handling
  async findUser(
    username: string,
    transactionObj: Transaction,
  ): Promise<PersonDTO | null> {
    try {
      const result = await transactionObj
        .select()
        .from(personTable)
        .where(eq(personTable.username, username));

      if (result.length === 0) {
        //* throw error to rollback transaction
        return null;
      }

      return this.createPersonDTO(result[0]!);
    } catch (error) {
      throw new Error("Failed finding user", { cause: error });
    }
  }

  // Transaction gets rolled back automatically if an error is thrown
  async createApplication(
    submissionBody: ApplicationSubmissionRequest,
    transactionObj: Transaction,
  ): Promise<number> {
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
  async findById(transactionObj: Transaction, applicationId: number): Promise<ApplicationDetailsDTO |null> {
    try {
      
      const applicationInfo = await this.getApplicationInfo(
        transactionObj,
        applicationId,
      );
      if (!applicationInfo) return null;
  
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
    } catch (error) {
      throw new Error("Failed fetching applicantion by id", {cause: error})
    }
  }

  private async getAvailability(transactionObj: Transaction, personId: number) {
    return transactionObj
      .select({
        fromDate: availabilityTable.fromDate,
        toDate: availabilityTable.toDate,
      })
      .from(availabilityTable)
      .where(eq(availabilityTable.personId, personId));
  }

  private async getCompetence(transactionObj: Transaction, personId: number) {
    return transactionObj
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
  }

  private async getApplicationInfo(
    transactionObj: Transaction,
    applicationId: number,
  ) {
    const result = await transactionObj
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
    return result[0] ?? null;
  }

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
