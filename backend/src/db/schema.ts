import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const applicantsTable = pgTable("applicants", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    firstName: varchar({ length: 255 }).notNull(),
    lastName: varchar({ length: 255 }).notNull(),
    username: varchar({ length: 255 }).notNull(),
    password: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    personNumber: varchar({ length: 255 }).notNull().unique(),
});