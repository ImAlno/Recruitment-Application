import db from "./index";
import { roleTable } from "./schema";

/** // TODO: This is a temporary function, a better solution should be implemented.
 * The database requires that the role table as an entry for both applicant and recruiter. 
 * This function seeds the database with these roles if they don't already exist.
 * You can run this function once to seed the database with npm run db:seed (see package.json for more info). 
 */
async function seed() {
    console.log("Seeding database...");

    try {
        // Check if roles already exist to avoid duplicates
        const existingRoles = await db.select().from(roleTable);
        if (existingRoles.length > 0) {
            console.log("Roles already exist, skipping seed.");
            return;
        }

        await db.insert(roleTable).values([
            { name: "recruiter" },
            { name: "applicant" },
        ]);

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
