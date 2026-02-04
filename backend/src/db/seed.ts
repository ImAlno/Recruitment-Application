import db from "./index";
import { roleTable, competenceTable } from "./schema";

/** // TODO: This is a temporary function, a better solution should be implemented.
 * The database requires that the role table and compentence table has entries for both 1. applicant and recruiter and 2. ticket sales, lotteries and roller coaster operation. 
 * This function seeds the database with these entries if they don't already exist.
 * You can run this function once to seed the database with npm run db:seed (see package.json for more info). 
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
            return;
        } else {
            await db.insert(competenceTable).values([
                { name: "ticket sales" },
                { name: "lotteries" },
                { name: "roller coaster operation" }, 
            ]);
        }

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
