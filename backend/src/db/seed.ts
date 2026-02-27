import db from "./index";
import { roleTable, competenceTable, statusTable, applicationTable } from "./schema";

/**
 * Seeds the database with necessary initial configuration entries.
 * The database requires that the role table and compentence table has entries for both:
 * 1. applicant and recruiter
 * 2. competences (ticket sales, lotteries and roller coaster operation).
 * Statuses such as accepted, rejected, and unhandled are also inserted if they do not exist.
 *
 * TODO: This is a temporary function, a better solution should be implemented.
 */
async function seed() {
    console.log("Seeding database...");

    try {
        // Check if roles already exist to avoid duplicates
        const existingRoles = await db.select().from(roleTable);
        if (existingRoles.length > 0) {
            console.log("Roles already exist, skipping seed.");
        } else {
            await db.insert(roleTable).values([
                { name: "recruiter" },
                { name: "applicant" },
            ]);
        }

        const existingCompetence = await db.select().from(competenceTable);
        if (existingCompetence.length > 0) {
            console.log("Competence entries already exist, skipping seed.");
        } else {
            await db.insert(competenceTable).values([
                { name: "ticket sales" },
                { name: "lotteries" },
                { name: "roller coaster operation" },
            ]);
        }

        const existingStatus = await db.select().from(statusTable);
        if (existingStatus.length > 0) {
            console.log("Status entries already exist, skipping seed.");
            return;
        } else {
            await db.insert(statusTable).values([
                { name: "accepted" },
                { name: "rejected" },
                { name: "unhandled" },
            ]);
        }

        /* // ? Temporary
        const existingApplications = await db.select().from(applicationTable);
        if (existingApplications.length > 0) {
            console.log("Application entries already exist, skipping seed.");
            return;
        } else {
            await db.insert(applicationTable).values([
                {
                    personId: 1,
                    statusId: 1,
                    createdAt: new Date().toISOString().split("T")[0], // converts to 'YYYY-MM-DD'
                },
            ]);
        } */

        console.log("Seeding completed successfully!");
    } catch (error) {
        console.error("Error seeding database:", error);
        throw error;
    }
}

seed().then(() => {
    process.exit(0);
}).catch((err) => {
    process.exit(1);
});
