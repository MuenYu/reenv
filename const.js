// how many audiences to create
export const audienceCount = 10;

// how many users to create in total
export const totalUserCount = 10_000_000;

// how many users per audience
export const usersPerAudience = totalUserCount / audienceCount;

// how many users in target audience should be in db
export const targetAudienceUserInDB = 500_000;

// audience csv file name
export const audienceCSV = "audience.csv";

// audience user csv file name
export const audienceUserCSV = "audience_user.csv";

// temporary csv file name
export const audienceUserTempCSV = "audience_user_temp.csv";

// import csv file name
export const importCSV = "import.csv";
