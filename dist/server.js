
      import { createRequire } from 'module';
      const require = createRequire(import.meta.url);
    
var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";

// src/app/middleware/not-found.ts
var notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    status: 404,
    error: "Not Found",
    requestType: req.method,
    message: `The requested URL ${req.originalUrl} was not found on this server.`
  });
};
var not_found_default = notFound;

// prisma/generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// prisma/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.10.0",
  "engineVersion": "0edf323efd1d98336f3f0a68684b56f689b900d3",
  "activeProvider": "postgresql",
  "inlineSchema": `model Comment {
  id        String    @id @default(uuid())
  taskId    String    @map("task_id")
  authorId  String    @map("author_id")
  content   String
  deletedAt DateTime? @map("deleted_at")
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")

  task   Task @relation(fields: [taskId], references: [id], onDelete: Cascade)
  author User @relation(fields: [authorId], references: [id], onDelete: Cascade)

  @@map("comments")
}

enum Role {
  ADMIN
  MANAGER
  MEMBER
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  REVIEW
  DONE
}

enum TaskPriority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

enum PaymentStatus {
  PENDING
  ACTIVE
  FAILED
  EXPIRED
}

enum PaymentGateway {
  STRIPE
  BKASH
  SSLCOMMERZ
}

enum UserStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
}

enum OrganizationMembershipStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
}

enum SprintStatus {
  PLANNING
  ACTIVE
  COMPLETED
}

enum AuthProvider {
  LOCAL
  GOOGLE
}

model Organization {
  id        String    @id @default(uuid())
  name      String
  slug      String    @unique
  deletedAt DateTime? @map("deleted_at")
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")

  memberships   OrganizationMembership[]
  teams         Team[]
  projects      Project[]
  subscriptions Subscription[]

  @@map("organizations")
}

model OrganizationMembership {
  id             String                       @id @default(uuid())
  organizationId String                       @map("organization_id")
  userId         String                       @map("user_id")
  role           Role                         @default(MEMBER)
  status         OrganizationMembershipStatus @default(ACTIVE)
  createdAt      DateTime                     @default(now()) @map("created_at")
  updatedAt      DateTime                     @updatedAt @map("updated_at")

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  user         User         @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([organizationId, userId])
  @@map("organization_memberships")
}

model Project {
  id             String    @id @default(uuid())
  organizationId String    @map("organization_id")
  name           String
  description    String?
  status         String    @default("active")
  deletedAt      DateTime? @map("deleted_at")
  createdAt      DateTime  @default(now()) @map("created_at")
  updatedAt      DateTime  @updatedAt @map("updated_at")

  organization Organization  @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  sprints      Sprint[]
  teams        ProjectTeam[] // Links project to the junction table
  tasks        Task[]

  @@map("projects")
}

model ProjectTeam {
  projectId  String   @map("project_id")
  teamId     String   @map("team_id")
  assignedAt DateTime @default(now()) @map("assigned_at")

  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  team    Team    @relation(fields: [teamId], references: [id], onDelete: Cascade)

  @@id([projectId, teamId]) // Composite primary key ensures a team can't be added to the same project twice
  @@map("project_teams")
}

generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model Sprint {
  id        String       @id @default(uuid())
  projectId String       @map("project_id")
  name      String
  goal      String?
  status    SprintStatus @default(PLANNING)
  startDate DateTime?    @map("start_date")
  endDate   DateTime?    @map("end_date")
  deletedAt DateTime?    @map("deleted_at")
  createdAt DateTime     @default(now()) @map("created_at")
  updatedAt DateTime     @updatedAt @map("updated_at")

  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  tasks   Task[]

  @@map("sprints")
}

model Subscription {
  id             String         @id @default(uuid())
  organizationId String         @map("organization_id")
  gateway        PaymentGateway
  transactionId  String         @unique @map("transaction_id")
  amount         Decimal        @db.Decimal(10, 2)
  currency       String         @default("USD")
  status         PaymentStatus  @default(PENDING)
  planName       String         @map("plan_name")
  expiresAt      DateTime?      @map("expires_at")
  createdAt      DateTime       @default(now()) @map("created_at")
  updatedAt      DateTime       @updatedAt @map("updated_at")

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  @@map("subscriptions")
}

model Task {
  id           String       @id @default(uuid())
  projectId    String       @map("project_id")
  sprintId     String?      @map("sprint_id")
  parentTaskId String?      @map("parent_task_id")
  creatorId    String?      @map("creator_id")
  assigneeId   String?      @map("assignee_id")
  title        String
  description  String?
  status       TaskStatus   @default(TODO)
  priority     TaskPriority @default(MEDIUM)
  deletedAt    DateTime?    @map("deleted_at")
  createdAt    DateTime     @default(now()) @map("created_at")
  updatedAt    DateTime     @updatedAt @map("updated_at")

  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)

  parentTask Task?  @relation("SubTasks", fields: [parentTaskId], references: [id], onDelete: Cascade)
  subTasks   Task[] @relation("SubTasks")
  creator    User?  @relation("TaskCreator", fields: [creatorId], references: [id], onDelete: SetNull)
  assignee   User?  @relation("TaskAssignee", fields: [assigneeId], references: [id], onDelete: SetNull)

  sprint Sprint? @relation(fields: [sprintId], references: [id], onDelete: SetNull)

  comments Comment[]

  @@map("tasks")
}

model Team {
  id             String    @id @default(uuid())
  organizationId String    @map("organization_id")
  name           String
  description    String?
  createdAt      DateTime  @default(now()) @map("created_at")
  updatedAt      DateTime  @updatedAt @map("updated_at")
  deletedAt      DateTime? @map("deleted_at")

  organization Organization     @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  teamMembers  TeamMembership[]
  projects     ProjectTeam[] // Links team to the junction table

  @@unique([organizationId, name], name: "unique_team_name_per_organization")
  @@map("teams")
}

model TeamMembership {
  teamId    String   @map("team_id")
  userId    String   @map("user_id")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  team Team @relation(fields: [teamId], references: [id], onDelete: Cascade)
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@id([teamId, userId])
  @@map("team_memberships")
}

model User {
  id             String       @id @default(uuid())
  email          String       @unique
  emailVerified  Boolean      @default(false) @map("email_verified")
  passwordHash   String?      @map("password_hash")
  fullName       String       @map("full_name")
  status         UserStatus   @default(ACTIVE)
  authProvider   AuthProvider @default(LOCAL) @map("auth_provider")
  authProviderId String?      @map("auth_provider_id")
  deletedAt      DateTime?    @map("deleted_at")
  createdAt      DateTime     @default(now()) @map("created_at")
  updatedAt      DateTime     @updatedAt @map("updated_at")

  memberships     OrganizationMembership[]
  teamMemberships TeamMembership[]
  createdTasks    Task[]                   @relation("TaskCreator")
  assignedTasks   Task[]                   @relation("TaskAssignee")
  comments        Comment[]

  @@map("users")
}
`,
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Comment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"taskId","kind":"scalar","type":"String","dbName":"task_id"},{"name":"authorId","kind":"scalar","type":"String","dbName":"author_id"},{"name":"content","kind":"scalar","type":"String"},{"name":"deletedAt","kind":"scalar","type":"DateTime","dbName":"deleted_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"task","kind":"object","type":"Task","relationName":"CommentToTask"},{"name":"author","kind":"object","type":"User","relationName":"CommentToUser"}],"dbName":"comments","schema":null},"Organization":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"deletedAt","kind":"scalar","type":"DateTime","dbName":"deleted_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"memberships","kind":"object","type":"OrganizationMembership","relationName":"OrganizationToOrganizationMembership"},{"name":"teams","kind":"object","type":"Team","relationName":"OrganizationToTeam"},{"name":"projects","kind":"object","type":"Project","relationName":"OrganizationToProject"},{"name":"subscriptions","kind":"object","type":"Subscription","relationName":"OrganizationToSubscription"}],"dbName":"organizations","schema":null},"OrganizationMembership":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String","dbName":"organization_id"},{"name":"userId","kind":"scalar","type":"String","dbName":"user_id"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"OrganizationMembershipStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"organization","kind":"object","type":"Organization","relationName":"OrganizationToOrganizationMembership"},{"name":"user","kind":"object","type":"User","relationName":"OrganizationMembershipToUser"}],"dbName":"organization_memberships","schema":null},"Project":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String","dbName":"organization_id"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"deletedAt","kind":"scalar","type":"DateTime","dbName":"deleted_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"organization","kind":"object","type":"Organization","relationName":"OrganizationToProject"},{"name":"sprints","kind":"object","type":"Sprint","relationName":"ProjectToSprint"},{"name":"teams","kind":"object","type":"ProjectTeam","relationName":"ProjectToProjectTeam"},{"name":"tasks","kind":"object","type":"Task","relationName":"ProjectToTask"}],"dbName":"projects","schema":null},"ProjectTeam":{"fields":[{"name":"projectId","kind":"scalar","type":"String","dbName":"project_id"},{"name":"teamId","kind":"scalar","type":"String","dbName":"team_id"},{"name":"assignedAt","kind":"scalar","type":"DateTime","dbName":"assigned_at"},{"name":"project","kind":"object","type":"Project","relationName":"ProjectToProjectTeam"},{"name":"team","kind":"object","type":"Team","relationName":"ProjectTeamToTeam"}],"dbName":"project_teams","schema":null},"Sprint":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"projectId","kind":"scalar","type":"String","dbName":"project_id"},{"name":"name","kind":"scalar","type":"String"},{"name":"goal","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"SprintStatus"},{"name":"startDate","kind":"scalar","type":"DateTime","dbName":"start_date"},{"name":"endDate","kind":"scalar","type":"DateTime","dbName":"end_date"},{"name":"deletedAt","kind":"scalar","type":"DateTime","dbName":"deleted_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"project","kind":"object","type":"Project","relationName":"ProjectToSprint"},{"name":"tasks","kind":"object","type":"Task","relationName":"SprintToTask"}],"dbName":"sprints","schema":null},"Subscription":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String","dbName":"organization_id"},{"name":"gateway","kind":"enum","type":"PaymentGateway"},{"name":"transactionId","kind":"scalar","type":"String","dbName":"transaction_id"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"planName","kind":"scalar","type":"String","dbName":"plan_name"},{"name":"expiresAt","kind":"scalar","type":"DateTime","dbName":"expires_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"organization","kind":"object","type":"Organization","relationName":"OrganizationToSubscription"}],"dbName":"subscriptions","schema":null},"Task":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"projectId","kind":"scalar","type":"String","dbName":"project_id"},{"name":"sprintId","kind":"scalar","type":"String","dbName":"sprint_id"},{"name":"parentTaskId","kind":"scalar","type":"String","dbName":"parent_task_id"},{"name":"creatorId","kind":"scalar","type":"String","dbName":"creator_id"},{"name":"assigneeId","kind":"scalar","type":"String","dbName":"assignee_id"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TaskStatus"},{"name":"priority","kind":"enum","type":"TaskPriority"},{"name":"deletedAt","kind":"scalar","type":"DateTime","dbName":"deleted_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"project","kind":"object","type":"Project","relationName":"ProjectToTask"},{"name":"parentTask","kind":"object","type":"Task","relationName":"SubTasks"},{"name":"subTasks","kind":"object","type":"Task","relationName":"SubTasks"},{"name":"creator","kind":"object","type":"User","relationName":"TaskCreator"},{"name":"assignee","kind":"object","type":"User","relationName":"TaskAssignee"},{"name":"sprint","kind":"object","type":"Sprint","relationName":"SprintToTask"},{"name":"comments","kind":"object","type":"Comment","relationName":"CommentToTask"}],"dbName":"tasks","schema":null},"Team":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String","dbName":"organization_id"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"deletedAt","kind":"scalar","type":"DateTime","dbName":"deleted_at"},{"name":"organization","kind":"object","type":"Organization","relationName":"OrganizationToTeam"},{"name":"teamMembers","kind":"object","type":"TeamMembership","relationName":"TeamToTeamMembership"},{"name":"projects","kind":"object","type":"ProjectTeam","relationName":"ProjectTeamToTeam"}],"dbName":"teams","schema":null},"TeamMembership":{"fields":[{"name":"teamId","kind":"scalar","type":"String","dbName":"team_id"},{"name":"userId","kind":"scalar","type":"String","dbName":"user_id"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"team","kind":"object","type":"Team","relationName":"TeamToTeamMembership"},{"name":"user","kind":"object","type":"User","relationName":"TeamMembershipToUser"}],"dbName":"team_memberships","schema":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean","dbName":"email_verified"},{"name":"passwordHash","kind":"scalar","type":"String","dbName":"password_hash"},{"name":"fullName","kind":"scalar","type":"String","dbName":"full_name"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"authProvider","kind":"enum","type":"AuthProvider","dbName":"auth_provider"},{"name":"authProviderId","kind":"scalar","type":"String","dbName":"auth_provider_id"},{"name":"deletedAt","kind":"scalar","type":"DateTime","dbName":"deleted_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"memberships","kind":"object","type":"OrganizationMembership","relationName":"OrganizationMembershipToUser"},{"name":"teamMemberships","kind":"object","type":"TeamMembership","relationName":"TeamMembershipToUser"},{"name":"createdTasks","kind":"object","type":"Task","relationName":"TaskCreator"},{"name":"assignedTasks","kind":"object","type":"Task","relationName":"TaskAssignee"},{"name":"comments","kind":"object","type":"Comment","relationName":"CommentToUser"}],"dbName":"users","schema":null}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","organization","memberships","teamMembers","project","team","projects","_count","user","teamMemberships","createdTasks","assignedTasks","comments","teams","subscriptions","tasks","sprints","parentTask","subTasks","creator","assignee","sprint","task","author","Comment.findUnique","Comment.findUniqueOrThrow","Comment.findFirst","Comment.findFirstOrThrow","Comment.findMany","data","Comment.createOne","Comment.createMany","Comment.createManyAndReturn","Comment.updateOne","Comment.updateMany","Comment.updateManyAndReturn","create","update","Comment.upsertOne","Comment.deleteOne","Comment.deleteMany","having","_min","_max","Comment.groupBy","Comment.aggregate","Organization.findUnique","Organization.findUniqueOrThrow","Organization.findFirst","Organization.findFirstOrThrow","Organization.findMany","Organization.createOne","Organization.createMany","Organization.createManyAndReturn","Organization.updateOne","Organization.updateMany","Organization.updateManyAndReturn","Organization.upsertOne","Organization.deleteOne","Organization.deleteMany","Organization.groupBy","Organization.aggregate","OrganizationMembership.findUnique","OrganizationMembership.findUniqueOrThrow","OrganizationMembership.findFirst","OrganizationMembership.findFirstOrThrow","OrganizationMembership.findMany","OrganizationMembership.createOne","OrganizationMembership.createMany","OrganizationMembership.createManyAndReturn","OrganizationMembership.updateOne","OrganizationMembership.updateMany","OrganizationMembership.updateManyAndReturn","OrganizationMembership.upsertOne","OrganizationMembership.deleteOne","OrganizationMembership.deleteMany","OrganizationMembership.groupBy","OrganizationMembership.aggregate","Project.findUnique","Project.findUniqueOrThrow","Project.findFirst","Project.findFirstOrThrow","Project.findMany","Project.createOne","Project.createMany","Project.createManyAndReturn","Project.updateOne","Project.updateMany","Project.updateManyAndReturn","Project.upsertOne","Project.deleteOne","Project.deleteMany","Project.groupBy","Project.aggregate","ProjectTeam.findUnique","ProjectTeam.findUniqueOrThrow","ProjectTeam.findFirst","ProjectTeam.findFirstOrThrow","ProjectTeam.findMany","ProjectTeam.createOne","ProjectTeam.createMany","ProjectTeam.createManyAndReturn","ProjectTeam.updateOne","ProjectTeam.updateMany","ProjectTeam.updateManyAndReturn","ProjectTeam.upsertOne","ProjectTeam.deleteOne","ProjectTeam.deleteMany","ProjectTeam.groupBy","ProjectTeam.aggregate","Sprint.findUnique","Sprint.findUniqueOrThrow","Sprint.findFirst","Sprint.findFirstOrThrow","Sprint.findMany","Sprint.createOne","Sprint.createMany","Sprint.createManyAndReturn","Sprint.updateOne","Sprint.updateMany","Sprint.updateManyAndReturn","Sprint.upsertOne","Sprint.deleteOne","Sprint.deleteMany","Sprint.groupBy","Sprint.aggregate","Subscription.findUnique","Subscription.findUniqueOrThrow","Subscription.findFirst","Subscription.findFirstOrThrow","Subscription.findMany","Subscription.createOne","Subscription.createMany","Subscription.createManyAndReturn","Subscription.updateOne","Subscription.updateMany","Subscription.updateManyAndReturn","Subscription.upsertOne","Subscription.deleteOne","Subscription.deleteMany","_avg","_sum","Subscription.groupBy","Subscription.aggregate","Task.findUnique","Task.findUniqueOrThrow","Task.findFirst","Task.findFirstOrThrow","Task.findMany","Task.createOne","Task.createMany","Task.createManyAndReturn","Task.updateOne","Task.updateMany","Task.updateManyAndReturn","Task.upsertOne","Task.deleteOne","Task.deleteMany","Task.groupBy","Task.aggregate","Team.findUnique","Team.findUniqueOrThrow","Team.findFirst","Team.findFirstOrThrow","Team.findMany","Team.createOne","Team.createMany","Team.createManyAndReturn","Team.updateOne","Team.updateMany","Team.updateManyAndReturn","Team.upsertOne","Team.deleteOne","Team.deleteMany","Team.groupBy","Team.aggregate","TeamMembership.findUnique","TeamMembership.findUniqueOrThrow","TeamMembership.findFirst","TeamMembership.findFirstOrThrow","TeamMembership.findMany","TeamMembership.createOne","TeamMembership.createMany","TeamMembership.createManyAndReturn","TeamMembership.updateOne","TeamMembership.updateMany","TeamMembership.updateManyAndReturn","TeamMembership.upsertOne","TeamMembership.deleteOne","TeamMembership.deleteMany","TeamMembership.groupBy","TeamMembership.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","AND","OR","NOT","id","email","emailVerified","passwordHash","fullName","UserStatus","status","AuthProvider","authProvider","authProviderId","deletedAt","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","every","some","none","teamId","userId","organizationId","name","description","projectId","sprintId","parentTaskId","creatorId","assigneeId","title","TaskStatus","TaskPriority","priority","PaymentGateway","gateway","transactionId","amount","currency","PaymentStatus","planName","expiresAt","goal","SprintStatus","startDate","endDate","assignedAt","Role","role","OrganizationMembershipStatus","slug","taskId","authorId","content","unique_team_name_per_organization","projectId_teamId","teamId_userId","organizationId_userId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "ygZhsAEMGAAAmgMAIBkAAJsDACDSAQAAmQMAMNMBAAAYABDUAQAAmQMAMNUBAQAAAAHfAUAA4AIAIeABQADhAgAh4QFAAOECACGPAgEA3QIAIZACAQDdAgAhkQIBAN0CACEBAAAAAQAgDAMAAJMDACAKAACbAwAg0gEAAKgDADDTAQAAAwAQ1AEAAKgDADDVAQEA3QIAIdsBAACqA44CIuABQADhAgAh4QFAAOECACHxAQEA3QIAIfIBAQDdAgAhjAIAAKkDjAIiAgMAAN4FACAKAADiBQAgDQMAAJMDACAKAACbAwAg0gEAAKgDADDTAQAAAwAQ1AEAAKgDADDVAQEAAAAB2wEAAKoDjgIi4AFAAOECACHhAUAA4QIAIfEBAQDdAgAh8gEBAN0CACGMAgAAqQOMAiKVAgAApwMAIAMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgCQcAAKQDACAKAACbAwAg0gEAAKYDADDTAQAACAAQ1AEAAKYDADDgAUAA4QIAIeEBQADhAgAh8AEBAN0CACHxAQEA3QIAIQIHAADkBQAgCgAA4gUAIAoHAACkAwAgCgAAmwMAINIBAACmAwAw0wEAAAgAENQBAACmAwAw4AFAAOECACHhAUAA4QIAIfABAQDdAgAh8QEBAN0CACGUAgAApQMAIAMAAAAIACABAAAJADACAAAKACADAAAACAAgAQAACQAwAgAACgAgCAYAAI4DACAHAACkAwAg0gEAAKMDADDTAQAADQAQ1AEAAKMDADDwAQEA3QIAIfUBAQDdAgAhigJAAOECACECBgAA3QUAIAcAAOQFACAJBgAAjgMAIAcAAKQDACDSAQAAowMAMNMBAAANABDUAQAAowMAMPABAQDdAgAh9QEBAN0CACGKAkAA4QIAIZMCAACiAwAgAwAAAA0AIAEAAA4AMAIAAA8AIAEAAAAIACABAAAADQAgFwYAAI4DACAOAADlAgAgEwAAnwMAIBQAAOQCACAVAACgAwAgFgAAoAMAIBcAAKEDACDSAQAAnAMAMNMBAAATABDUAQAAnAMAMNUBAQDdAgAh2wEAAJ0D_AEi3wFAAOACACHgAUAA4QIAIeEBQADhAgAh9AEBANwCACH1AQEA3QIAIfYBAQDcAgAh9wEBANwCACH4AQEA3AIAIfkBAQDcAgAh-gEBAN0CACH9AQAAngP9ASINBgAA3QUAIA4AAKgEACATAADhBQAgFAAApwQAIBUAAOIFACAWAADiBQAgFwAA4wUAIN8BAACrAwAg9AEAAKsDACD2AQAAqwMAIPcBAACrAwAg-AEAAKsDACD5AQAAqwMAIBcGAACOAwAgDgAA5QIAIBMAAJ8DACAUAADkAgAgFQAAoAMAIBYAAKADACAXAAChAwAg0gEAAJwDADDTAQAAEwAQ1AEAAJwDADDVAQEAAAAB2wEAAJ0D_AEi3wFAAOACACHgAUAA4QIAIeEBQADhAgAh9AEBANwCACH1AQEA3QIAIfYBAQDcAgAh9wEBANwCACH4AQEA3AIAIfkBAQDcAgAh-gEBAN0CACH9AQAAngP9ASIDAAAAEwAgAQAAFAAwAgAAFQAgAwAAABMAIAEAABQAMAIAABUAIAwYAACaAwAgGQAAmwMAINIBAACZAwAw0wEAABgAENQBAACZAwAw1QEBAN0CACHfAUAA4AIAIeABQADhAgAh4QFAAOECACGPAgEA3QIAIZACAQDdAgAhkQIBAN0CACEDGAAA4QUAIBkAAOIFACDfAQAAqwMAIAMAAAAYACABAAAZADACAAABACABAAAAAwAgAQAAAAgAIAEAAAATACABAAAAEwAgAQAAABgAIA0DAACTAwAgBQAA4wIAIAgAAJYDACDSAQAAmAMAMNMBAAAgABDUAQAAmAMAMNUBAQDdAgAh3wFAAOACACHgAUAA4QIAIeEBQADhAgAh8gEBAN0CACHzAQEA3QIAIfQBAQDcAgAhBQMAAN4FACAFAACmBAAgCAAA4AUAIN8BAACrAwAg9AEAAKsDACAOAwAAkwMAIAUAAOMCACAIAACWAwAg0gEAAJgDADDTAQAAIAAQ1AEAAJgDADDVAQEAAAAB3wFAAOACACHgAUAA4QIAIeEBQADhAgAh8gEBAN0CACHzAQEA3QIAIfQBAQDcAgAhkgIAAJcDACADAAAAIAAgAQAAIQAwAgAAIgAgDwMAAJMDACAPAACWAwAgEQAA5AIAIBIAAJUDACDSAQAAlAMAMNMBAAAkABDUAQAAlAMAMNUBAQDdAgAh2wEBAN0CACHfAUAA4AIAIeABQADhAgAh4QFAAOECACHyAQEA3QIAIfMBAQDdAgAh9AEBANwCACEGAwAA3gUAIA8AAOAFACARAACnBAAgEgAA3wUAIN8BAACrAwAg9AEAAKsDACAPAwAAkwMAIA8AAJYDACARAADkAgAgEgAAlQMAINIBAACUAwAw0wEAACQAENQBAACUAwAw1QEBAAAAAdsBAQDdAgAh3wFAAOACACHgAUAA4QIAIeEBQADhAgAh8gEBAN0CACHzAQEA3QIAIfQBAQDcAgAhAwAAACQAIAEAACUAMAIAACYAIA8DAACTAwAg0gEAAI8DADDTAQAAKAAQ1AEAAI8DADDVAQEA3QIAIdsBAACSA4QCIuABQADhAgAh4QFAAOECACHyAQEA3QIAIf8BAACQA_8BIoACAQDdAgAhgQIQAJEDACGCAgEA3QIAIYQCAQDdAgAhhQJAAOACACECAwAA3gUAIIUCAACrAwAgDwMAAJMDACDSAQAAjwMAMNMBAAAoABDUAQAAjwMAMNUBAQAAAAHbAQAAkgOEAiLgAUAA4QIAIeEBQADhAgAh8gEBAN0CACH_AQAAkAP_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_wIAMNMBAACFAQAQ1AEAAP8CADDVAQEAwwIAIdsBAACBA44CIuABQADJAgAh4QFAAMkCACHxAQEAwwIAIfIBAQDDAgAhjAIAAIADjAIiAwAAAAMAIAEAAIQBADArAACFAQAgAwAAAAMAIAEAAAQAMAIAAAUAIAEAAAAmACABAAAAJgAgAwAAACQAIAEAACUAMAIAACYAIAMAAAAkACABAAAlADACAAAmACADAAAAJAAgAQAAJQAwAgAAJgAgDAMAAJYFACAPAACYBQAgEQAAmQUAIBIAAJcFACDVAQEAAAAB2wEBAAAAAd8BQAAAAAHgAUAAAAAB4QFAAAAAAfIBAQAAAAHzAQEAAAAB9AEBAAAAAQEfAACNAQAgCNUBAQAAAAHbAQEAAAAB3wFAAAAAAeABQAAAAAHhAUAAAAAB8gEBAAAAAfMBAQAAAAH0AQEAAAABAR8AAI8BADABHwAAjwEAMAwDAAD0BAAgDwAA9gQAIBEAAPcEACASAAD1BAAg1QEBAK8DACHbAQEArwMAId8BQAC0AwAh4AFAALUDACHhAUAAtQMAIfIBAQCvAwAh8wEBAK8DACH0AQEAsQMAIQIAAAAmACAfAACSAQAgCNUBAQCvAwAh2wEBAK8DACHfAUAAtAMAIeABQAC1AwAh4QFAALUDACHyAQEArwMAIfMBAQCvAwAh9AEBALEDACECAAAAJAAgHwAAlAEAIAIAAAAkACAfAACUAQAgAwAAACYAICYAAI0BACAnAACSAQAgAQAAACYAIAEAAAAkACAFCQAA8QQAICwAAPMEACAtAADyBAAg3wEAAKsDACD0AQAAqwMAIAvSAQAA_gIAMNMBAACbAQAQ1AEAAP4CADDVAQEAwwIAIdsBAQDDAgAh3wFAAMgCACHgAUAAyQIAIeEBQADJAgAh8gEBAMMCACHzAQEAwwIAIfQBAQDFAgAhAwAAACQAIAEAAJoBADArAACbAQAgAwAAACQAIAEAACUAMAIAACYAIAEAAAAPACABAAAADwAgAwAAAA0AIAEAAA4AMAIAAA8AIAMAAAANACABAAAOADACAAAPACADAAAADQAgAQAADgAwAgAADwAgBQYAAMEEACAHAADwBAAg8AEBAAAAAfUBAQAAAAGKAkAAAAABAR8AAKMBACAD8AEBAAAAAfUBAQAAAAGKAkAAAAABAR8AAKUBADABHwAApQEAMAUGAAC_BAAgBwAA7wQAIPABAQCvAwAh9QEBAK8DACGKAkAAtQMAIQIAAAAPACAfAACoAQAgA_ABAQCvAwAh9QEBAK8DACGKAkAAtQMAIQIAAAANACAfAACqAQAgAgAAAA0AIB8AAKoBACADAAAADwAgJgAAowEAICcAAKgBACABAAAADwAgAQAAAA0AIAMJAADsBAAgLAAA7gQAIC0AAO0EACAG0gEAAP0CADDTAQAAsQEAENQBAAD9AgAw8AEBAMMCACH1AQEAwwIAIYoCQADJAgAhAwAAAA0AIAEAALABADArAACxAQAgAwAAAA0AIAEAAA4AMAIAAA8AIAEAAAAyACABAAAAMgAgAwAAADAAIAEAADEAMAIAADIAIAMAAAAwACABAAAxADACAAAyACADAAAAMAAgAQAAMQAwAgAAMgAgDAYAAOoEACARAADrBAAg1QEBAAAAAdsBAAAAiAIC3wFAAAAAAeABQAAAAAHhAUAAAAAB8wEBAAAAAfUBAQAAAAGGAgEAAAABiAJAAAAAAYkCQAAAAAEBHwAAuQEAIArVAQEAAAAB2wEAAACIAgLfAUAAAAAB4AFAAAAAAeEBQAAAAAHzAQEAAAAB9QEBAAAAAYYCAQAAAAGIAkAAAAABiQJAAAAAAQEfAAC7AQAwAR8AALsBADAMBgAA3wQAIBEAAOAEACDVAQEArwMAIdsBAADeBIgCIt8BQAC0AwAh4AFAALUDACHhAUAAtQMAIfMBAQCvAwAh9QEBAK8DACGGAgEAsQMAIYgCQAC0AwAhiQJAALQDACECAAAAMgAgHwAAvgEAIArVAQEArwMAIdsBAADeBIgCIt8BQAC0AwAh4AFAALUDACHhAUAAtQMAIfMBAQCvAwAh9QEBAK8DACGGAgEAsQMAIYgCQAC0AwAhiQJAALQDACECAAAAMAAgHwAAwAEAIAIAAAAwACAfAADAAQAgAwAAADIAICYAALkBACAnAAC-AQAgAQAAADIAIAEAAAAwACAHCQAA2wQAICwAAN0EACAtAADcBAAg3wEAAKsDACCGAgAAqwMAIIgCAACrAwAgiQIAAKsDACAN0gEAAPkCADDTAQAAxwEAENQBAAD5AgAw1QEBAMMCACHbAQAA-gKIAiLfAUAAyAIAIeABQADJAgAh4QFAAMkCACHzAQEAwwIAIfUBAQDDAgAhhgIBAMUCACGIAkAAyAIAIYkCQADIAgAhAwAAADAAIAEAAMYBADArAADHAQAgAwAAADAAIAEAADEAMAIAADIAIAEAAAAqACABAAAAKgAgAwAAACgAIAEAACkAMAIAACoAIAMAAAAoACABAAApADACAAAqACADAAAAKAAgAQAAKQAwAgAAKgAgDAMAANoEACDVAQEAAAAB2wEAAACEAgLgAUAAAAAB4QFAAAAAAfIBAQAAAAH_AQAAAP8BAoACAQAAAAGBAhAAAAABggIBAAAAAYQCAQAAAAGFAkAAAAABAR8AAM8BACAL1QEBAAAAAdsBAAAAhAIC4AFAAAAAAeEBQAAAAAHyAQEAAAAB_wEAAAD_AQKAAgEAAAABgQIQAAAAAYICAQAAAAGEAgEAAAABhQJAAAAAAQEfAADRAQAwAR8AANEBADAMAwAA2QQAINUBAQCvAwAh2wEAANgEhAIi4AFAALUDACHhAUAAtQMAIfIBAQCvAwAh_wEAANYE_wEigAIBAK8DACGBAhAA1wQAIYICAQCvAwAhhAIBAK8DACGFAkAAtAMAIQIAAAAqACAfAADUAQAgC9UBAQCvAwAh2wEAANgEhAIi4AFAALUDACHhAUAAtQMAIfIBAQCvAwAh_wEAANYE_wEigAIBAK8DACGBAhAA1wQAIYICAQCvAwAhhAIBAK8DACGFAkAAtAMAIQIAAAAoACAfAADWAQAgAgAAACgAIB8AANYBACADAAAAKgAgJgAAzwEAICcAANQBACABAAAAKgAgAQAAACgAIAYJAADRBAAgLAAA1AQAIC0AANMEACCOAQAA0gQAII8BAADVBAAghQIAAKsDACAO0gEAAO8CADDTAQAA3QEAENQBAADvAgAw1QEBAMMCACHbAQAA8gKEAiLgAUAAyQIAIeEBQADJAgAh8gEBAMMCACH_AQAA8AL_ASKAAgEAwwIAIYECEADxAgAhggIBAMMCACGEAgEAwwIAIYUCQADIAgAhAwAAACgAIAEAANwBADArAADdAQAgAwAAACgAIAEAACkAMAIAACoAIAEAAAAVACABAAAAFQAgAwAAABMAIAEAABQAMAIAABUAIAMAAAATACABAAAUADACAAAVACADAAAAEwAgAQAAFAAwAgAAFQAgFAYAAPEDACAOAAD2AwAgEwAA-AMAIBQAAPIDACAVAADzAwAgFgAA9AMAIBcAAPUDACDVAQEAAAAB2wEAAAD8AQLfAUAAAAAB4AFAAAAAAeEBQAAAAAH0AQEAAAAB9QEBAAAAAfYBAQAAAAH3AQEAAAAB-AEBAAAAAfkBAQAAAAH6AQEAAAAB_QEAAAD9AQIBHwAA5QEAIA3VAQEAAAAB2wEAAAD8AQLfAUAAAAAB4AFAAAAAAeEBQAAAAAH0AQEAAAAB9QEBAAAAAfYBAQAAAAH3AQEAAAAB-AEBAAAAAfkBAQAAAAH6AQEAAAAB_QEAAAD9AQIBHwAA5wEAMAEfAADnAQAwAQAAABMAIAEAAAA9ACABAAAAPQAgAQAAADAAIBQGAADWAwAgDgAA2wMAIBMAANcDACAUAADYAwAgFQAA2QMAIBYAAO8DACAXAADaAwAg1QEBAK8DACHbAQAA0wP8ASLfAUAAtAMAIeABQAC1AwAh4QFAALUDACH0AQEAsQMAIfUBAQCvAwAh9gEBALEDACH3AQEAsQMAIfgBAQCxAwAh-QEBALEDACH6AQEArwMAIf0BAADUA_0BIgIAAAAVACAfAADuAQAgDdUBAQCvAwAh2wEAANMD_AEi3wFAALQDACHgAUAAtQMAIeEBQAC1AwAh9AEBALEDACH1AQEArwMAIfYBAQCxAwAh9wEBALEDACH4AQEAsQMAIfkBAQCxAwAh-gEBAK8DACH9AQAA1AP9ASICAAAAEwAgHwAA8AEAIAIAAAATACAfAADwAQAgAQAAABMAIAEAAAA9ACABAAAAPQAgAQAAADAAIAMAAAAVACAmAADlAQAgJwAA7gEAIAEAAAAVACABAAAAEwAgCQkAAM4EACAsAADQBAAgLQAAzwQAIN8BAACrAwAg9AEAAKsDACD2AQAAqwMAIPcBAACrAwAg-AEAAKsDACD5AQAAqwMAIBDSAQAA6AIAMNMBAAD7AQAQ1AEAAOgCADDVAQEAwwIAIdsBAADpAvwBIt8BQADIAgAh4AFAAMkCACHhAUAAyQIAIfQBAQDFAgAh9QEBAMMCACH2AQEAxQIAIfcBAQDFAgAh-AEBAMUCACH5AQEAxQIAIfoBAQDDAgAh_QEAAOoC_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_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_AEi3wFAAMgCACHgAUAAyQIAIeEBQADJAgAh9AEBAMUCACH1AQEAwwIAIfYBAQDFAgAh9wEBAMUCACH4AQEAxQIAIfkBAQDFAgAh-gEBAMMCACH9AQAA6gL9ASIHCQAAywIAICwAAO4CACAtAADuAgAg4gEAAAD8AQLjAQAAAPwBCOQBAAAA_AEI6QEAAO0C_AEiBwkAAMsCACAsAADsAgAgLQAA7AIAIOIBAAAA_QEC4wEAAAD9AQjkAQAAAP0BCOkBAADrAv0BIgcJAADLAgAgLAAA7AIAIC0AAOwCACDiAQAAAP0BAuMBAAAA_QEI5AEAAAD9AQjpAQAA6wL9ASIE4gEAAAD9AQLjAQAAAP0BCOQBAAAA_QEI6QEAAOwC_QEiBwkAAMsCACAsAADuAgAgLQAA7gIAIOIBAAAA_AEC4wEAAAD8AQjkAQAAAPwBCOkBAADtAvwBIgTiAQAAAPwBAuMBAAAA_AEI5AEAAAD8AQjpAQAA7gL8ASIO0gEAAO8CADDTAQAA3QEAENQBAADvAgAw1QEBAMMCACHbAQAA8gKEAiLgAUAAyQIAIeEBQADJAgAh8gEBAMMCACH_AQAA8AL_ASKAAgEAwwIAIYECEADxAgAhggIBAMMCACGEAgEAwwIAIYUCQADIAgAhBwkAAMsCACAsAAD4AgAgLQAA-AIAIOIBAAAA_wEC4wEAAAD_AQjkAQAAAP8BCOkBAAD3Av8BIg0JAADLAgAgLAAA9gIAIC0AAPYCACCOAQAA9gIAII8BAAD2AgAg4gEQAAAAAeMBEAAAAATkARAAAAAE5QEQAAAAAeYBEAAAAAHnARAAAAAB6AEQAAAAAekBEAD1AgAhBwkAAMsCACAsAAD0AgAgLQAA9AIAIOIBAAAAhAIC4wEAAACEAgjkAQAAAIQCCOkBAADzAoQCIgcJAADLAgAgLAAA9AIAIC0AAPQCACDiAQAAAIQCAuMBAAAAhAII5AEAAACEAgjpAQAA8wKEAiIE4gEAAACEAgLjAQAAAIQCCOQBAAAAhAII6QEAAPQChAIiDQkAAMsCACAsAAD2AgAgLQAA9gIAII4BAAD2AgAgjwEAAPYCACDiARAAAAAB4wEQAAAABOQBEAAAAATlARAAAAAB5gEQAAAAAecBEAAAAAHoARAAAAAB6QEQAPUCACEI4gEQAAAAAeMBEAAAAATkARAAAAAE5QEQAAAAAeYBEAAAAAHnARAAAAAB6AEQAAAAAekBEAD2AgAhBwkAAMsCACAsAAD4AgAgLQAA-AIAIOIBAAAA_wEC4wEAAAD_AQjkAQAAAP8BCOkBAAD3Av8BIgTiAQAAAP8BAuMBAAAA_wEI5AEAAAD_AQjpAQAA-AL_ASIN0gEAAPkCADDTAQAAxwEAENQBAAD5AgAw1QEBAMMCACHbAQAA-gKIAiLfAUAAyAIAIeABQADJAgAh4QFAAMkCACHzAQEAwwIAIfUBAQDDAgAhhgIBAMUCACGIAkAAyAIAIYkCQADIAgAhBwkAAMsCACAsAAD8AgAgLQAA_AIAIOIBAAAAiAIC4wEAAACIAgjkAQAAAIgCCOkBAAD7AogCIgcJAADLAgAgLAAA_AIAIC0AAPwCACDiAQAAAIgCAuMBAAAAiAII5AEAAACIAgjpAQAA-wKIAiIE4gEAAACIAgLjAQAAAIgCCOQBAAAAiAII6QEAAPwCiAIiBtIBAAD9AgAw0wEAALEBABDUAQAA_QIAMPABAQDDAgAh9QEBAMMCACGKAkAAyQIAIQvSAQAA_gIAMNMBAACbAQAQ1AEAAP4CADDVAQEAwwIAIdsBAQDDAgAh3wFAAMgCACHgAUAAyQIAIeEBQADJAgAh8gEBAMMCACHzAQEAwwIAIfQBAQDFAgAhCtIBAAD_AgAw0wEAAIUBABDUAQAA_wIAMNUBAQDDAgAh2wEAAIEDjgIi4AFAAMkCACHhAUAAyQIAIfEBAQDDAgAh8gEBAMMCACGMAgAAgAOMAiIHCQAAywIAICwAAIUDACAtAACFAwAg4gEAAACMAgLjAQAAAIwCCOQBAAAAjAII6QEAAIQDjAIiBwkAAMsCACAsAACDAwAgLQAAgwMAIOIBAAAAjgIC4wEAAACOAgjkAQAAAI4CCOkBAACCA44CIgcJAADLAgAgLAAAgwMAIC0AAIMDACDiAQAAAI4CAuMBAAAAjgII5AEAAACOAgjpAQAAggOOAiIE4gEAAACOAgLjAQAAAI4CCOQBAAAAjgII6QEAAIMDjgIiBwkAAMsCACAsAACFAwAgLQAAhQMAIOIBAAAAjAIC4wEAAACMAgjkAQAAAIwCCOkBAACEA4wCIgTiAQAAAIwCAuMBAAAAjAII5AEAAACMAgjpAQAAhQOMAiIJ0gEAAIYDADDTAQAAbwAQ1AEAAIYDADDVAQEAwwIAId8BQADIAgAh4AFAAMkCACHhAUAAyQIAIfMBAQDDAgAhjgIBAMMCACENBAAA4gIAIAgAAIkDACAPAACIAwAgEAAAigMAINIBAACHAwAw0wEAAFwAENQBAACHAwAw1QEBAN0CACHfAUAA4AIAIeABQADhAgAh4QFAAOECACHzAQEA3QIAIY4CAQDdAgAhA-0BAAAgACDuAQAAIAAg7wEAACAAIAPtAQAAJAAg7gEAACQAIO8BAAAkACAD7QEAACgAIO4BAAAoACDvAQAAKAAgCtIBAACLAwAw0wEAAFYAENQBAACLAwAw1QEBAMMCACHfAUAAyAIAIeABQADJAgAh4QFAAMkCACGPAgEAwwIAIZACAQDDAgAhkQIBAMMCACEPBgAAjgMAIBEAAOQCACDSAQAAjAMAMNMBAAAwABDUAQAAjAMAMNUBAQDdAgAh2wEAAI0DiAIi3wFAAOACACHgAUAA4QIAIeEBQADhAgAh8wEBAN0CACH1AQEA3QIAIYYCAQDcAgAhiAJAAOACACGJAkAA4AIAIQTiAQAAAIgCAuMBAAAAiAII5AEAAACIAgjpAQAA_AKIAiIRAwAAkwMAIA8AAJYDACARAADkAgAgEgAAlQMAINIBAACUAwAw0wEAACQAENQBAACUAwAw1QEBAN0CACHbAQEA3QIAId8BQADgAgAh4AFAAOECACHhAUAA4QIAIfIBAQDdAgAh8wEBAN0CACH0AQEA3AIAIZYCAAAkACCXAgAAJAAgDwMAAJMDACDSAQAAjwMAMNMBAAAoABDUAQAAjwMAMNUBAQDdAgAh2wEAAJIDhAIi4AFAAOECACHhAUAA4QIAIfIBAQDdAgAh_wEAAJAD_wEigAIBAN0CACGBAhAAkQMAIYICAQDdAgAhhAIBAN0CACGFAkAA4AIAIQTiAQAAAP8BAuMBAAAA_wEI5AEAAAD_AQjpAQAA-AL_ASII4gEQAAAAAeMBEAAAAATkARAAAAAE5QEQAAAAAeYBEAAAAAHnARAAAAAB6AEQAAAAAekBEAD2AgAhBOIBAAAAhAIC4wEAAACEAgjkAQAAAIQCCOkBAAD0AoQCIg8EAADiAgAgCAAAiQMAIA8AAIgDACAQAACKAwAg0gEAAIcDADDTAQAAXAAQ1AEAAIcDADDVAQEA3QIAId8BQADgAgAh4AFAAOECACHhAUAA4QIAIfMBAQDdAgAhjgIBAN0CACGWAgAAXAAglwIAAFwAIA8DAACTAwAgDwAAlgMAIBEAAOQCACASAACVAwAg0gEAAJQDADDTAQAAJAAQ1AEAAJQDADDVAQEA3QIAIdsBAQDdAgAh3wFAAOACACHgAUAA4QIAIeEBQADhAgAh8gEBAN0CACHzAQEA3QIAIfQBAQDcAgAhA-0BAAAwACDuAQAAMAAg7wEAADAAIAPtAQAADQAg7gEAAA0AIO8BAAANACAC8gEBAAAAAfMBAQAAAAENAwAAkwMAIAUAAOMCACAIAACWAwAg0gEAAJgDADDTAQAAIAAQ1AEAAJgDADDVAQEA3QIAId8BQADgAgAh4AFAAOECACHhAUAA4QIAIfIBAQDdAgAh8wEBAN0CACH0AQEA3AIAIQwYAACaAwAgGQAAmwMAINIBAACZAwAw0wEAABgAENQBAACZAwAw1QEBAN0CACHfAUAA4AIAIeABQADhAgAh4QFAAOECACGPAgEA3QIAIZACAQDdAgAhkQIBAN0CACEZBgAAjgMAIA4AAOUCACATAACfAwAgFAAA5AIAIBUAAKADACAWAACgAwAgFwAAoQMAINIBAACcAwAw0wEAABMAENQBAACcAwAw1QEBAN0CACHbAQAAnQP8ASLfAUAA4AIAIeABQADhAgAh4QFAAOECACH0AQEA3AIAIfUBAQDdAgAh9gEBANwCACH3AQEA3AIAIfgBAQDcAgAh-QEBANwCACH6AQEA3QIAIf0BAACeA_0BIpYCAAATACCXAgAAEwAgFQQAAOICACALAADjAgAgDAAA5AIAIA0AAOQCACAOAADlAgAg0gEAANoCADDTAQAAPQAQ1AEAANoCADDVAQEA3QIAIdYBAQDdAgAh1wEgANsCACHYAQEA3AIAIdkBAQDdAgAh2wEAAN4C2wEi3QEAAN8C3QEi3gEBANwCACHfAUAA4AIAIeABQADhAgAh4QFAAOECACGWAgAAPQAglwIAAD0AIBcGAACOAwAgDgAA5QIAIBMAAJ8DACAUAADkAgAgFQAAoAMAIBYAAKADACAXAAChAwAg0gEAAJwDADDTAQAAEwAQ1AEAAJwDADDVAQEA3QIAIdsBAACdA_wBIt8BQADgAgAh4AFAAOECACHhAUAA4QIAIfQBAQDcAgAh9QEBAN0CACH2AQEA3AIAIfcBAQDcAgAh-AEBANwCACH5AQEA3AIAIfoBAQDdAgAh_QEAAJ4D_QEiBOIBAAAA_AEC4wEAAAD8AQjkAQAAAPwBCOkBAADuAvwBIgTiAQAAAP0BAuMBAAAA_QEI5AEAAAD9AQjpAQAA7AL9ASIZBgAAjgMAIA4AAOUCACATAACfAwAgFAAA5AIAIBUAAKADACAWAACgAwAgFwAAoQMAINIBAACcAwAw0wEAABMAENQBAACcAwAw1QEBAN0CACHbAQAAnQP8ASLfAUAA4AIAIeABQADhAgAh4QFAAOECACH0AQEA3AIAIfUBAQDdAgAh9gEBANwCACH3AQEA3AIAIfgBAQDcAgAh-QEBANwCACH6AQEA3QIAIf0BAACeA_0BIpYCAAATACCXAgAAEwAgFQQAAOICACALAADjAgAgDAAA5AIAIA0AAOQCACAOAADlAgAg0gEAANoCADDTAQAAPQAQ1AEAANoCADDVAQEA3QIAIdYBAQDdAgAh1wEgANsCACHYAQEA3AIAIdkBAQDdAgAh2wEAAN4C2wEi3QEAAN8C3QEi3gEBANwCACHfAUAA4AIAIeABQADhAgAh4QFAAOECACGWAgAAPQAglwIAAD0AIBEGAACOAwAgEQAA5AIAINIBAACMAwAw0wEAADAAENQBAACMAwAw1QEBAN0CACHbAQAAjQOIAiLfAUAA4AIAIeABQADhAgAh4QFAAOECACHzAQEA3QIAIfUBAQDdAgAhhgIBANwCACGIAkAA4AIAIYkCQADgAgAhlgIAADAAIJcCAAAwACAC8AEBAAAAAfUBAQAAAAEIBgAAjgMAIAcAAKQDACDSAQAAowMAMNMBAAANABDUAQAAowMAMPABAQDdAgAh9QEBAN0CACGKAkAA4QIAIQ8DAACTAwAgBQAA4wIAIAgAAJYDACDSAQAAmAMAMNMBAAAgABDUAQAAmAMAMNUBAQDdAgAh3wFAAOACACHgAUAA4QIAIeEBQADhAgAh8gEBAN0CACHzAQEA3QIAIfQBAQDcAgAhlgIAACAAIJcCAAAgACAC8AEBAAAAAfEBAQAAAAEJBwAApAMAIAoAAJsDACDSAQAApgMAMNMBAAAIABDUAQAApgMAMOABQADhAgAh4QFAAOECACHwAQEA3QIAIfEBAQDdAgAhAvEBAQAAAAHyAQEAAAABDAMAAJMDACAKAACbAwAg0gEAAKgDADDTAQAAAwAQ1AEAAKgDADDVAQEA3QIAIdsBAACqA44CIuABQADhAgAh4QFAAOECACHxAQEA3QIAIfIBAQDdAgAhjAIAAKkDjAIiBOIBAAAAjAIC4wEAAACMAgjkAQAAAIwCCOkBAACFA4wCIgTiAQAAAI4CAuMBAAAAjgII5AEAAACOAgjpAQAAgwOOAiIAAAAAAZsCAQAAAAEBmwIgAAAAAQGbAgEAAAABAZsCAAAA2wECAZsCAAAA3QECAZsCQAAAAAEBmwJAAAAAAQsmAACQBAAwJwAAlQQAMJgCAACRBAAwmQIAAJIEADCaAgAAkwQAIJsCAACUBAAwnAIAAJQEADCdAgAAlAQAMJ4CAACUBAAwnwIAAJYEADCgAgAAlwQAMAsmAACCBAAwJwAAhwQAMJgCAACDBAAwmQIAAIQEADCaAgAAhQQAIJsCAACGBAAwnAIAAIYEADCdAgAAhgQAMJ4CAACGBAAwnwIAAIgEADCgAgAAiQQAMAsmAAD5AwAwJwAA_QMAMJgCAAD6AwAwmQIAAPsDADCaAgAA_AMAIJsCAADNAwAwnAIAAM0DADCdAgAAzQMAMJ4CAADNAwAwnwIAAP4DADCgAgAA0AMAMAsmAADJAwAwJwAAzgMAMJgCAADKAwAwmQIAAMsDADCaAgAAzAMAIJsCAADNAwAwnAIAAM0DADCdAgAAzQMAMJ4CAADNAwAwnwIAAM8DADCgAgAA0AMAMAsmAAC7AwAwJwAAwAMAMJgCAAC8AwAwmQIAAL0DADCaAgAAvgMAIJsCAAC_AwAwnAIAAL8DADCdAgAAvwMAMJ4CAAC_AwAwnwIAAMEDADCgAgAAwgMAMAcYAADIAwAg1QEBAAAAAd8BQAAAAAHgAUAAAAAB4QFAAAAAAY8CAQAAAAGRAgEAAAABAgAAAAEAICYAAMcDACADAAAAAQAgJgAAxwMAICcAAMUDACABHwAAygYAMAwYAACaAwAgGQAAmwMAINIBAACZAwAw0wEAABgAENQBAACZAwAw1QEBAAAAAd8BQADgAgAh4AFAAOECACHhAUAA4QIAIY8CAQDdAgAhkAIBAN0CACGRAgEA3QIAIQIAAAABACAfAADFAwAgAgAAAMMDACAfAADEAwAgCtIBAADCAwAw0wEAAMMDABDUAQAAwgMAMNUBAQDdAgAh3wFAAOACACHgAUAA4QIAIeEBQADhAgAhjwIBAN0CACGQAgEA3QIAIZECAQDdAgAhCtIBAADCAwAw0wEAAMMDABDUAQAAwgMAMNUBAQDdAgAh3wFAAOACACHgAUAA4QIAIeEBQADhAgAhjwIBAN0CACGQAgEA3QIAIZECAQDdAgAhBtUBAQCvAwAh3wFAALQDACHgAUAAtQMAIeEBQAC1AwAhjwIBAK8DACGRAgEArwMAIQcYAADGAwAg1QEBAK8DACHfAUAAtAMAIeABQAC1AwAh4QFAALUDACGPAgEArwMAIZECAQCvAwAhBSYAAMUGACAnAADIBgAgmAIAAMYGACCZAgAAxwYAIJ4CAAAVACAHGAAAyAMAINUBAQAAAAHfAUAAAAAB4AFAAAAAAeEBQAAAAAGPAgEAAAABkQIBAAAAAQMmAADFBgAgmAIAAMYGACCeAgAAFQAgEgYAAPEDACAOAAD2AwAgEwAA-AMAIBQAAPIDACAVAADzAwAgFwAA9QMAINUBAQAAAAHbAQAAAPwBAt8BQAAAAAHgAUAAAAAB4QFAAAAAAfQBAQAAAAH1AQEAAAAB9gEBAAAAAfcBAQAAAAH4AQEAAAAB-gEBAAAAAf0BAAAA_QECAgAAABUAICYAAPcDACADAAAAFQAgJgAA9wMAICcAANUDACABHwAAxAYAMBcGAACOAwAgDgAA5QIAIBMAAJ8DACAUAADkAgAgFQAAoAMAIBYAAKADACAXAAChAwAg0gEAAJwDADDTAQAAEwAQ1AEAAJwDADDVAQEAAAAB2wEAAJ0D_AEi3wFAAOACACHgAUAA4QIAIeEBQADhAgAh9AEBANwCACH1AQEA3QIAIfYBAQDcAgAh9wEBANwCACH4AQEA3AIAIfkBAQDcAgAh-gEBAN0CACH9AQAAngP9ASICAAAAFQAgHwAA1QMAIAIAAADRAwAgHwAA0gMAIBDSAQAA0AMAMNMBAADRAwAQ1AEAANADADDVAQEA3QIAIdsBAACdA_wBIt8BQADgAgAh4AFAAOECACHhAUAA4QIAIfQBAQDcAgAh9QEBAN0CACH2AQEA3AIAIfcBAQDcAgAh-AEBANwCACH5AQEA3AIAIfoBAQDdAgAh_QEAAJ4D_QEiENIBAADQAwAw0wEAANEDABDUAQAA0AMAMNUBAQDdAgAh2wEAAJ0D_AEi3wFAAOACACHgAUAA4QIAIeEBQADhAgAh9AEBANwCACH1AQEA3QIAIfYBAQDcAgAh9wEBANwCACH4AQEA3AIAIfkBAQDcAgAh-gEBAN0CACH9AQAAngP9ASIM1QEBAK8DACHbAQAA0wP8ASLfAUAAtAMAIeABQAC1AwAh4QFAALUDACH0AQEAsQMAIfUBAQCvAwAh9gEBALEDACH3AQEAsQMAIfgBAQCxAwAh-gEBAK8DACH9AQAA1AP9ASIBmwIAAAD8AQIBmwIAAAD9AQISBgAA1gMAIA4AANsDACATAADXAwAgFAAA2AMAIBUAANkDACAXAADaAwAg1QEBAK8DACHbAQAA0wP8ASLfAUAAtAMAIeABQAC1AwAh4QFAALUDACH0AQEAsQMAIfUBAQCvAwAh9gEBALEDACH3AQEAsQMAIfgBAQCxAwAh-gEBAK8DACH9AQAA1AP9ASIFJgAArAYAICcAAMIGACCYAgAArQYAIJkCAADBBgAgngIAACYAIAcmAACkBgAgJwAAvwYAIJgCAAClBgAgmQIAAL4GACCcAgAAEwAgnQIAABMAIJ4CAAAVACALJgAA5wMAMCcAAOsDADCYAgAA6AMAMJkCAADpAwAwmgIAAOoDACCbAgAAzQMAMJwCAADNAwAwnQIAAM0DADCeAgAAzQMAMJ8CAADsAwAwoAIAANADADAHJgAAqgYAICcAALwGACCYAgAAqwYAIJkCAAC7BgAgnAIAAD0AIJ0CAAA9ACCeAgAAqgIAIAcmAACmBgAgJwAAuQYAIJgCAACnBgAgmQIAALgGACCcAgAAMAAgnQIAADAAIJ4CAAAyACALJgAA3AMAMCcAAOADADCYAgAA3QMAMJkCAADeAwAwmgIAAN8DACCbAgAAvwMAMJwCAAC_AwAwnQIAAL8DADCeAgAAvwMAMJ8CAADhAwAwoAIAAMIDADAHGQAA5gMAINUBAQAAAAHfAUAAAAAB4AFAAAAAAeEBQAAAAAGQAgEAAAABkQIBAAAAAQIAAAABACAmAADlAwAgAwAAAAEAICYAAOUDACAnAADjAwAgAR8AALcGADACAAAAAQAgHwAA4wMAIAIAAADDAwAgHwAA4gMAIAbVAQEArwMAId8BQAC0AwAh4AFAALUDACHhAUAAtQMAIZACAQCvAwAhkQIBAK8DACEHGQAA5AMAINUBAQCvAwAh3wFAALQDACHgAUAAtQMAIeEBQAC1AwAhkAIBAK8DACGRAgEArwMAIQUmAACyBgAgJwAAtQYAIJgCAACzBgAgmQIAALQGACCeAgAAqgIAIAcZAADmAwAg1QEBAAAAAd8BQAAAAAHgAUAAAAAB4QFAAAAAAZACAQAAAAGRAgEAAAABAyYAALIGACCYAgAAswYAIJ4CAACqAgAgEgYAAPEDACAOAAD2AwAgFAAA8gMAIBUAAPMDACAWAAD0AwAgFwAA9QMAINUBAQAAAAHbAQAAAPwBAt8BQAAAAAHgAUAAAAAB4QFAAAAAAfQBAQAAAAH1AQEAAAAB9gEBAAAAAfgBAQAAAAH5AQEAAAAB-gEBAAAAAf0BAAAA_QECAgAAABUAICYAAPADACADAAAAFQAgJgAA8AMAICcAAO4DACABHwAAsQYAMAIAAAAVACAfAADuAwAgAgAAANEDACAfAADtAwAgDNUBAQCvAwAh2wEAANMD_AEi3wFAALQDACHgAUAAtQMAIeEBQAC1AwAh9AEBALEDACH1AQEArwMAIfYBAQCxAwAh-AEBALEDACH5AQEAsQMAIfoBAQCvAwAh_QEAANQD_QEiEgYAANYDACAOAADbAwAgFAAA2AMAIBUAANkDACAWAADvAwAgFwAA2gMAINUBAQCvAwAh2wEAANMD_AEi3wFAALQDACHgAUAAtQMAIeEBQAC1AwAh9AEBALEDACH1AQEArwMAIfYBAQCxAwAh-AEBALEDACH5AQEAsQMAIfoBAQCvAwAh_QEAANQD_QEiByYAAKgGACAnAACvBgAgmAIAAKkGACCZAgAArgYAIJwCAAA9ACCdAgAAPQAgngIAAKoCACASBgAA8QMAIA4AAPYDACAUAADyAwAgFQAA8wMAIBYAAPQDACAXAAD1AwAg1QEBAAAAAdsBAAAA_AEC3wFAAAAAAeABQAAAAAHhAUAAAAAB9AEBAAAAAfUBAQAAAAH2AQEAAAAB-AEBAAAAAfkBAQAAAAH6AQEAAAAB_QEAAAD9AQIDJgAArAYAIJgCAACtBgAgngIAACYAIAQmAADnAwAwmAIAAOgDADCaAgAA6gMAIJ4CAADNAwAwAyYAAKoGACCYAgAAqwYAIJ4CAACqAgAgAyYAAKgGACCYAgAAqQYAIJ4CAACqAgAgAyYAAKYGACCYAgAApwYAIJ4CAAAyACAEJgAA3AMAMJgCAADdAwAwmgIAAN8DACCeAgAAvwMAMBIGAADxAwAgDgAA9gMAIBMAAPgDACAUAADyAwAgFQAA8wMAIBcAAPUDACDVAQEAAAAB2wEAAAD8AQLfAUAAAAAB4AFAAAAAAeEBQAAAAAH0AQEAAAAB9QEBAAAAAfYBAQAAAAH3AQEAAAAB-AEBAAAAAfoBAQAAAAH9AQAAAP0BAgMmAACkBgAgmAIAAKUGACCeAgAAFQAgEgYAAPEDACAOAAD2AwAgEwAA-AMAIBQAAPIDACAWAAD0AwAgFwAA9QMAINUBAQAAAAHbAQAAAPwBAt8BQAAAAAHgAUAAAAAB4QFAAAAAAfQBAQAAAAH1AQEAAAAB9gEBAAAAAfcBAQAAAAH5AQEAAAAB-gEBAAAAAf0BAAAA_QECAgAAABUAICYAAIEEACADAAAAFQAgJgAAgQQAICcAAIAEACABHwAAowYAMAIAAAAVACAfAACABAAgAgAAANEDACAfAAD_AwAgDNUBAQCvAwAh2wEAANMD_AEi3wFAALQDACHgAUAAtQMAIeEBQAC1AwAh9AEBALEDACH1AQEArwMAIfYBAQCxAwAh9wEBALEDACH5AQEAsQMAIfoBAQCvAwAh_QEAANQD_QEiEgYAANYDACAOAADbAwAgEwAA1wMAIBQAANgDACAWAADvAwAgFwAA2gMAINUBAQCvAwAh2wEAANMD_AEi3wFAALQDACHgAUAAtQMAIeEBQAC1AwAh9AEBALEDACH1AQEArwMAIfYBAQCxAwAh9wEBALEDACH5AQEAsQMAIfoBAQCvAwAh_QEAANQD_QEiEgYAAPEDACAOAAD2AwAgEwAA-AMAIBQAAPIDACAWAAD0AwAgFwAA9QMAINUBAQAAAAHbAQAAAPwBAt8BQAAAAAHgAUAAAAAB4QFAAAAAAfQBAQAAAAH1AQEAAAAB9gEBAAAAAfcBAQAAAAH5AQEAAAAB-gEBAAAAAf0BAAAA_QECBAcAAI8EACDgAUAAAAAB4QFAAAAAAfABAQAAAAECAAAACgAgJgAAjgQAIAMAAAAKACAmAACOBAAgJwAAjAQAIAEfAACiBgAwCgcAAKQDACAKAACbAwAg0gEAAKYDADDTAQAACAAQ1AEAAKYDADDgAUAA4QIAIeEBQADhAgAh8AEBAN0CACHxAQEA3QIAIZQCAAClAwAgAgAAAAoAIB8AAIwEACACAAAAigQAIB8AAIsEACAH0gEAAIkEADDTAQAAigQAENQBAACJBAAw4AFAAOECACHhAUAA4QIAIfABAQDdAgAh8QEBAN0CACEH0gEAAIkEADDTAQAAigQAENQBAACJBAAw4AFAAOECACHhAUAA4QIAIfABAQDdAgAh8QEBAN0CACED4AFAALUDACHhAUAAtQMAIfABAQCvAwAhBAcAAI0EACDgAUAAtQMAIeEBQAC1AwAh8AEBAK8DACEFJgAAnQYAICcAAKAGACCYAgAAngYAIJkCAACfBgAgngIAACIAIAQHAACPBAAg4AFAAAAAAeEBQAAAAAHwAQEAAAABAyYAAJ0GACCYAgAAngYAIJ4CAAAiACAHAwAAnwQAINUBAQAAAAHbAQAAAI4CAuABQAAAAAHhAUAAAAAB8gEBAAAAAYwCAAAAjAICAgAAAAUAICYAAJ4EACADAAAABQAgJgAAngQAICcAAJwEACABHwAAnAYAMA0DAACTAwAgCgAAmwMAINIBAACoAwAw0wEAAAMAENQBAACoAwAw1QEBAAAAAdsBAACqA44CIuABQADhAgAh4QFAAOECACHxAQEA3QIAIfIBAQDdAgAhjAIAAKkDjAIilQIAAKcDACACAAAABQAgHwAAnAQAIAIAAACYBAAgHwAAmQQAIArSAQAAlwQAMNMBAACYBAAQ1AEAAJcEADDVAQEA3QIAIdsBAACqA44CIuABQADhAgAh4QFAAOECACHxAQEA3QIAIfIBAQDdAgAhjAIAAKkDjAIiCtIBAACXBAAw0wEAAJgEABDUAQAAlwQAMNUBAQDdAgAh2wEAAKoDjgIi4AFAAOECACHhAUAA4QIAIfEBAQDdAgAh8gEBAN0CACGMAgAAqQOMAiIG1QEBAK8DACHbAQAAmwSOAiLgAUAAtQMAIeEBQAC1AwAh8gEBAK8DACGMAgAAmgSMAiIBmwIAAACMAgIBmwIAAACOAgIHAwAAnQQAINUBAQCvAwAh2wEAAJsEjgIi4AFAALUDACHhAUAAtQMAIfIBAQCvAwAhjAIAAJoEjAIiBSYAAJcGACAnAACaBgAgmAIAAJgGACCZAgAAmQYAIJ4CAABZACAHAwAAnwQAINUBAQAAAAHbAQAAAI4CAuABQAAAAAHhAUAAAAAB8gEBAAAAAYwCAAAAjAICAyYAAJcGACCYAgAAmAYAIJ4CAABZACAEJgAAkAQAMJgCAACRBAAwmgIAAJMEACCeAgAAlAQAMAQmAACCBAAwmAIAAIMEADCaAgAAhQQAIJ4CAACGBAAwBCYAAPkDADCYAgAA-gMAMJoCAAD8AwAgngIAAM0DADAEJgAAyQMAMJgCAADKAwAwmgIAAMwDACCeAgAAzQMAMAQmAAC7AwAwmAIAALwDADCaAgAAvgMAIJ4CAAC_AwAwAAAAAAAAAAUmAACSBgAgJwAAlQYAIJgCAACTBgAgmQIAAJQGACCeAgAAqgIAIAMmAACSBgAgmAIAAJMGACCeAgAAqgIAIAAAAAUmAACGBgAgJwAAkAYAIJgCAACHBgAgmQIAAI8GACCeAgAAWQAgCyYAAMIEADAnAADGBAAwmAIAAMMEADCZAgAAxAQAMJoCAADFBAAgmwIAAIYEADCcAgAAhgQAMJ0CAACGBAAwngIAAIYEADCfAgAAxwQAMKACAACJBAAwCyYAALQEADAnAAC5BAAwmAIAALUEADCZAgAAtgQAMJoCAAC3BAAgmwIAALgEADCcAgAAuAQAMJ0CAAC4BAAwngIAALgEADCfAgAAugQAMKACAAC7BAAwAwYAAMEEACD1AQEAAAABigJAAAAAAQIAAAAPACAmAADABAAgAwAAAA8AICYAAMAEACAnAAC-BAAgAR8AAI4GADAJBgAAjgMAIAcAAKQDACDSAQAAowMAMNMBAAANABDUAQAAowMAMPABAQDdAgAh9QEBAN0CACGKAkAA4QIAIZMCAACiAwAgAgAAAA8AIB8AAL4EACACAAAAvAQAIB8AAL0EACAG0gEAALsEADDTAQAAvAQAENQBAAC7BAAw8AEBAN0CACH1AQEA3QIAIYoCQADhAgAhBtIBAAC7BAAw0wEAALwEABDUAQAAuwQAMPABAQDdAgAh9QEBAN0CACGKAkAA4QIAIQL1AQEArwMAIYoCQAC1AwAhAwYAAL8EACD1AQEArwMAIYoCQAC1AwAhBSYAAIkGACAnAACMBgAgmAIAAIoGACCZAgAAiwYAIJ4CAAAmACADBgAAwQQAIPUBAQAAAAGKAkAAAAABAyYAAIkGACCYAgAAigYAIJ4CAAAmACAECgAArQQAIOABQAAAAAHhAUAAAAAB8QEBAAAAAQIAAAAKACAmAADKBAAgAwAAAAoAICYAAMoEACAnAADJBAAgAR8AAIgGADACAAAACgAgHwAAyQQAIAIAAACKBAAgHwAAyAQAIAPgAUAAtQMAIeEBQAC1AwAh8QEBAK8DACEECgAArAQAIOABQAC1AwAh4QFAALUDACHxAQEArwMAIQQKAACtBAAg4AFAAAAAAeEBQAAAAAHxAQEAAAABAyYAAIYGACCYAgAAhwYAIJ4CAABZACAEJgAAwgQAMJgCAADDBAAwmgIAAMUEACCeAgAAhgQAMAQmAAC0BAAwmAIAALUEADCaAgAAtwQAIJ4CAAC4BAAwAAAAAAAAAAABmwIAAAD_AQIFmwIQAAAAAaECEAAAAAGiAhAAAAABowIQAAAAAaQCEAAAAAEBmwIAAACEAgIFJgAAgQYAICcAAIQGACCYAgAAggYAIJkCAACDBgAgngIAAFkAIAMmAACBBgAgmAIAAIIGACCeAgAAWQAgAAAAAZsCAAAAiAICBSYAAPsFACAnAAD_BQAgmAIAAPwFACCZAgAA_gUAIJ4CAAAmACALJgAA4QQAMCcAAOUEADCYAgAA4gQAMJkCAADjBAAwmgIAAOQEACCbAgAAzQMAMJwCAADNAwAwnQIAAM0DADCeAgAAzQMAMJ8CAADmBAAwoAIAANADADASBgAA8QMAIA4AAPYDACATAAD4AwAgFAAA8gMAIBUAAPMDACAWAAD0AwAg1QEBAAAAAdsBAAAA_AEC3wFAAAAAAeABQAAAAAHhAUAAAAAB9AEBAAAAAfUBAQAAAAH3AQEAAAAB-AEBAAAAAfkBAQAAAAH6AQEAAAAB_QEAAAD9AQICAAAAFQAgJgAA6QQAIAMAAAAVACAmAADpBAAgJwAA6AQAIAEfAAD9BQAwAgAAABUAIB8AAOgEACACAAAA0QMAIB8AAOcEACAM1QEBAK8DACHbAQAA0wP8ASLfAUAAtAMAIeABQAC1AwAh4QFAALUDACH0AQEAsQMAIfUBAQCvAwAh9wEBALEDACH4AQEAsQMAIfkBAQCxAwAh-gEBAK8DACH9AQAA1AP9ASISBgAA1gMAIA4AANsDACATAADXAwAgFAAA2AMAIBUAANkDACAWAADvAwAg1QEBAK8DACHbAQAA0wP8ASLfAUAAtAMAIeABQAC1AwAh4QFAALUDACH0AQEAsQMAIfUBAQCvAwAh9wEBALEDACH4AQEAsQMAIfkBAQCxAwAh-gEBAK8DACH9AQAA1AP9ASISBgAA8QMAIA4AAPYDACATAAD4AwAgFAAA8gMAIBUAAPMDACAWAAD0AwAg1QEBAAAAAdsBAAAA_AEC3wFAAAAAAeABQAAAAAHhAUAAAAAB9AEBAAAAAfUBAQAAAAH3AQEAAAAB-AEBAAAAAfkBAQAAAAH6AQEAAAAB_QEAAAD9AQIDJgAA-wUAIJgCAAD8BQAgngIAACYAIAQmAADhBAAwmAIAAOIEADCaAgAA5AQAIJ4CAADNAwAwAAAABSYAAPYFACAnAAD5BQAgmAIAAPcFACCZAgAA-AUAIJ4CAAAiACADJgAA9gUAIJgCAAD3BQAgngIAACIAIAAAAAUmAADuBQAgJwAA9AUAIJgCAADvBQAgmQIAAPMFACCeAgAAWQAgCyYAAIoFADAnAACPBQAwmAIAAIsFADCZAgAAjAUAMJoCAACNBQAgmwIAAI4FADCcAgAAjgUAMJ0CAACOBQAwngIAAI4FADCfAgAAkAUAMKACAACRBQAwCyYAAIEFADAnAACFBQAwmAIAAIIFADCZAgAAgwUAMJoCAACEBQAgmwIAALgEADCcAgAAuAQAMJ0CAAC4BAAwngIAALgEADCfAgAAhgUAMKACAAC7BAAwCyYAAPgEADAnAAD8BAAwmAIAAPkEADCZAgAA-gQAMJoCAAD7BAAgmwIAAM0DADCcAgAAzQMAMJ0CAADNAwAwngIAAM0DADCfAgAA_QQAMKACAADQAwAwEg4AAPYDACATAAD4AwAgFAAA8gMAIBUAAPMDACAWAAD0AwAgFwAA9QMAINUBAQAAAAHbAQAAAPwBAt8BQAAAAAHgAUAAAAAB4QFAAAAAAfQBAQAAAAH2AQEAAAAB9wEBAAAAAfgBAQAAAAH5AQEAAAAB-gEBAAAAAf0BAAAA_QECAgAAABUAICYAAIAFACADAAAAFQAgJgAAgAUAICcAAP8EACABHwAA8gUAMAIAAAAVACAfAAD_BAAgAgAAANEDACAfAAD-BAAgDNUBAQCvAwAh2wEAANMD_AEi3wFAALQDACHgAUAAtQMAIeEBQAC1AwAh9AEBALEDACH2AQEAsQMAIfcBAQCxAwAh-AEBALEDACH5AQEAsQMAIfoBAQCvAwAh_QEAANQD_QEiEg4AANsDACATAADXAwAgFAAA2AMAIBUAANkDACAWAADvAwAgFwAA2gMAINUBAQCvAwAh2wEAANMD_AEi3wFAALQDACHgAUAAtQMAIeEBQAC1AwAh9AEBALEDACH2AQEAsQMAIfcBAQCxAwAh-AEBALEDACH5AQEAsQMAIfoBAQCvAwAh_QEAANQD_QEiEg4AAPYDACATAAD4AwAgFAAA8gMAIBUAAPMDACAWAAD0AwAgFwAA9QMAINUBAQAAAAHbAQAAAPwBAt8BQAAAAAHgAUAAAAAB4QFAAAAAAfQBAQAAAAH2AQEAAAAB9wEBAAAAAfgBAQAAAAH5AQEAAAAB-gEBAAAAAf0BAAAA_QECAwcAAPAEACDwAQEAAAABigJAAAAAAQIAAAAPACAmAACJBQAgAwAAAA8AICYAAIkFACAnAACIBQAgAR8AAPEFADACAAAADwAgHwAAiAUAIAIAAAC8BAAgHwAAhwUAIALwAQEArwMAIYoCQAC1AwAhAwcAAO8EACDwAQEArwMAIYoCQAC1AwAhAwcAAPAEACDwAQEAAAABigJAAAAAAQoRAADrBAAg1QEBAAAAAdsBAAAAiAIC3wFAAAAAAeABQAAAAAHhAUAAAAAB8wEBAAAAAYYCAQAAAAGIAkAAAAABiQJAAAAAAQIAAAAyACAmAACVBQAgAwAAADIAICYAAJUFACAnAACUBQAgAR8AAPAFADAPBgAAjgMAIBEAAOQCACDSAQAAjAMAMNMBAAAwABDUAQAAjAMAMNUBAQAAAAHbAQAAjQOIAiLfAUAA4AIAIeABQADhAgAh4QFAAOECACHzAQEA3QIAIfUBAQDdAgAhhgIBANwCACGIAkAA4AIAIYkCQADgAgAhAgAAADIAIB8AAJQFACACAAAAkgUAIB8AAJMFACAN0gEAAJEFADDTAQAAkgUAENQBAACRBQAw1QEBAN0CACHbAQAAjQOIAiLfAUAA4AIAIeABQADhAgAh4QFAAOECACHzAQEA3QIAIfUBAQDdAgAhhgIBANwCACGIAkAA4AIAIYkCQADgAgAhDdIBAACRBQAw0wEAAJIFABDUAQAAkQUAMNUBAQDdAgAh2wEAAI0DiAIi3wFAAOACACHgAUAA4QIAIeEBQADhAgAh8wEBAN0CACH1AQEA3QIAIYYCAQDcAgAhiAJAAOACACGJAkAA4AIAIQnVAQEArwMAIdsBAADeBIgCIt8BQAC0AwAh4AFAALUDACHhAUAAtQMAIfMBAQCvAwAhhgIBALEDACGIAkAAtAMAIYkCQAC0AwAhChEAAOAEACDVAQEArwMAIdsBAADeBIgCIt8BQAC0AwAh4AFAALUDACHhAUAAtQMAIfMBAQCvAwAhhgIBALEDACGIAkAAtAMAIYkCQAC0AwAhChEAAOsEACDVAQEAAAAB2wEAAACIAgLfAUAAAAAB4AFAAAAAAeEBQAAAAAHzAQEAAAABhgIBAAAAAYgCQAAAAAGJAkAAAAABAyYAAO4FACCYAgAA7wUAIJ4CAABZACAEJgAAigUAMJgCAACLBQAwmgIAAI0FACCeAgAAjgUAMAQmAACBBQAwmAIAAIIFADCaAgAAhAUAIJ4CAAC4BAAwBCYAAPgEADCYAgAA-QQAMJoCAAD7BAAgngIAAM0DADAAAAAFJgAA6QUAICcAAOwFACCYAgAA6gUAIJkCAADrBQAgngIAAKoCACADJgAA6QUAIJgCAADqBQAgngIAAKoCACAAAAALJgAAygUAMCcAAM4FADCYAgAAywUAMJkCAADMBQAwmgIAAM0FACCbAgAAlAQAMJwCAACUBAAwnQIAAJQEADCeAgAAlAQAMJ8CAADPBQAwoAIAAJcEADALJgAAvgUAMCcAAMMFADCYAgAAvwUAMJkCAADABQAwmgIAAMEFACCbAgAAwgUAMJwCAADCBQAwnQIAAMIFADCeAgAAwgUAMJ8CAADEBQAwoAIAAMUFADALJgAAsgUAMCcAALcFADCYAgAAswUAMJkCAAC0BQAwmgIAALUFACCbAgAAtgUAMJwCAAC2BQAwnQIAALYFADCeAgAAtgUAMJ8CAAC4BQAwoAIAALkFADALJgAApgUAMCcAAKsFADCYAgAApwUAMJkCAACoBQAwmgIAAKkFACCbAgAAqgUAMJwCAACqBQAwnQIAAKoFADCeAgAAqgUAMJ8CAACsBQAwoAIAAK0FADAK1QEBAAAAAdsBAAAAhAIC4AFAAAAAAeEBQAAAAAH_AQAAAP8BAoACAQAAAAGBAhAAAAABggIBAAAAAYQCAQAAAAGFAkAAAAABAgAAACoAICYAALEFACADAAAAKgAgJgAAsQUAICcAALAFACABHwAA6AUAMA8DAACTAwAg0gEAAI8DADDTAQAAKAAQ1AEAAI8DADDVAQEAAAAB2wEAAJIDhAIi4AFAAOECACHhAUAA4QIAIfIBAQDdAgAh_wEAAJAD_wEigAIBAAAAAYECEACRAwAhggIBAN0CACGEAgEA3QIAIYUCQADgAgAhAgAAACoAIB8AALAFACACAAAArgUAIB8AAK8FACAO0gEAAK0FADDTAQAArgUAENQBAACtBQAw1QEBAN0CACHbAQAAkgOEAiLgAUAA4QIAIeEBQADhAgAh8gEBAN0CACH_AQAAkAP_ASKAAgEA3QIAIYECEACRAwAhggIBAN0CACGEAgEA3QIAIYUCQADgAgAhDtIBAACtBQAw0wEAAK4FABDUAQAArQUAMNUBAQDdAgAh2wEAAJIDhAIi4AFAAOECACHhAUAA4QIAIfIBAQDdAgAh_wEAAJAD_wEigAIBAN0CACGBAhAAkQMAIYICAQDdAgAhhAIBAN0CACGFAkAA4AIAIQrVAQEArwMAIdsBAADYBIQCIuABQAC1AwAh4QFAALUDACH_AQAA1gT_ASKAAgEArwMAIYECEADXBAAhggIBAK8DACGEAgEArwMAIYUCQAC0AwAhCtUBAQCvAwAh2wEAANgEhAIi4AFAALUDACHhAUAAtQMAIf8BAADWBP8BIoACAQCvAwAhgQIQANcEACGCAgEArwMAIYQCAQCvAwAhhQJAALQDACEK1QEBAAAAAdsBAAAAhAIC4AFAAAAAAeEBQAAAAAH_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_wEAAAD_AQKAAgEAAAABgQIQAAAAAYICAQAAAAGEAgEAAAABhQJAAAAAAQ8LAAChBAAgDAAAogQAIA0AAKMEACAOAACkBAAg1QEBAAAAAdYBAQAAAAHXASAAAAAB2AEBAAAAAdkBAQAAAAHbAQAAANsBAt0BAAAA3QEC3gEBAAAAAd8BQAAAAAHgAUAAAAAB4QFAAAAAAQIAAACqAgAgJgAA6QUAIAMAAAA9ACAmAADpBQAgJwAA7QUAIBEAAAA9ACALAAC3AwAgDAAAuAMAIA0AALkDACAOAAC6AwAgHwAA7QUAINUBAQCvAwAh1gEBAK8DACHXASAAsAMAIdgBAQCxAwAh2QEBAK8DACHbAQAAsgPbASLdAQAAswPdASLeAQEAsQMAId8BQAC0AwAh4AFAALUDACHhAUAAtQMAIQ8LAAC3AwAgDAAAuAMAIA0AALkDACAOAAC6AwAg1QEBAK8DACHWAQEArwMAIdcBIACwAwAh2AEBALEDACHZAQEArwMAIdsBAACyA9sBIt0BAACzA90BIt4BAQCxAwAh3wFAALQDACHgAUAAtQMAIeEBQAC1AwAhCQQAANMFACAPAADUBQAgEAAA1gUAINUBAQAAAAHfAUAAAAAB4AFAAAAAAeEBQAAAAAHzAQEAAAABjgIBAAAAAQIAAABZACAmAADuBQAgCdUBAQAAAAHbAQAAAIgCAt8BQAAAAAHgAUAAAAAB4QFAAAAAAfMBAQAAAAGGAgEAAAABiAJAAAAAAYkCQAAAAAEC8AEBAAAAAYoCQAAAAAEM1QEBAAAAAdsBAAAA_AEC3wFAAAAAAeABQAAAAAHhAUAAAAAB9AEBAAAAAfYBAQAAAAH3AQEAAAAB-AEBAAAAAfkBAQAAAAH6AQEAAAAB_QEAAAD9AQIDAAAAXAAgJgAA7gUAICcAAPUFACALAAAAXAAgBAAAogUAIA8AAKMFACAQAAClBQAgHwAA9QUAINUBAQCvAwAh3wFAALQDACHgAUAAtQMAIeEBQAC1AwAh8wEBAK8DACGOAgEArwMAIQkEAACiBQAgDwAAowUAIBAAAKUFACDVAQEArwMAId8BQAC0AwAh4AFAALUDACHhAUAAtQMAIfMBAQCvAwAhjgIBAK8DACEJAwAAywQAIAUAAMwEACDVAQEAAAAB3wFAAAAAAeABQAAAAAHhAUAAAAAB8gEBAAAAAfMBAQAAAAH0AQEAAAABAgAAACIAICYAAPYFACADAAAAIAAgJgAA9gUAICcAAPoFACALAAAAIAAgAwAAsQQAIAUAALIEACAfAAD6BQAg1QEBAK8DACHfAUAAtAMAIeABQAC1AwAh4QFAALUDACHyAQEArwMAIfMBAQCvAwAh9AEBALEDACEJAwAAsQQAIAUAALIEACDVAQEArwMAId8BQAC0AwAh4AFAALUDACHhAUAAtQMAIfIBAQCvAwAh8wEBAK8DACH0AQEAsQMAIQsDAACWBQAgDwAAmAUAIBEAAJkFACDVAQEAAAAB2wEBAAAAAd8BQAAAAAHgAUAAAAAB4QFAAAAAAfIBAQAAAAHzAQEAAAAB9AEBAAAAAQIAAAAmACAmAAD7BQAgDNUBAQAAAAHbAQAAAPwBAt8BQAAAAAHgAUAAAAAB4QFAAAAAAfQBAQAAAAH1AQEAAAAB9wEBAAAAAfgBAQAAAAH5AQEAAAAB-gEBAAAAAf0BAAAA_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-gEBAAAAAf0BAAAA_QECEwYAAPEDACAOAAD2AwAgEwAA-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_AEi3wFAALQDACHgAUAAtQMAIeEBQAC1AwAh9AEBALEDACH1AQEArwMAIfYBAQCxAwAh9wEBALEDACH4AQEAsQMAIfkBAQCxAwAh-gEBAK8DACH9AQAA1AP9ASITBgAA1gMAIA4AANsDACATAADXAwAgFQAA2QMAIBYAAO8DACAXAADaAwAg1QEBAK8DACHbAQAA0wP8ASLfAUAAtAMAIeABQAC1AwAh4QFAALUDACH0AQEAsQMAIfUBAQCvAwAh9gEBALEDACH3AQEAsQMAIfgBAQCxAwAh-QEBALEDACH6AQEArwMAIf0BAADUA_0BIgMAAAAkACAmAACsBgAgJwAAwwYAIA0AAAAkACADAAD0BAAgDwAA9gQAIBIAAPUEACAfAADDBgAg1QEBAK8DACHbAQEArwMAId8BQAC0AwAh4AFAALUDACHhAUAAtQMAIfIBAQCvAwAh8wEBAK8DACH0AQEAsQMAIQsDAAD0BAAgDwAA9gQAIBIAAPUEACDVAQEArwMAIdsBAQCvAwAh3wFAALQDACHgAUAAtQMAIeEBQAC1AwAh8gEBAK8DACHzAQEArwMAIfQBAQCxAwAhDNUBAQAAAAHbAQAAAPwBAt8BQAAAAAHgAUAAAAAB4QFAAAAAAfQBAQAAAAH1AQEAAAAB9gEBAAAAAfcBAQAAAAH4AQEAAAAB-gEBAAAAAf0BAAAA_QECEwYAAPEDACATAAD4AwAgFAAA8gMAIBUAAPMDACAWAAD0AwAgFwAA9QMAINUBAQAAAAHbAQAAAPwBAt8BQAAAAAHgAUAAAAAB4QFAAAAAAfQBAQAAAAH1AQEAAAAB9gEBAAAAAfcBAQAAAAH4AQEAAAAB-QEBAAAAAfoBAQAAAAH9AQAAAP0BAgIAAAAVACAmAADFBgAgAwAAABMAICYAAMUGACAnAADJBgAgFQAAABMAIAYAANYDACATAADXAwAgFAAA2AMAIBUAANkDACAWAADvAwAgFwAA2gMAIB8AAMkGACDVAQEArwMAIdsBAADTA_wBIt8BQAC0AwAh4AFAALUDACHhAUAAtQMAIfQBAQCxAwAh9QEBAK8DACH2AQEAsQMAIfcBAQCxAwAh-AEBALEDACH5AQEAsQMAIfoBAQCvAwAh_QEAANQD_QEiEwYAANYDACATAADXAwAgFAAA2AMAIBUAANkDACAWAADvAwAgFwAA2gMAINUBAQCvAwAh2wEAANMD_AEi3wFAALQDACHgAUAAtQMAIeEBQAC1AwAh9AEBALEDACH1AQEArwMAIfYBAQCxAwAh9wEBALEDACH4AQEAsQMAIfkBAQCxAwAh-gEBAK8DACH9AQAA1AP9ASIG1QEBAAAAAd8BQAAAAAHgAUAAAAAB4QFAAAAAAY8CAQAAAAGRAgEAAAABAhgAAhkABggGAAMJABEOQQETOwIUPAIVPgYWPwYXQA4FAwAECQAQDzYJETcCEjMOBQQGBQgnAwkADQ8jCBArDAIDAAQKAAYGBAcFCQALCwsHDBYCDRcCDhoBAgcACAoABgQDAAQFDAcIEAkJAAoCBgADBwAIAgURAAgSAAUEGwALHAAMHQANHgAOHwABAwAEBAQsAAguAA8tABAvAAMGAAMJAA8RNAIBETUAAw85ABE6ABI4AAIOQwAUQgAAAhgAAhkABgIYAAIZAAYDCQAWLAAXLQAYAAAAAwkAFiwAFy0AGAAAAwkAHSwAHi0AHwAAAAMJAB0sAB4tAB8CAwAECgAGAgMABAoABgMJACQsACUtACYAAAADCQAkLAAlLQAmAQMABAEDAAQDCQArLAAsLQAtAAAAAwkAKywALC0ALQIGAAMHAAgCBgADBwAIAwkAMiwAMy0ANAAAAAMJADIsADMtADQBBgADAQYAAwMJADksADotADsAAAADCQA5LAA6LQA7AQMABAEDAAQFCQBALABDLQBEjgEAQY8BAEIAAAAAAAUJAEAsAEMtAESOAQBBjwEAQgUGAAMT6gECFesBBhbsAQYX7QEOBQYAAxPzAQIV9AEGFvUBBhf2AQ4DCQBJLABKLQBLAAAAAwkASSwASi0ASwEDAAQBAwAEAwkAUCwAUS0AUgAAAAMJAFAsAFEtAFICBwAICgAGAgcACAoABgMJAFcsAFgtAFkAAAADCQBXLABYLQBZAAADCQBeLABfLQBgAAAAAwkAXiwAXy0AYBoCARtEARxFAR1GAR5HASBJASFLEiJMEyNOASRQEiVRFChSASlTASpUEi5XFS9YGTBaBDFbBDJeBDNfBDRgBDViBDZkEjdlGjhnBDlpEjpqGztrBDxsBD1tEj5wHD9xIEByBUFzBUJ0BUN1BUR2BUV4BUZ6Ekd7IUh9BUl_EkqAASJLgQEFTIIBBU2DARJOhgEjT4cBJ1CIAQNRiQEDUooBA1OLAQNUjAEDVY4BA1aQARJXkQEoWJMBA1mVARJalgEpW5cBA1yYAQNdmQESXpwBKl-dAS5gngEJYZ8BCWKgAQljoQEJZKIBCWWkAQlmpgESZ6cBL2ipAQlpqwESaqwBMGutAQlsrgEJba8BEm6yATFvswE1cLQBDnG1AQ5ytgEOc7cBDnS4AQ51ugEOdrwBEne9ATZ4vwEOecEBEnrCATd7wwEOfMQBDn3FARJ-yAE4f8kBPIABygEMgQHLAQyCAcwBDIMBzQEMhAHOAQyFAdABDIYB0gEShwHTAT2IAdUBDIkB1wESigHYAT6LAdkBDIwB2gEMjQHbARKQAd4BP5EB3wFFkgHgAQKTAeEBApQB4gEClQHjAQKWAeQBApcB5gECmAHoARKZAekBRpoB7wECmwHxARKcAfIBR50B9wECngH4AQKfAfkBEqAB_AFIoQH9AUyiAf4BCKMB_wEIpAGAAgilAYECCKYBggIIpwGEAgioAYYCEqkBhwJNqgGJAgirAYsCEqwBjAJOrQGNAgiuAY4CCK8BjwISsAGSAk-xAZMCU7IBlAIHswGVAge0AZYCB7UBlwIHtgGYAge3AZoCB7gBnAISuQGdAlS6AZ8CB7sBoQISvAGiAlW9AaMCB74BpAIHvwGlAhLAAagCVsEBqQJawgGrAgbDAawCBsQBrgIGxQGvAgbGAbACBscBsgIGyAG0AhLJAbUCW8oBtwIGywG5AhLMAboCXM0BuwIGzgG8AgbPAb0CEtABwAJd0QHBAmE"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// prisma/generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AnyNull: () => AnyNull2,
  CommentScalarFieldEnum: () => CommentScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  OrganizationMembershipScalarFieldEnum: () => OrganizationMembershipScalarFieldEnum,
  OrganizationScalarFieldEnum: () => OrganizationScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  ProjectScalarFieldEnum: () => ProjectScalarFieldEnum,
  ProjectTeamScalarFieldEnum: () => ProjectTeamScalarFieldEnum,
  QueryMode: () => QueryMode,
  SortOrder: () => SortOrder,
  SprintScalarFieldEnum: () => SprintScalarFieldEnum,
  Sql: () => Sql2,
  SubscriptionScalarFieldEnum: () => SubscriptionScalarFieldEnum,
  TaskScalarFieldEnum: () => TaskScalarFieldEnum,
  TeamMembershipScalarFieldEnum: () => TeamMembershipScalarFieldEnum,
  TeamScalarFieldEnum: () => TeamScalarFieldEnum,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.10.0",
  engine: "0edf323efd1d98336f3f0a68684b56f689b900d3"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  Comment: "Comment",
  Organization: "Organization",
  OrganizationMembership: "OrganizationMembership",
  Project: "Project",
  ProjectTeam: "ProjectTeam",
  Sprint: "Sprint",
  Subscription: "Subscription",
  Task: "Task",
  Team: "Team",
  TeamMembership: "TeamMembership",
  User: "User"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var CommentScalarFieldEnum = {
  id: "id",
  taskId: "taskId",
  authorId: "authorId",
  content: "content",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var OrganizationScalarFieldEnum = {
  id: "id",
  name: "name",
  slug: "slug",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var OrganizationMembershipScalarFieldEnum = {
  id: "id",
  organizationId: "organizationId",
  userId: "userId",
  role: "role",
  status: "status",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ProjectScalarFieldEnum = {
  id: "id",
  organizationId: "organizationId",
  name: "name",
  description: "description",
  status: "status",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ProjectTeamScalarFieldEnum = {
  projectId: "projectId",
  teamId: "teamId",
  assignedAt: "assignedAt"
};
var SprintScalarFieldEnum = {
  id: "id",
  projectId: "projectId",
  name: "name",
  goal: "goal",
  status: "status",
  startDate: "startDate",
  endDate: "endDate",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SubscriptionScalarFieldEnum = {
  id: "id",
  organizationId: "organizationId",
  gateway: "gateway",
  transactionId: "transactionId",
  amount: "amount",
  currency: "currency",
  status: "status",
  planName: "planName",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TaskScalarFieldEnum = {
  id: "id",
  projectId: "projectId",
  sprintId: "sprintId",
  parentTaskId: "parentTaskId",
  creatorId: "creatorId",
  assigneeId: "assigneeId",
  title: "title",
  description: "description",
  status: "status",
  priority: "priority",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TeamScalarFieldEnum = {
  id: "id",
  organizationId: "organizationId",
  name: "name",
  description: "description",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  deletedAt: "deletedAt"
};
var TeamMembershipScalarFieldEnum = {
  teamId: "teamId",
  userId: "userId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var UserScalarFieldEnum = {
  id: "id",
  email: "email",
  emailVerified: "emailVerified",
  passwordHash: "passwordHash",
  fullName: "fullName",
  status: "status",
  authProvider: "authProvider",
  authProviderId: "authProviderId",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// prisma/generated/prisma/enums.ts
var Role = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  MEMBER: "MEMBER"
};
var TaskStatus = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  REVIEW: "REVIEW",
  DONE: "DONE"
};
var TaskPriority = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  URGENT: "URGENT"
};
var SprintStatus = {
  PLANNING: "PLANNING",
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED"
};

// prisma/generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/app/middleware/global-error.ts
import { ZodError } from "zod";
import { StatusCodes } from "http-status-codes";

// src/app/config/index.ts
import path2 from "path";
import dotenv from "dotenv";
dotenv.config({ path: path2.join(process.cwd(), ".env") });
var config_default = {
  database_url: process.env.DATABASE_URL,
  node_env: process.env.NODE_ENV,
  port: process.env.PORT || 5e3,
  app_url: process.env.APP_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
  admin_password: process.env.ADMIN_PASSWORD,
  frontend_url: process.env.FRONTEND_URL,
  google_client_id: process.env.GOOGLE_CLIENT_ID,
  upstash_redis_rest_url: process.env.UPSTASH_REDIS_REST_URL,
  upstash_redis_rest_token: process.env.UPSTASH_REDIS_REST_TOKEN
};

// src/app/middleware/global-error.ts
var AppError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
  }
  statusCode;
};
var globalError = (err, req, res, _next) => {
  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let message = "Something went wrong";
  let errorDetails = [];
  if (config_default.node_env === "development") {
    console.error("Error:", err);
  }
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorDetails.push({
      field: "general",
      message: err.message
    });
  } else if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002": {
        statusCode = StatusCodes.CONFLICT;
        message = "Duplicate value found.";
        const field = Array.isArray(err.meta?.target) ? err.meta.target.join(", ") : String(err.meta?.target);
        errorDetails.push({
          field,
          message: `${field} already exists.`
        });
        break;
      }
      case "P2025":
        statusCode = StatusCodes.NOT_FOUND;
        message = "Resource not found.";
        errorDetails.push({
          field: "resource",
          message: "The requested resource does not exist."
        });
        break;
      case "P2003":
        statusCode = StatusCodes.BAD_REQUEST;
        message = "Invalid reference.";
        errorDetails.push({
          field: "relation",
          message: "Referenced record does not exist."
        });
        break;
      case "P2014":
        statusCode = StatusCodes.BAD_REQUEST;
        message = "Relation constraint failed.";
        errorDetails.push({
          field: "relation",
          message: "Operation violates required relation."
        });
        break;
      default:
        statusCode = StatusCodes.BAD_REQUEST;
        message = "Database request failed.";
        errorDetails.push({
          field: "database",
          message: err.message
        });
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = StatusCodes.BAD_REQUEST;
    message = "Database validation failed.";
    errorDetails.push({
      field: "database",
      message: err.message
    });
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    message = "Database connection failed.";
    errorDetails.push({
      field: "database",
      message: err.message
    });
  } else if (err instanceof prismaNamespace_exports.PrismaClientRustPanicError) {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    message = "Database engine crashed.";
    errorDetails.push({
      field: "database",
      message: "Unexpected database engine error."
    });
  } else if (err instanceof ZodError) {
    statusCode = StatusCodes.BAD_REQUEST;
    message = "Validation Error";
    errorDetails = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message
    }));
  } else if (err instanceof Error && err.name === "JsonWebTokenError") {
    statusCode = StatusCodes.UNAUTHORIZED;
    message = "Invalid access token.";
    errorDetails.push({
      field: "token",
      message: "The provided access token is invalid."
    });
  } else if (err instanceof Error && err.name === "TokenExpiredError") {
    statusCode = StatusCodes.UNAUTHORIZED;
    message = "Access token expired.";
    errorDetails.push({
      field: "token",
      message: "Please login again."
    });
  } else if (err instanceof Error) {
    message = err.message;
    errorDetails.push({
      field: "general",
      message: err.message
    });
  }
  if (process.env.NODE_ENV !== "production") {
  }
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errorDetails
  });
};
var global_error_default = globalError;

// src/app/middleware/rate-limiter.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
var redis = new Redis({
  url: config_default.upstash_redis_rest_url,
  token: config_default.upstash_redis_rest_token
});
var ratelimit = new Ratelimit({
  redis,
  // Maximum 25 requests per IP per 1 minute
  limiter: Ratelimit.slidingWindow(25, "1 m"),
  prefix: "orbrin:rate-limit",
  analytics: true
});
var rateLimiter = async (req, res, next) => {
  try {
    const forwardedFor = req.headers["x-forwarded-for"];
    let ip;
    if (Array.isArray(forwardedFor)) {
      ip = forwardedFor[0];
    } else if (forwardedFor) {
      ip = forwardedFor.split(",")[0].trim();
    } else {
      ip = req.ip ?? "unknown-ip";
    }
    const identifier = `ip:${ip}`;
    const { success, limit, reset, pending } = await ratelimit.limit(identifier);
    const resetInSeconds = Math.max(0, Math.ceil((reset - Date.now()) / 1e3));
    await pending;
    res.setHeader("RateLimit-Limit", limit);
    res.setHeader("RateLimit-Reset", reset);
    if (!success) {
      res.status(429).json({
        success: false,
        message: "Rate limit exceeded",
        errors: [
          {
            message: "Too many requests. Please try again later.",
            limit,
            resetInSeconds
          }
        ]
      });
      return;
    }
    next();
  } catch (error) {
    console.error("Rate limiter error:", error);
    next();
  }
};
var rate_limiter_default = rateLimiter;

// src/app/module/auth/auth.route.ts
import { Router } from "express";

// src/app/utils/catch-async.ts
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
var catch_async_default = catchAsync;

// src/app/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/app/module/auth/auth.service.ts
import bcrypt from "bcrypt";

// src/app/utils/jwt.ts
import jwt from "jsonwebtoken";
var createToken = (payload, secretKey, expire) => {
  const token = jwt.sign(payload, secretKey, {
    expiresIn: expire
  });
  return token;
};
var verifyToken = (token, secretKey) => {
  try {
    const verify = jwt.verify(token, secretKey);
    return {
      success: true,
      data: verify
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};
var jwtUtils = { createToken, verifyToken };

// src/app/lib/google.ts
import { OAuth2Client } from "google-auth-library";
var client = new OAuth2Client(config_default.google_client_id);
var verifyGoogleToken = async (idToken) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: config_default.google_client_id
    });
    return ticket.getPayload();
  } catch (error) {
    console.error("Error verifying Google token:", error);
    throw new Error("Invalid Google token");
  }
};

// src/app/module/auth/auth.service.ts
var registerOrgOwner = async (payload) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email }
  });
  if (existingUser) {
    throw new Error("Organization owner with this email already exists.");
  }
  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config_default.bcrypt_salt_rounds)
  );
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        fullName: payload.fullName,
        email: payload.email,
        passwordHash: hashedPassword
      },
      omit: { passwordHash: true }
    });
    const organization = await tx.organization.create({
      data: {
        name: payload.organizationName,
        slug: payload.organizationSlug
      }
    });
    const membership = await tx.organizationMembership.create({
      data: {
        userId: user.id,
        organizationId: organization.id,
        role: "ADMIN"
      }
    });
    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName
      },
      organization: {
        id: organization.id,
        name: organization.name,
        slug: organization.slug
      },
      role: membership.role
    };
  });
  return result;
};
var registerMember = async (payload) => {
  const organization = await prisma.organization.findUnique({
    where: { id: payload.organizationId }
  });
  if (!organization || organization.deletedAt) {
    throw new Error("Organization not found.");
  }
  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config_default.bcrypt_salt_rounds)
  );
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        fullName: payload.fullName,
        email: payload.email,
        passwordHash: hashedPassword
      },
      omit: { passwordHash: true }
    });
    const membership = await tx.organizationMembership.create({
      data: {
        userId: user.id,
        organizationId: payload.organizationId,
        role: "MEMBER"
      }
    });
    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName
      },
      organizationId: membership.organizationId,
      role: membership.role
    };
  });
  return result;
};
var login = async (payload) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
    include: {
      memberships: true
    }
  });
  if (!user || user.deletedAt) {
    throw new Error("Invalid email or password");
  }
  if (!user.passwordHash && user.authProvider === "GOOGLE") {
    throw new Error("Please login using Google Sign-In");
  }
  const isPasswordValid = await bcrypt.compare(
    payload.password,
    user?.passwordHash
  );
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }
  if (user.status !== "ACTIVE") {
    throw new Error("Account is inactive or blocked.");
  }
  const membership = user.memberships[0];
  if (!membership) {
    throw new Error("User does not belong to any organization.");
  }
  const jwtPayload = {
    id: user.id,
    email: user.email,
    name: user.fullName,
    role: membership.role,
    organizationId: membership.organizationId
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expires_in
  );
  const refreshToken3 = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_refresh_secret,
    config_default.jwt_refresh_expires_in
  );
  return {
    accessToken,
    refreshToken: refreshToken3,
    jwtPayload
  };
};
var getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    omit: {
      passwordHash: true
    },
    include: {
      memberships: {
        include: {
          organization: true
        }
      }
    }
  });
  if (!user || user.deletedAt) {
    throw new Error("User not found");
  }
  return user;
};
var refreshToken = async (incomingRefreshToken) => {
  const verifiedToken = jwtUtils.verifyToken(
    incomingRefreshToken,
    config_default.jwt_refresh_secret
  );
  if (!verifiedToken.success) {
    throw new Error("Invalid refresh token");
  }
  const { id } = verifiedToken.data;
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      memberships: true
    }
  });
  if (!user || user.deletedAt || user.status !== "ACTIVE") {
    throw new Error("User not found or inactive");
  }
  const membership = user.memberships[0];
  if (!membership) {
    throw new Error("User does not belong to an organization");
  }
  const jwtPayload = {
    id: user.id,
    email: user.email,
    name: user.fullName,
    role: membership.role,
    organizationId: membership.organizationId
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expires_in
  );
  return {
    accessToken,
    jwtPayload
  };
};
var googleLogin = async (idToken, defaultOrganizationId) => {
  const verifyResult = await verifyGoogleToken(idToken);
  const payload = verifyResult;
  if (!payload || !payload.email) {
    throw new Error("Invalid Google token");
  }
  const { sub: providerId, email, name: fullName } = payload;
  let user = await prisma.user.findUnique({
    where: { email, deletedAt: null, status: "ACTIVE" },
    include: {
      memberships: {
        select: {
          role: true,
          organizationId: true
        }
      }
    }
  });
  if (user?.memberships[0].role === "ADMIN") {
    throw new Error(
      "Organization owner cannot login via Google. Please use your email and password to login."
    );
  }
  if (user) {
    if (!user.authProviderId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          authProviderId: providerId,
          authProvider: "GOOGLE",
          emailVerified: true
        },
        include: {
          memberships: {
            select: {
              role: true,
              organizationId: true
            }
          }
        }
      });
    }
  } else {
    if (!defaultOrganizationId) {
      throw new Error("Organization ID is required for new Google signup.");
    }
    const organization = await prisma.organization.findUnique({
      where: { id: defaultOrganizationId, deletedAt: null }
    });
    if (!organization) {
      throw new Error("Organization not found");
    }
    user = await prisma.user.create({
      data: {
        fullName: fullName || "Google User",
        email,
        passwordHash: null,
        // No password for Google users
        authProvider: "GOOGLE",
        authProviderId: providerId,
        emailVerified: true,
        memberships: {
          create: { organizationId: defaultOrganizationId, role: "MEMBER" }
        }
      },
      include: {
        memberships: {
          select: {
            role: true,
            organizationId: true
          }
        }
      }
    });
  }
  if (!user) {
    throw new Error("User creation or retrieval failed.");
  }
  const jwtPayload = {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.memberships[0].role,
    organizationId: user.memberships[0].organizationId
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expires_in
  );
  const refreshToken3 = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_refresh_secret,
    config_default.jwt_refresh_expires_in
  );
  return {
    accessToken,
    refreshToken: refreshToken3,
    jwtPayload
  };
};
var authService = {
  registerOrgOwner,
  registerMember,
  login,
  getMe,
  refreshToken,
  googleLogin
};

// src/app/utils/response.ts
var sendSuccessResponse = (res, data) => {
  res.status(data.statusCode).json({
    success: true,
    message: data.message,
    data: data.data,
    meta: data?.meta
  });
};

// src/app/module/auth/auth.controller.ts
import { StatusCodes as StatusCodes2 } from "http-status-codes";
var registerOrgOwner2 = catch_async_default(
  async (req, res, next) => {
    const result = await authService.registerOrgOwner(req.body);
    sendSuccessResponse(res, {
      statusCode: StatusCodes2.CREATED,
      message: "Organization and Owner account created successfully",
      data: result
    });
  }
);
var registerMember2 = catch_async_default(
  async (req, res, next) => {
    const result = await authService.registerMember(req.body);
    sendSuccessResponse(res, {
      statusCode: StatusCodes2.CREATED,
      message: "Member account created and joined organization successfully",
      data: result
    });
  }
);
var login2 = catch_async_default(
  async (req, res, next) => {
    const { accessToken, refreshToken: refreshToken3, jwtPayload } = await authService.login(
      req.body
    );
    res.cookie("refreshToken", refreshToken3, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1e3
      // 7 days in milliseconds
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1e3
      // 1 day in milliseconds
    });
    sendSuccessResponse(res, {
      statusCode: StatusCodes2.OK,
      message: "User logged in successfully",
      data: {
        user: jwtPayload,
        accessToken,
        refreshToken: refreshToken3
      }
    });
  }
);
var getMe2 = catch_async_default(
  async (req, res, next) => {
    const userId = req.user?.id;
    console.log("user", req.user);
    if (!userId) {
      throw new Error("Cannot fetch user, please log in again");
    }
    const result = await authService.getMe(userId);
    sendSuccessResponse(res, {
      statusCode: StatusCodes2.OK,
      message: "User data retrieved successfully",
      data: result
    });
  }
);
var refreshToken2 = catch_async_default(
  async (req, res, next) => {
    const { refreshToken: token } = req.cookies;
    if (!token) {
      throw new Error("No refresh token provided. Please log in again.");
    }
    const { accessToken, jwtPayload } = await authService.refreshToken(token);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1e3
    });
    sendSuccessResponse(res, {
      statusCode: StatusCodes2.OK,
      message: "Access token generated successfully",
      data: {
        accessToken,
        user: jwtPayload
      }
    });
  }
);
var googleLogin2 = catch_async_default(
  async (req, res, next) => {
    const { accessToken, refreshToken: refreshToken3, jwtPayload } = await authService.googleLogin(req.body.idToken, req.body.organizationId);
    res.cookie("refreshToken", refreshToken3, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1e3
      // 7 days in milliseconds
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1e3
      // 1 day in milliseconds
    });
    sendSuccessResponse(res, {
      statusCode: StatusCodes2.OK,
      message: "User logged in successfully via Google",
      data: {
        user: jwtPayload,
        accessToken,
        refreshToken: refreshToken3
      }
    });
  }
);
var authController = {
  registerOrgOwner: registerOrgOwner2,
  registerMember: registerMember2,
  login: login2,
  getMe: getMe2,
  refreshToken: refreshToken2,
  googleLogin: googleLogin2
};

// src/app/middleware/validate.ts
var validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body
    });
    if (!result.success) {
      res.status(400).json({
        status: "error",
        errors: result.error.issues.map((err) => ({
          field: err.path.slice(1).join("."),
          message: err.message
        }))
      });
      return;
    }
    req.body = result.data.body;
    next();
  };
};

// src/app/module/auth/auth.schema.ts
import { z } from "zod";
var registerOrgOwnerSchema = z.object({
  body: z.object({
    fullName: z.string({ error: "Full name is required" }).trim().min(1, { error: "Full name cannot be empty" }),
    email: z.email({ error: "Invalid email format" }),
    password: z.string({ error: "Password is required" }).min(6, { error: "Password must be at least 6 characters" }),
    organizationName: z.string({ error: "Organization name is required" }).trim().min(1, { error: "Organization name cannot be empty" }),
    organizationSlug: z.string({ error: "Organization slug is required" }).trim().min(1, { error: "Organization slug cannot be empty" }).regex(/^[a-z0-9-]+$/, {
      error: "Slug can only contain lowercase letters, numbers, and hyphens"
    })
  })
});
var registerMemberSchema = z.object({
  body: z.object({
    fullName: z.string({ error: "Full name is required" }).trim().min(1, { error: "Full name cannot be empty" }),
    email: z.email({ error: "Invalid email format" }),
    password: z.string({ error: "Password is required" }).min(6, { error: "Password must be at least 6 characters" }),
    organizationId: z.string({ error: "Organization ID is required" }).trim().min(1, { error: "Organization ID cannot be empty" })
  })
});
var loginSchema = z.object({
  body: z.object({
    email: z.email({ error: "Invalid email format" }),
    password: z.string({ error: "Password is required" }).min(1, { error: "Password is required" })
  })
});
var googleLoginSchema = z.object({
  body: z.object({
    idToken: z.string({ error: "Google ID token is required" }).min(1, { error: "ID token cannot be empty" }),
    organizationId: z.uuid({ error: "Organization ID must be a valid UUID" }).optional()
  })
});
var authValidation = {
  registerOrgOwnerSchema,
  registerMemberSchema,
  loginSchema,
  googleLoginSchema
};

// src/app/middleware/auth.ts
var auth = (...requiredRoles) => {
  return catch_async_default(async (req, res, next) => {
    const accessToken = req.cookies.accessToken ? req.cookies.accessToken : req.headers.authorization?.startsWith("Bearer") ? req.headers.authorization.split(" ")[1] : req.headers.authorization;
    if (!accessToken) {
      throw new Error(
        "You are not logged in. Please log in to access this resource."
      );
    }
    const verifyAccessToken = jwtUtils.verifyToken(
      accessToken,
      config_default.jwt_access_secret
    );
    if (!verifyAccessToken.success) {
      throw new Error(verifyAccessToken.error);
    }
    const { id, email, name } = verifyAccessToken.data;
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        memberships: {
          include: {
            organization: true
          }
        }
      }
    });
    if (!user || user.deletedAt) {
      throw new Error("User not found. Please log in again.");
    }
    if (user.status !== "ACTIVE") {
      throw new Error(
        "Your account has been suspended or inactive. Please contact support."
      );
    }
    const membership = user.memberships[0];
    if (!membership) {
      throw new Error("User does not belong to any organization.");
    }
    const userRole = membership.role;
    const organizationId = membership.organizationId;
    if (requiredRoles.length && !requiredRoles.includes(userRole)) {
      throw new Error(
        "Forbidden. You don't have permission to access this resource."
      );
    }
    req.user = {
      id: user.id,
      name: user.fullName,
      email: user.email,
      role: userRole,
      organizationId
    };
    next();
  });
};
var authMiddleware = { auth };

// src/app/module/auth/auth.route.ts
var router = Router();
router.post(
  "/register-owner",
  validate(authValidation.registerOrgOwnerSchema),
  authController.registerOrgOwner
);
router.post(
  "/register-member",
  validate(authValidation.registerMemberSchema),
  authController.registerMember
);
router.post(
  "/login",
  validate(authValidation.loginSchema),
  authController.login
);
router.get(
  "/me",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  authController.getMe
);
router.post(
  "/refresh-token",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  authController.refreshToken
);
router.post(
  "/google-login",
  validate(authValidation.googleLoginSchema),
  authController.googleLogin
);
var authRoutes = router;

// src/app/module/team/team.route.ts
import { Router as Router2 } from "express";

// src/app/module/team/team.service.ts
var createTeam = async (organizationId, payload) => {
  const existingTeam = await prisma.team.findFirst({
    where: {
      organizationId,
      name: payload.name
    }
  });
  if (existingTeam && !existingTeam.deletedAt) {
    throw new Error(
      "A team with this name already exists in the organization."
    );
  }
  if (existingTeam && existingTeam.deletedAt) {
    const updatedTeam = await prisma.team.update({
      where: { id: existingTeam.id },
      data: {
        deletedAt: null,
        description: payload.description || existingTeam.description
      }
    });
    return updatedTeam;
  } else if (!existingTeam) {
    const team = await prisma.team.create({
      data: {
        name: payload.name,
        description: payload.description,
        organizationId
      }
    });
    return team;
  }
};
var getAllTeams = async (organizationId) => {
  const teams = await prisma.team.findMany({
    where: {
      organizationId,
      deletedAt: null
    },
    include: {
      teamMembers: true
    }
  });
  return teams;
};
var getTeamById = async (organizationId, teamId) => {
  const team = await prisma.team.findFirst({
    where: {
      id: teamId,
      organizationId,
      deletedAt: null
    },
    //complex include to fetch related projects and team members
    include: {
      projects: {
        include: {
          project: true
        }
      },
      teamMembers: true
    }
  });
  if (!team) {
    throw new Error("Team not found");
  }
  return team;
};
var updateTeam = async (organizationId, teamId, payload) => {
  const team = await prisma.team.findFirst({
    where: {
      id: teamId,
      organizationId,
      deletedAt: null
    }
  });
  if (!team) {
    throw new Error("Team not found");
  }
  const updatedTeam = await prisma.team.update({
    where: { id: teamId },
    data: payload
  });
  return updatedTeam;
};
var deleteTeam = async (organizationId, teamId) => {
  const team = await prisma.team.findFirst({
    where: {
      id: teamId,
      organizationId,
      deletedAt: null
    }
  });
  if (!team) {
    throw new Error("Team not found");
  }
  const updatedTeam = await prisma.team.update({
    where: { id: teamId },
    data: { deletedAt: /* @__PURE__ */ new Date() }
  });
  return updatedTeam;
};
var teamService = {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
  deleteTeam
};

// src/app/module/team/team.controller.ts
import { StatusCodes as StatusCodes3 } from "http-status-codes";
var createTeam2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    const result = await teamService.createTeam(organizationId, req.body);
    sendSuccessResponse(res, {
      statusCode: StatusCodes3.CREATED,
      message: "Team created successfully",
      data: result
    });
  }
);
var getAllTeams2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    const result = await teamService.getAllTeams(organizationId);
    sendSuccessResponse(res, {
      statusCode: StatusCodes3.OK,
      message: "Teams retrieved successfully",
      data: result
    });
  }
);
var getTeamById2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    const { teamId } = req.params;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    if (!teamId) {
      throw new Error("Team ID is required to retrieve a team.");
    }
    const result = await teamService.getTeamById(
      organizationId,
      teamId
    );
    sendSuccessResponse(res, {
      statusCode: StatusCodes3.OK,
      message: "Team retrieved successfully",
      data: result
    });
  }
);
var updateTeam2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    const { teamId } = req.params;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    if (!req.user?.id) {
      throw new Error("User ID is missing in the request context.");
    }
    const result = await teamService.updateTeam(
      organizationId,
      teamId,
      req.body
    );
    sendSuccessResponse(res, {
      statusCode: StatusCodes3.OK,
      message: "Team updated successfully",
      data: result
    });
  }
);
var deleteTeam2 = catch_async_default(
  async (req, res, next) => {
    if (!req.user?.id) {
      throw new Error("User ID is missing in the request context.");
    }
    const organizationId = req.user?.organizationId;
    const { teamId } = req.params;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    if (!teamId) {
      throw new Error("Team ID is required to delete a team.");
    }
    const result = await teamService.deleteTeam(
      organizationId,
      teamId
    );
    sendSuccessResponse(res, {
      statusCode: StatusCodes3.OK,
      message: "Team deleted successfully",
      data: result
    });
  }
);
var teamController = {
  createTeam: createTeam2,
  getAllTeams: getAllTeams2,
  getTeamById: getTeamById2,
  updateTeam: updateTeam2,
  deleteTeam: deleteTeam2
};

// src/app/module/team/team.schema.ts
import { z as z2 } from "zod";
var createTeamSchema = z2.object({
  body: z2.object({
    name: z2.string({ error: "Team name is required" }).trim().min(1, { error: "Team name cannot be empty" }),
    description: z2.string().optional()
  })
});
var updateTeamSchema = z2.object({
  body: z2.object({
    name: z2.string().trim().min(1, { error: "Team name cannot be empty" }).optional(),
    description: z2.string().optional()
  }).refine((body) => Object.keys(body).length > 0, {
    error: "At least one team field is required to update"
  })
});
var teamValidation = {
  createTeamSchema,
  updateTeamSchema
};

// src/app/module/team/team.route.ts
var router2 = Router2();
router2.post(
  "/",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  validate(teamValidation.createTeamSchema),
  teamController.createTeam
);
router2.get(
  "/",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  teamController.getAllTeams
);
router2.get(
  "/:teamId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  teamController.getTeamById
);
router2.patch(
  "/:teamId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  validate(teamValidation.updateTeamSchema),
  teamController.updateTeam
);
router2.delete(
  "/:teamId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  teamController.deleteTeam
);
var teamRoutes = router2;

// src/app/module/project/project.route.ts
import { Router as Router3 } from "express";

// src/app/module/project/project.service.ts
var createProject = async (organizationId, payload) => {
  const project = await prisma.project.create({
    data: {
      name: payload.name,
      description: payload.description,
      organizationId
    }
  });
  return project;
};
var getAllProjects = async (organizationId) => {
  const projects = await prisma.project.findMany({
    where: {
      organizationId,
      deletedAt: null
    },
    include: {
      teams: true,
      tasks: true
    }
  });
  return projects;
};
var getProjectById = async (organizationId, projectId) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organizationId,
      deletedAt: null
    },
    include: {
      teams: true,
      tasks: true
    }
  });
  if (!project) {
    throw new Error("Project not found");
  }
  return project;
};
var updateProject = async (organizationId, projectId, payload) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organizationId,
      deletedAt: null
    }
  });
  if (!project) {
    throw new Error("Project not found");
  }
  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data: payload
  });
  return updatedProject;
};
var deleteProject = async (organizationId, projectId) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organizationId,
      deletedAt: null
    }
  });
  if (!project) {
    throw new Error("Project not found");
  }
  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data: { deletedAt: /* @__PURE__ */ new Date() }
  });
  return updatedProject;
};
var assignTeamToProject = async (organizationId, projectId, teamId) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, organizationId, deletedAt: null }
  });
  if (!project) throw new Error("Project not found");
  const team = await prisma.team.findFirst({
    where: { id: teamId, organizationId, deletedAt: null }
  });
  if (!team) throw new Error("Team not found");
  const existingAssignment = await prisma.projectTeam.findFirst({
    where: { projectId, teamId }
  });
  if (existingAssignment) {
    throw new Error("Team is already assigned to this project");
  }
  const assignment = await prisma.projectTeam.create({
    data: {
      projectId,
      teamId
    }
  });
  return assignment;
};
var removeTeamFromProject = async (organizationId, projectId, teamId) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, organizationId, deletedAt: null }
  });
  if (!project) throw new Error("Project not found");
  const deletedAssignment = await prisma.projectTeam.delete({
    where: {
      projectId_teamId: {
        projectId,
        teamId
      }
    }
  });
  return deletedAssignment;
};
var projectService = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  assignTeamToProject,
  removeTeamFromProject
};

// src/app/module/project/project.controller.ts
import { StatusCodes as StatusCodes4 } from "http-status-codes";
var createProject2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    const result = await projectService.createProject(organizationId, req.body);
    sendSuccessResponse(res, {
      statusCode: StatusCodes4.CREATED,
      message: "Project created successfully",
      data: result
    });
  }
);
var getAllProjects2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    const result = await projectService.getAllProjects(organizationId);
    sendSuccessResponse(res, {
      statusCode: StatusCodes4.OK,
      message: "Projects retrieved successfully",
      data: result
    });
  }
);
var getProjectById2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    const { projectId } = req.params;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    const result = await projectService.getProjectById(
      organizationId,
      projectId
    );
    sendSuccessResponse(res, {
      statusCode: StatusCodes4.OK,
      message: "Project retrieved successfully",
      data: result
    });
  }
);
var updateProject2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    const { projectId } = req.params;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    const result = await projectService.updateProject(
      organizationId,
      projectId,
      req.body
    );
    sendSuccessResponse(res, {
      statusCode: StatusCodes4.OK,
      message: "Project updated successfully",
      data: result
    });
  }
);
var deleteProject2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    const { projectId } = req.params;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    const result = await projectService.deleteProject(
      organizationId,
      projectId
    );
    sendSuccessResponse(res, {
      statusCode: StatusCodes4.OK,
      message: "Project deleted successfully",
      data: result
    });
  }
);
var assignTeamToProject2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    const { projectId } = req.params;
    const { teamId } = req.body;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    const result = await projectService.assignTeamToProject(
      organizationId,
      projectId,
      teamId
    );
    sendSuccessResponse(res, {
      statusCode: StatusCodes4.CREATED,
      message: "Team assigned to project successfully",
      data: result
    });
  }
);
var removeTeamFromProject2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    const { projectId, teamId } = req.params;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    const result = await projectService.removeTeamFromProject(
      organizationId,
      projectId,
      teamId
    );
    sendSuccessResponse(res, {
      statusCode: StatusCodes4.OK,
      message: "Team removed from project successfully",
      data: result
    });
  }
);
var projectController = {
  createProject: createProject2,
  getAllProjects: getAllProjects2,
  getProjectById: getProjectById2,
  updateProject: updateProject2,
  deleteProject: deleteProject2,
  assignTeamToProject: assignTeamToProject2,
  removeTeamFromProject: removeTeamFromProject2
};

// src/app/module/project/project.schema.ts
import { z as z3 } from "zod";
var createProjectSchema = z3.object({
  body: z3.object({
    name: z3.string({ error: "Project name is required" }).trim().min(1, { error: "Project name cannot be empty" }),
    description: z3.string().optional()
  })
});
var updateProjectSchema = z3.object({
  body: z3.object({
    name: z3.string().trim().min(1, { error: "Project name cannot be empty" }).optional(),
    description: z3.string().optional(),
    status: z3.string().optional()
  })
});
var assignTeamSchema = z3.object({
  body: z3.object({
    teamId: z3.string({ error: "Team ID is required" }).trim().min(1, { error: "Team ID cannot be empty" })
  })
});
var projectValidation = {
  createProjectSchema,
  updateProjectSchema,
  assignTeamSchema
};

// src/app/module/project/project.route.ts
var router3 = Router3();
router3.post(
  "/",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  validate(projectValidation.createProjectSchema),
  projectController.createProject
);
router3.get(
  "/",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  projectController.getAllProjects
);
router3.get(
  "/:projectId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  projectController.getProjectById
);
router3.patch(
  "/:projectId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  validate(projectValidation.updateProjectSchema),
  projectController.updateProject
);
router3.delete(
  "/:projectId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  projectController.deleteProject
);
router3.post(
  "/:projectId/teams",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  validate(projectValidation.assignTeamSchema),
  projectController.assignTeamToProject
);
router3.delete(
  "/:projectId/teams/:teamId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  projectController.removeTeamFromProject
);
var projectRoutes = router3;

// src/app/module/task/task.route.ts
import { Router as Router4 } from "express";

// src/app/module/task/task.service.ts
var createTask = async (organizationId, userId, projectId, payload) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, organizationId, deletedAt: null }
  });
  if (!project) {
    throw new Error("Project not found");
  }
  if (payload.status && !["TODO", "IN_PROGRESS", "DONE"].includes(payload.status)) {
    throw new Error("Invalid status value");
  }
  if (payload.priority && !["LOW", "MEDIUM", "HIGH"].includes(payload.priority)) {
    throw new Error("Invalid priority value");
  }
  const task = await prisma.task.create({
    data: {
      title: payload.title,
      description: payload.description,
      status: payload.status || "TODO",
      priority: payload.priority || "MEDIUM",
      assigneeId: payload.assigneeId,
      creatorId: userId,
      projectId
    }
  });
  return task;
};
var getTasksByProject = async (organizationId, projectId) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, organizationId, deletedAt: null }
  });
  if (!project) {
    throw new Error("Project not found");
  }
  const tasks = await prisma.task.findMany({
    where: {
      projectId,
      deletedAt: null
    }
  });
  return tasks;
};
var getTaskById = async (organizationId, taskId) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      project: {
        organizationId,
        deletedAt: null
      },
      deletedAt: null
    },
    include: {
      project: true
    }
  });
  if (!task) {
    throw new Error("Task not found");
  }
  return task;
};
var updateTask = async (organizationId, taskId, payload, userId, role) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      deletedAt: null,
      project: {
        organizationId,
        deletedAt: null
      }
    }
  });
  if (!task) {
    throw new Error("Task not found");
  }
  if (task.assigneeId && role !== Role.MANAGER && role !== Role.ADMIN && task.assigneeId !== userId) {
    throw new Error("You are not authorized to update this task");
  }
  console.log("role", role);
  if (payload.assigneeId && role !== Role.MANAGER && role !== Role.ADMIN) {
    throw new Error("You are not authorized to assign this task");
  }
  const updateData = { ...payload };
  if (payload.dueDate) {
    updateData.dueDate = new Date(payload.dueDate);
  }
  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: updateData
  });
  return updatedTask;
};
var deleteTask = async (organizationId, taskId) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      project: {
        organizationId,
        deletedAt: null
      },
      deletedAt: null
    }
  });
  if (!task) {
    throw new Error("Task not found");
  }
  const deletedTask = await prisma.task.update({
    where: { id: taskId },
    data: { deletedAt: /* @__PURE__ */ new Date() }
  });
  return deletedTask;
};
var taskService = {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask
};

// src/app/module/task/task.controller.ts
import { StatusCodes as StatusCodes5 } from "http-status-codes";
var createTask2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    const userId = req.user?.id;
    const { projectId } = req.params;
    if (!projectId) {
      throw new Error("Project ID is missing in the request parameters.");
    }
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    if (!userId) {
      throw new Error("User ID is missing in the request context.");
    }
    const result = await taskService.createTask(
      organizationId,
      userId,
      projectId,
      req.body
    );
    sendSuccessResponse(res, {
      statusCode: StatusCodes5.CREATED,
      message: "Task created successfully",
      data: result
    });
  }
);
var getTasksByProject2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    const { projectId } = req.params;
    if (!projectId) {
      throw new Error("Project ID is missing in the request parameters.");
    }
    const result = await taskService.getTasksByProject(organizationId, projectId);
    sendSuccessResponse(res, {
      statusCode: StatusCodes5.OK,
      message: "Tasks retrieved successfully",
      data: result
    });
  }
);
var getTaskById2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    const { taskId } = req.params;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    if (!taskId) {
      throw new Error("Task ID is missing in the request parameters.");
    }
    const result = await taskService.getTaskById(organizationId, taskId);
    sendSuccessResponse(res, {
      statusCode: StatusCodes5.OK,
      message: "Task retrieved successfully",
      data: result
    });
  }
);
var updateTask2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    const { taskId } = req.params;
    const user = req.user;
    const userId = user?.id;
    const role = user?.role;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    if (!taskId) {
      throw new Error("Task ID is missing in the request parameters.");
    }
    const result = await taskService.updateTask(organizationId, taskId, req.body, userId, role);
    sendSuccessResponse(res, {
      statusCode: StatusCodes5.OK,
      message: "Task updated successfully",
      data: result
    });
  }
);
var deleteTask2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    const { taskId } = req.params;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    if (!taskId) {
      throw new Error("Task ID is missing in the request parameters.");
    }
    const result = await taskService.deleteTask(organizationId, taskId);
    sendSuccessResponse(res, {
      statusCode: StatusCodes5.OK,
      message: "Task deleted successfully",
      data: result
    });
  }
);
var taskController = {
  createTask: createTask2,
  getTasksByProject: getTasksByProject2,
  getTaskById: getTaskById2,
  updateTask: updateTask2,
  deleteTask: deleteTask2
};

// src/app/module/task/task.schema.ts
import { z as z4 } from "zod";
var createTaskSchema = z4.object({
  body: z4.object({
    title: z4.string({ error: "Task title is required" }).trim().min(1, { error: "Task title cannot be empty" }),
    description: z4.string().optional(),
    status: z4.enum([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE]).optional(),
    priority: z4.enum([TaskPriority.HIGH, TaskPriority.MEDIUM, TaskPriority.LOW, TaskPriority.URGENT]).optional(),
    dueDate: z4.coerce.date({ message: "Due date must be a valid date" }).optional(),
    assigneeId: z4.uuid({ error: "Assignee ID must be a valid UUID" }).optional(),
    sprintId: z4.uuid({ error: "Sprint ID must be a valid UUID" }).optional(),
    parentTaskId: z4.uuid({ error: "Parent task ID must be a valid UUID" }).optional()
  })
});
var updateTaskSchema = z4.object({
  body: z4.object({
    title: z4.string().trim().min(1, { error: "Task title cannot be empty" }).optional(),
    description: z4.string().optional(),
    status: z4.enum([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE]).optional(),
    priority: z4.enum([TaskPriority.HIGH, TaskPriority.MEDIUM, TaskPriority.LOW, TaskPriority.URGENT]).optional(),
    dueDate: z4.coerce.date({ message: "Due date must be a valid date" }).optional(),
    assigneeId: z4.uuid({ error: "Assignee ID must be a valid UUID" }).optional(),
    sprintId: z4.uuid({ error: "Sprint ID must be a valid UUID" }).optional(),
    parentTaskId: z4.uuid({ error: "Parent task ID must be a valid UUID" }).optional()
  })
});
var taskValidation = {
  createTaskSchema,
  updateTaskSchema
};

// src/app/module/task/task.route.ts
var router4 = Router4();
router4.post(
  "/projects/:projectId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  validate(taskValidation.createTaskSchema),
  taskController.createTask
);
router4.get(
  "/projects/:projectId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  taskController.getTasksByProject
);
router4.get(
  "/:taskId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  taskController.getTaskById
);
router4.patch(
  "/:taskId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  validate(taskValidation.updateTaskSchema),
  taskController.updateTask
);
router4.delete(
  "/:taskId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  taskController.deleteTask
);
var taskRoutes = router4;

// src/app/module/sprint/spring.route.ts
import { Router as Router5 } from "express";

// src/app/module/sprint/sprint.service.ts
var createSprint = async (organizationId, projectId, payload) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, organizationId, deletedAt: null }
  });
  if (!project) {
    throw new Error("Project not found");
  }
  const sprint = await prisma.sprint.create({
    data: {
      name: payload.name,
      goal: payload.goal,
      status: payload.status || "PLANNING",
      startDate: payload.startDate ? new Date(payload.startDate) : void 0,
      endDate: payload.endDate ? new Date(payload.endDate) : void 0,
      projectId
    }
  });
  return sprint;
};
var getSprintsByProject = async (organizationId, projectId) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, organizationId, deletedAt: null }
  });
  if (!project) {
    throw new Error("Project not found");
  }
  const sprints = await prisma.sprint.findMany({
    where: {
      projectId,
      deletedAt: null
    },
    include: {
      tasks: true
    }
  });
  return sprints;
};
var getSprintById = async (organizationId, sprintId) => {
  const sprint = await prisma.sprint.findFirst({
    where: {
      id: sprintId,
      project: {
        organizationId,
        deletedAt: null
      },
      deletedAt: null
    },
    include: {
      project: true,
      tasks: true
    }
  });
  if (!sprint) {
    throw new Error("Sprint not found");
  }
  return sprint;
};
var updateSprint = async (organizationId, sprintId, payload) => {
  const sprint = await prisma.sprint.findFirst({
    where: {
      id: sprintId,
      project: {
        organizationId,
        deletedAt: null
      },
      deletedAt: null
    }
  });
  if (!sprint) {
    throw new Error("Sprint not found");
  }
  const updateData = { ...payload };
  if (payload.startDate) {
    updateData.startDate = new Date(payload.startDate);
  }
  if (payload.endDate) {
    updateData.endDate = new Date(payload.endDate);
  }
  const updatedSprint = await prisma.sprint.update({
    where: { id: sprintId },
    data: updateData
  });
  return updatedSprint;
};
var deleteSprint = async (organizationId, sprintId) => {
  const sprint = await prisma.sprint.findFirst({
    where: {
      id: sprintId,
      project: {
        organizationId,
        deletedAt: null
      },
      deletedAt: null
    }
  });
  if (!sprint) {
    throw new Error("Sprint not found");
  }
  const deletedSprint = await prisma.sprint.update({
    where: { id: sprintId },
    data: { deletedAt: /* @__PURE__ */ new Date() }
  });
  return deletedSprint;
};
var sprintService = {
  createSprint,
  getSprintsByProject,
  getSprintById,
  updateSprint,
  deleteSprint
};

// src/app/module/sprint/sprint.controller.ts
import { StatusCodes as StatusCodes6 } from "http-status-codes";
var createSprint2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    const { projectId } = req.params;
    if (!projectId) {
      throw new Error("Project ID is missing in the request parameters.");
    }
    const result = await sprintService.createSprint(
      organizationId,
      projectId,
      req.body
    );
    sendSuccessResponse(res, {
      statusCode: StatusCodes6.CREATED,
      message: "Sprint created successfully",
      data: result
    });
  }
);
var getSprintsByProject2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    const { projectId } = req.params;
    if (!projectId) {
      throw new Error("Project ID is missing in the request parameters.");
    }
    const result = await sprintService.getSprintsByProject(organizationId, projectId);
    sendSuccessResponse(res, {
      statusCode: StatusCodes6.OK,
      message: "Sprints retrieved successfully",
      data: result
    });
  }
);
var getSprintById2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    const { sprintId } = req.params;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    if (!sprintId) {
      throw new Error("Sprint ID is missing in the request parameters.");
    }
    const result = await sprintService.getSprintById(organizationId, sprintId);
    sendSuccessResponse(res, {
      statusCode: StatusCodes6.OK,
      message: "Sprint retrieved successfully",
      data: result
    });
  }
);
var updateSprint2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    const { sprintId } = req.params;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    if (!sprintId) {
      throw new Error("Sprint ID is missing in the request parameters.");
    }
    const result = await sprintService.updateSprint(organizationId, sprintId, req.body);
    sendSuccessResponse(res, {
      statusCode: StatusCodes6.OK,
      message: "Sprint updated successfully",
      data: result
    });
  }
);
var deleteSprint2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    const { sprintId } = req.params;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    if (!sprintId) {
      throw new Error("Sprint ID is missing in the request parameters.");
    }
    const result = await sprintService.deleteSprint(organizationId, sprintId);
    sendSuccessResponse(res, {
      statusCode: StatusCodes6.OK,
      message: "Sprint deleted successfully",
      data: result
    });
  }
);
var sprintController = {
  createSprint: createSprint2,
  getSprintsByProject: getSprintsByProject2,
  getSprintById: getSprintById2,
  updateSprint: updateSprint2,
  deleteSprint: deleteSprint2
};

// src/app/module/sprint/sprint.schema.ts
import { z as z5 } from "zod";
var createSprintSchema = z5.object({
  body: z5.object({
    name: z5.string({ error: "Sprint name is required" }).trim().min(1, { error: "Sprint name cannot be empty" }),
    goal: z5.string().optional(),
    status: z5.enum([SprintStatus.ACTIVE, SprintStatus.COMPLETED, SprintStatus.PLANNING]).optional(),
    startDate: z5.coerce.date({ message: "Start date must be a valid date" }).optional(),
    endDate: z5.coerce.date({ message: "End date must be a valid date" }).optional()
  })
});
var updateSprintSchema = z5.object({
  body: z5.object({
    name: z5.string().trim().min(1, { error: "Sprint name cannot be empty" }).optional(),
    goal: z5.string().optional(),
    status: z5.enum([SprintStatus.ACTIVE, SprintStatus.COMPLETED, SprintStatus.PLANNING]).optional(),
    startDate: z5.coerce.date({ message: "Start date must be a valid date" }).optional(),
    endDate: z5.coerce.date({ message: "End date must be a valid date" }).optional()
  })
});
var sprintValidation = {
  createSprintSchema,
  updateSprintSchema
};

// src/app/module/sprint/spring.route.ts
var router5 = Router5();
router5.post(
  "/projects/:projectId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  validate(sprintValidation.createSprintSchema),
  sprintController.createSprint
);
router5.get(
  "/projects/:projectId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  sprintController.getSprintsByProject
);
router5.get(
  "/:sprintId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  sprintController.getSprintById
);
router5.patch(
  "/:sprintId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  validate(sprintValidation.updateSprintSchema),
  sprintController.updateSprint
);
router5.delete(
  "/:sprintId",
  authMiddleware.auth(Role.ADMIN),
  sprintController.deleteSprint
);
var sprintRoutes = router5;

// src/app/module/comment/comment.route.ts
import { Router as Router6 } from "express";

// src/app/module/comment/comment.service.ts
var createComment = async (organizationId, userId, taskId, payload) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      project: {
        organizationId,
        deletedAt: null
      },
      deletedAt: null
    }
  });
  if (!task) {
    throw new Error("Task not found");
  }
  const comment = await prisma.comment.create({
    data: {
      content: payload.content,
      taskId,
      authorId: userId
    },
    include: {
      author: {
        select: {
          id: true,
          fullName: true,
          email: true
        }
      }
    }
  });
  return comment;
};
var getCommentsByTask = async (organizationId, taskId) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      project: {
        organizationId,
        deletedAt: null
      },
      deletedAt: null
    }
  });
  if (!task) {
    throw new Error("Task not found");
  }
  const comments = await prisma.comment.findMany({
    where: {
      taskId,
      deletedAt: null
    },
    include: {
      author: {
        select: {
          id: true,
          fullName: true,
          email: true
        }
      }
    },
    orderBy: {
      createdAt: "asc"
    }
  });
  return comments;
};
var updateComment = async (organizationId, userId, commentId, payload) => {
  const comment = await prisma.comment.findFirst({
    where: {
      id: commentId,
      task: {
        project: {
          organizationId,
          deletedAt: null
        },
        deletedAt: null
      },
      deletedAt: null
    }
  });
  if (!comment) {
    throw new Error("Comment not found");
  }
  if (comment.authorId !== userId) {
    throw new Error("Unauthorized to update this comment");
  }
  const updatedComment = await prisma.comment.update({
    where: { id: commentId },
    data: { content: payload.content },
    include: {
      author: {
        select: {
          id: true,
          fullName: true,
          email: true
        }
      }
    }
  });
  return updatedComment;
};
var deleteComment = async (organizationId, userId, userRole, commentId) => {
  const comment = await prisma.comment.findFirst({
    where: {
      id: commentId,
      task: {
        project: {
          organizationId,
          deletedAt: null
        },
        deletedAt: null
      },
      deletedAt: null
    }
  });
  if (!comment) {
    throw new Error("Comment not found");
  }
  if (comment.authorId !== userId && userRole !== "ADMIN" && userRole !== "MANAGER") {
    throw new Error("Unauthorized to delete this comment");
  }
  const deletedComment = await prisma.comment.update({
    where: { id: commentId },
    data: { deletedAt: /* @__PURE__ */ new Date() }
  });
  return deletedComment;
};
var commentService = {
  createComment,
  getCommentsByTask,
  updateComment,
  deleteComment
};

// src/app/module/comment/comment.controller.ts
import { StatusCodes as StatusCodes7 } from "http-status-codes";
var createComment2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    const userId = req.user?.id;
    const { taskId } = req.params;
    if (!taskId) {
      throw new Error("Task ID is missing in the request parameters.");
    }
    const result = await commentService.createComment(
      organizationId,
      userId,
      taskId,
      req.body
    );
    sendSuccessResponse(res, {
      statusCode: StatusCodes7.CREATED,
      message: "Comment added successfully",
      data: result
    });
  }
);
var getCommentsByTask2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    const { taskId } = req.params;
    if (!taskId) {
      throw new Error("Task ID is missing in the request parameters.");
    }
    const result = await commentService.getCommentsByTask(organizationId, taskId);
    sendSuccessResponse(res, {
      statusCode: StatusCodes7.OK,
      message: "Comments retrieved successfully",
      data: result
    });
  }
);
var updateComment2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    const userId = req.user?.id;
    const { commentId } = req.params;
    if (!commentId) {
      throw new Error("Comment ID is missing in the request parameters.");
    }
    const result = await commentService.updateComment(
      organizationId,
      userId,
      commentId,
      req.body
    );
    sendSuccessResponse(res, {
      statusCode: StatusCodes7.OK,
      message: "Comment updated successfully",
      data: result
    });
  }
);
var deleteComment2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const { commentId } = req.params;
    if (!commentId) {
      throw new Error("Comment ID is missing in the request parameters.");
    }
    const result = await commentService.deleteComment(
      organizationId,
      userId,
      userRole,
      commentId
    );
    sendSuccessResponse(res, {
      statusCode: StatusCodes7.OK,
      message: "Comment deleted successfully",
      data: result
    });
  }
);
var commentController = {
  createComment: createComment2,
  getCommentsByTask: getCommentsByTask2,
  updateComment: updateComment2,
  deleteComment: deleteComment2
};

// src/app/module/comment/comment.schema.ts
import { z as z6 } from "zod";
var createCommentSchema = z6.object({
  body: z6.object({
    content: z6.string({ error: "Comment content is required" }).trim().min(1, { error: "Comment content cannot be empty" })
  })
});
var updateCommentSchema = z6.object({
  body: z6.object({
    content: z6.string({ error: "Comment content is required" }).trim().min(1, { error: "Comment content cannot be empty" })
  })
});
var commentValidation = {
  createCommentSchema,
  updateCommentSchema
};

// src/app/module/comment/comment.route.ts
var router6 = Router6();
router6.post(
  "/tasks/:taskId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  validate(commentValidation.createCommentSchema),
  commentController.createComment
);
router6.get(
  "/tasks/:taskId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  commentController.getCommentsByTask
);
router6.patch(
  "/:commentId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  validate(commentValidation.updateCommentSchema),
  commentController.updateComment
);
router6.delete(
  "/:commentId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  commentController.deleteComment
);
var commentRoutes = router6;

// src/app.ts
var app = express();
var corsOptions = {
  origin: config_default.frontend_url,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/v1", rate_limiter_default);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/teams", teamRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/sprints", sprintRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use(not_found_default);
app.use(global_error_default);
var app_default = app;

// src/server.ts
var port = config_default.port;
async function main() {
  try {
    await prisma.$connect();
    app_default.listen(port, () => {
      if (config_default.node_env !== "development") {
        console.log("Server is running on port " + port);
      }
    });
  } catch (error) {
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();
//# sourceMappingURL=server.js.map