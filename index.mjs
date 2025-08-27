import { v4 as uuidv4 } from "uuid";
import fs from "fs";

const targetSQL = 'init.sql';
const targetCSV = 'import.csv';
const fillingAudienceCount = 10;
const fillingAudienceUserCount = 1_000_000;

// cleanup targetSQL
if (fs.existsSync(targetSQL)) {
    fs.unlinkSync(targetSQL);
}

// cleanup targetCSV
if (fs.existsSync(targetCSV)) {
    fs.unlinkSync(targetCSV);
}

// create audiences
const audienceNames = [];
for (let i = 1; i <= fillingAudienceCount; i++) {
    const audience_name = i === fillingAudienceCount ? 'target_audience' : `filling_audience_${i}`;
    audienceNames.push(`('${audience_name}')`);
}
const audienceSql = `INSERT INTO svc_lab_audiences ("name") VALUES\n${audienceNames.join(",\n")};\n`;
fs.appendFileSync(targetSQL, audienceSql, "utf8");

// Only one INSERT INTO for all rows to accelerate import speed
const allRows = [], importCSVRows = ['header'];
for (let userIdx = 0; userIdx < fillingAudienceUserCount; userIdx++) {
    const audienceId = (userIdx % fillingAudienceCount) + 1;
    const userId = uuidv4();
    allRows.push(`(${audienceId}, '${userId}')`);
    if (userIdx % (fillingAudienceCount * 2) === fillingAudienceCount - 1) {
        importCSVRows.push(`${userId}`);
    }
}
const sql = `INSERT INTO svc_lab_audience_users ("audienceId", "distinct_id") VALUES\n${allRows.join(",\n")};\n`;
fs.appendFileSync(targetSQL, sql, "utf8");

for (let i = importCSVRows.length; i <= fillingAudienceUserCount; i++) {
    importCSVRows.push(`${uuidv4()}`);
}
fs.writeFileSync(targetCSV, importCSVRows.join("\n"), "utf8");