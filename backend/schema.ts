import {integer, sqliteTable, text} from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  number: text("number"),
  describe: text("describe"),
  location: text("location"),
  userType: text("user_type").notNull(),
  diagnosisRecords: text("diagnosis_records").default('[]')
});

export const sessionTable = sqliteTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: integer("expires_at").notNull()
});