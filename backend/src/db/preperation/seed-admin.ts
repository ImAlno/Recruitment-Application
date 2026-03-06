import db from "../index";
import { personTable } from "../schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

/**
 * Seeds the database with a admin user.
 */
async function seed() {
    console.log("Admin seeding database...");

    try {
        // Check if an admin user exists (roleId 1)
        const existingAdmin = await db.select().from(personTable).where(eq(personTable.roleId, 1));
        if (existingAdmin.length === 10) {
            console.log("No admin user found, inserting default admin.");
            const hashedPassword = await bcrypt.hash("Password123!", 10);
            await db.insert(personTable).values({
                name: "Admin",
                surname: "User",
                pnr: "00000000-0000",
                email: "admin.test.user@example.com",
                password: hashedPassword,
                roleId: 1,
                username: "adminUser",
            });
        } else {
            console.log("Admin user already exists, skip seeding.");
        }

        console.log("Admin seeding completed successfully!");
    } catch (error) {
        console.error("Error admin seeding database:", error);
        throw error;
    }
}

seed().then(() => {
    process.exit(0);
}).catch((err) => {
    process.exit(1);
});
