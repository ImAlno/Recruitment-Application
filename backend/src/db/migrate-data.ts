import db from "./index";
import { personTable, availabilityTable, competenceProfileTable } from "./schema";
import { sql } from "drizzle-orm";
import fs from "fs";
import bcrypt from "bcrypt";

async function migrateData() {
    const content = fs.readFileSync("existing-database.sql", 'utf-8');
    const copyRegex = /COPY public\.([a-z_]+) \(([^)]+)\) FROM stdin;\n([\s\S]*?)\\\./g;

    const tablesData: Record<string, Record<string, any>[]> = {
        person: [],
        availability: [],
        competence_profile: []
    };

    let match;
    while ((match = copyRegex.exec(content)) !== null) {
        const [, tableName, columnsStr, rowsStr] = match;
        if (!tableName || !columnsStr || !rowsStr || !tablesData[tableName]) continue;

        const columns = columnsStr.split(',').map(c => c.trim());
        const rows = rowsStr.trim().split('\n');

        for (const row of rows) {
            const values = row.split('\t');
            tablesData[tableName].push(
                Object.fromEntries(columns.map((col, i) => [col, values[i] === '\\N' ? null : values[i]]))
            );
        }
    }

    if (tablesData.person && tablesData.person.length) {
        console.log(`Hashing passwords...`);
        await Promise.all(tablesData.person.map(async (p) => {
            if (p.password) p.password = await bcrypt.hash(p.password, 10);
        }));
    }

    const tableMap: Record<string, any> = {
        person: { table: personTable, map: { person_id: 'personId', name: 'name', surname: 'surname', pnr: 'pnr', email: 'email', password: 'password', role_id: 'roleId', username: 'username' }, seqCol: 'person_id' },
        availability: { table: availabilityTable, map: { availability_id: 'availabilityId', person_id: 'personId', from_date: 'fromDate', to_date: 'toDate' }, seqCol: 'availability_id' },
        competence_profile: { table: competenceProfileTable, map: { competence_profile_id: 'competenceProfileId', person_id: 'personId', competence_id: 'competenceId', years_of_experience: 'yearsOfExperience' }, seqCol: 'competence_profile_id' }
    };

    const order = ['person', 'availability', 'competence_profile'];

    await db.transaction(async (tx) => {
        for (const tableName of order) {
            const data = tablesData[tableName];
            const { table, map, seqCol } = tableMap[tableName];

            if (!data?.length) {
                console.log(`No data found for ${tableName}`);
                continue;
            }

            console.log(`Inserting ${data.length} rows into ${tableName}...`);

            const mappedData = data.map(row => {
                const obj: any = {};
                for (const [pgCol, vCol] of Object.entries(map)) obj[vCol as string] = row[pgCol];
                return obj;
            });

            const chunkSize = 1000;
            for (let i = 0; i < mappedData.length; i += chunkSize) {
                await tx.insert(table).values(mappedData.slice(i, i + chunkSize)).onConflictDoNothing();
            }

            await tx.execute(sql.raw(`SELECT setval(pg_get_serial_sequence('${tableName}', '${seqCol}'), coalesce(max(${seqCol}), 0) + 1, false) FROM ${tableName};`));
        }
    });

    console.log('Migration completed successfully.');
}

migrateData()
    .then(() => process.exit(0))
    .catch(e => {
        console.error('Migration failed:', e);
        process.exit(1);
    });