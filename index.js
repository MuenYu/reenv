import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import {
  audienceCount,
  totalUserCount,
  audienceCSV,
  audienceUserCSV,
  importCSV,
  targetAudienceUserInDB,
  usersPerAudience,
} from "./const.js";

// remove existing files
if (fs.existsSync(audienceCSV)) {
  fs.unlinkSync(audienceCSV);
}
if (fs.existsSync(audienceUserCSV)) {
  fs.unlinkSync(audienceUserCSV);
}
if (fs.existsSync(importCSV)) {
  fs.unlinkSync(importCSV);
}

// file streams
const audienceCSVStream = fs.createWriteStream(audienceCSV, {
  encoding: "utf8",
  flags: "a",
});
const audienceUserCSVStream = fs.createWriteStream(audienceUserCSV, {
  encoding: "utf8",
  flags: "a",
});
const importCSVStream = fs.createWriteStream(importCSV, {
  encoding: "utf8",
  flags: "a",
});

// write audience CSV
audienceCSVStream.write(`name\n`);
for (let i = 1; i <= audienceCount; i++) {
  audienceCSVStream.write(`audience${i}\n`);
}
audienceCSVStream.end();

// write audience user CSV
audienceUserCSVStream.write(`audienceId,distinct_id\n`);
importCSVStream.write(`audienceId,distinct_id\n`);
let targetAudienceUserInDBCount = 0;
for (let i = 0; i < totalUserCount; i++) {
  const audienceId = (i % audienceCount) + 1;
  const userId = uuidv4();
  audienceUserCSVStream.write(`${audienceId},${userId}\n`);
  if (audienceId === audienceCount && targetAudienceUserInDBCount < targetAudienceUserInDB) {
    importCSVStream.write(`${audienceId},${userId}\n`);
    targetAudienceUserInDBCount++;
  }
}
audienceUserCSVStream.end();

while (targetAudienceUserInDBCount < usersPerAudience) {
  importCSVStream.write(`${audienceCount},${uuidv4()}\n`);
  targetAudienceUserInDBCount++;
}
importCSVStream.end();
