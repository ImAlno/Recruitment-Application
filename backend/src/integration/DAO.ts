import PersonDTO from "../model/PersonDTO";
import db, { Database, Transaction } from "../db";
import { personTable, roleTable, competenceTable, competenceProfileTable, availabilityTable } from "../db/schema";
import { RegisterRequest } from "../model/RegisterRequest";
import { InferSelectModel, eq, or } from "drizzle-orm";
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

  async registerUser(userBody: RegisterRequest, transactionObj?: Transaction) {
    const queryRunner = transactionObj || this.database;
    try {
      const result = await queryRunner.insert(personTable)
        .values({
          name: userBody.firstName,
          surname: userBody.lastName,
          pnr: userBody.personNumber,
          email: userBody.email,
          password: userBody.password,
          roleId: 2,                    // TODO: look into better solution
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

  async checkUserExistence(username?: string, email?: string) {
    try {
      const conditions = [];
      if (username) conditions.push(eq(personTable.username, username));
      if (email) conditions.push(eq(personTable.email, email));

      if (conditions.length === 0) return { usernameTaken: false, emailTaken: false };

      const result = await this.database
        .select()
        .from(personTable)
        .where(or(...conditions));

      return {
        usernameTaken: result.some(user => user.username === username),
        emailTaken: result.some(user => user.email === email)
      };
    } catch (error) {
      throw error;
    }
  }

  async findUser(username: string): Promise<PersonDTO | null> {
    try {
        const result = await this.database
            .select()
            .from(personTable)
            .where(eq(personTable.username, username));

        if (result.length === 0) {
            return null;
        }

        return this.createPersonDTO(result[0]!);
    } catch (error) {
        console.error("Failed finding user:", error);
        throw error;
    }
}

  private createPersonDTO(personTableDBrow: InferSelectModel<typeof personTable>): PersonDTO {
    const roleName = personTableDBrow.roleId === 1 ? 'recruiter' : 'applicant';
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