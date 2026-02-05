import {
    integer,
    pgTable,
    varchar,
    date,
    numeric,
} from "drizzle-orm/pg-core";
import { application } from "express";

/**
 * All tables are made to match the existing database file available on Canvas.
 */

export const personTable = pgTable("person", {
    personId: integer("person_id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar({ length: 255 }),
    surname: varchar({ length: 255 }),
    pnr: varchar({ length: 255 }),
    email: varchar({ length: 255 }),
    password: varchar({ length: 255 }),
    roleId: integer("role_id").references(() => roleTable.roleId),
    username: varchar({ length: 255 }),
});

/*
* The role table will have to entries representing the roles of a recruiter and an applicant. It will look like this:
 1 recruiter
 2 applicant
* each entry in the person table will be connected to either recruiter or applicant through "roleId".
*/
export const roleTable = pgTable("role", {
    roleId: integer("role_id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar({ length: 255 }),
});


// TODO: Look into how these tables are connected more closely
export const competenceTable = pgTable("competence", {
    competenceId: integer("competence_id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar({ length: 255 }),
});

export const competenceProfileTable = pgTable("competence_profile", {
    competenceProfileId: integer("competence_profile_id")
        .primaryKey()
        .generatedByDefaultAsIdentity(),
    personId: integer("person_id").references(() => personTable.personId),
    competenceId: integer("competence_id").references(() => competenceTable.competenceId),
    yearsOfExperience: numeric("years_of_experience", { precision: 4, scale: 2 }),
});

export const availabilityTable = pgTable("availability", {
    availabilityId: integer("availability_id")
        .primaryKey()
        .generatedByDefaultAsIdentity(),
    personId: integer("person_id").references(() => personTable.personId),
    fromDate: date("from_date"),
    toDate: date("to_date"),
});

export const applicationTable = pgTable("application", {
    applicationId: integer("application_id")
        .primaryKey()
        .generatedByDefaultAsIdentity(),
    personId: integer("person_id").references(() => personTable.personId),
    statusId: integer("status_id").references(() => statusTable.statusId),
    createdAt: date("created_at"),
})

export const statusTable = pgTable("status", {
    statusId: integer("status_id")
        .primaryKey()
        .generatedByDefaultAsIdentity(),
    name: varchar({ length: 255 }),
})

// TODO: Look into drizzle relations API documentation, can make complex queries easier to perform