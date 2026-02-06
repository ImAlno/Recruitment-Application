import { Database, Transaction } from "../db";
import db from "../db";
import {
  competenceProfileTable,
  availabilityTable,
} from "../db/schema";
import { CompetenceDTO, AvailabilityDTO } from "../model/CompetenceDTO";

export class ApplicationDAO {
  /**
   * Store applicant competence
   */
  async addCompetence(
    applicantId: number,
    competence: CompetenceDTO,
    tx: any
  ): Promise<void> {
    await tx.insert(competenceProfileTable).values({
      personId: applicantId,
      competenceId: competence.competence_id,
      yearsOfExperience: competence.years_of_experience,
    });
  }

  /**
   * Store applicant availability
   */
  async addAvailability(
    applicantId: number,
    availability: AvailabilityDTO,
    tx: any
  ): Promise<void> {
    await tx.insert(availabilityTable).values({
      personId: applicantId,
      fromDate: availability.from_date,
      toDate: availability.to_date,
    });
  }
}

export default ApplicationDAO;