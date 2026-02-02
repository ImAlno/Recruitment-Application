CREATE TABLE "availability" (
	"availability_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "availability_availability_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"person_id" integer,
	"from_date" date,
	"to_date" date
);
--> statement-breakpoint
CREATE TABLE "competence_profile" (
	"competence_profile_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "competence_profile_competence_profile_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"person_id" integer,
	"competence_id" integer,
	"years_of_experience" numeric(4, 2)
);
--> statement-breakpoint
CREATE TABLE "competence" (
	"competence_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "competence_competence_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "person" (
	"person_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "person_person_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255),
	"surname" varchar(255),
	"pnr" varchar(255),
	"email" varchar(255),
	"password" varchar(255),
	"role_id" integer,
	"username" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "role" (
	"role_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "role_role_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255)
);
--> statement-breakpoint
ALTER TABLE "availability" ADD CONSTRAINT "availability_person_id_person_person_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."person"("person_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competence_profile" ADD CONSTRAINT "competence_profile_person_id_person_person_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."person"("person_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competence_profile" ADD CONSTRAINT "competence_profile_competence_id_competence_competence_id_fk" FOREIGN KEY ("competence_id") REFERENCES "public"."competence"("competence_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "person" ADD CONSTRAINT "person_role_id_role_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."role"("role_id") ON DELETE no action ON UPDATE no action;