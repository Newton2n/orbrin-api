
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

enum SubscriptionStatus {
  PENDING
  ACTIVE
  CANCELED
  PAST_DUE
  TRIALING
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}

enum PaymentGateway {
  STRIPE
  SSLCOMMERZ
  BKASH
}

model Organization {
  id        String    @id @default(uuid())
  name      String
  slug      String    @unique
  deletedAt DateTime? @map("deleted_at")
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")

  stripeCustomerId String? @unique @map("stripe_customer_id")

  memberships   OrganizationMembership[]
  teams         Team[]
  projects      Project[]
  subscriptions Subscription?
  payments      Payment[]

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
  id                 String             @id @default(uuid())
  organizationId     String             @unique @map("organization_id")
  planName           String             @map("plan_name")
  status             SubscriptionStatus @default(PENDING)
  gateway            PaymentGateway     @default(STRIPE)
  subscriptionId     String?            @unique @map("subscription_id")
  currentPeriodStart DateTime?          @map("current_period_start")
  currentPeriodEnd   DateTime?          @map("current_period_end")
  createdAt          DateTime           @default(now()) @map("created_at")
  updatedAt          DateTime           @updatedAt @map("updated_at")

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  payments     Payment[]

  @@map("subscriptions")
}

model Payment {
  id             String         @id @default(uuid())
  organizationId String         @map("organization_id")
  subscriptionId String?        @map("subscription_id")
  gateway        PaymentGateway @default(STRIPE)
  transactionId  String         @unique @map("transaction_id")
  amount         Decimal        @db.Decimal(10, 2)
  currency       String         @default("USD")
  status         PaymentStatus  @default(PENDING)
  invoiceUrl     String?        @map("invoice_url")
  createdAt      DateTime       @default(now()) @map("created_at")
  updatedAt      DateTime       @updatedAt @map("updated_at")

  organization Organization  @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  subscription Subscription? @relation(fields: [subscriptionId], references: [id], onDelete: SetNull)

  @@map("payments")
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
config.runtimeDataModel = JSON.parse('{"models":{"Comment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"taskId","kind":"scalar","type":"String","dbName":"task_id"},{"name":"authorId","kind":"scalar","type":"String","dbName":"author_id"},{"name":"content","kind":"scalar","type":"String"},{"name":"deletedAt","kind":"scalar","type":"DateTime","dbName":"deleted_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"task","kind":"object","type":"Task","relationName":"CommentToTask"},{"name":"author","kind":"object","type":"User","relationName":"CommentToUser"}],"dbName":"comments","schema":null},"Organization":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"deletedAt","kind":"scalar","type":"DateTime","dbName":"deleted_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"stripeCustomerId","kind":"scalar","type":"String","dbName":"stripe_customer_id"},{"name":"memberships","kind":"object","type":"OrganizationMembership","relationName":"OrganizationToOrganizationMembership"},{"name":"teams","kind":"object","type":"Team","relationName":"OrganizationToTeam"},{"name":"projects","kind":"object","type":"Project","relationName":"OrganizationToProject"},{"name":"subscriptions","kind":"object","type":"Subscription","relationName":"OrganizationToSubscription"},{"name":"payments","kind":"object","type":"Payment","relationName":"OrganizationToPayment"}],"dbName":"organizations","schema":null},"OrganizationMembership":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String","dbName":"organization_id"},{"name":"userId","kind":"scalar","type":"String","dbName":"user_id"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"OrganizationMembershipStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"organization","kind":"object","type":"Organization","relationName":"OrganizationToOrganizationMembership"},{"name":"user","kind":"object","type":"User","relationName":"OrganizationMembershipToUser"}],"dbName":"organization_memberships","schema":null},"Project":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String","dbName":"organization_id"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"deletedAt","kind":"scalar","type":"DateTime","dbName":"deleted_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"organization","kind":"object","type":"Organization","relationName":"OrganizationToProject"},{"name":"sprints","kind":"object","type":"Sprint","relationName":"ProjectToSprint"},{"name":"teams","kind":"object","type":"ProjectTeam","relationName":"ProjectToProjectTeam"},{"name":"tasks","kind":"object","type":"Task","relationName":"ProjectToTask"}],"dbName":"projects","schema":null},"ProjectTeam":{"fields":[{"name":"projectId","kind":"scalar","type":"String","dbName":"project_id"},{"name":"teamId","kind":"scalar","type":"String","dbName":"team_id"},{"name":"assignedAt","kind":"scalar","type":"DateTime","dbName":"assigned_at"},{"name":"project","kind":"object","type":"Project","relationName":"ProjectToProjectTeam"},{"name":"team","kind":"object","type":"Team","relationName":"ProjectTeamToTeam"}],"dbName":"project_teams","schema":null},"Sprint":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"projectId","kind":"scalar","type":"String","dbName":"project_id"},{"name":"name","kind":"scalar","type":"String"},{"name":"goal","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"SprintStatus"},{"name":"startDate","kind":"scalar","type":"DateTime","dbName":"start_date"},{"name":"endDate","kind":"scalar","type":"DateTime","dbName":"end_date"},{"name":"deletedAt","kind":"scalar","type":"DateTime","dbName":"deleted_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"project","kind":"object","type":"Project","relationName":"ProjectToSprint"},{"name":"tasks","kind":"object","type":"Task","relationName":"SprintToTask"}],"dbName":"sprints","schema":null},"Subscription":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String","dbName":"organization_id"},{"name":"planName","kind":"scalar","type":"String","dbName":"plan_name"},{"name":"status","kind":"enum","type":"SubscriptionStatus"},{"name":"gateway","kind":"enum","type":"PaymentGateway"},{"name":"subscriptionId","kind":"scalar","type":"String","dbName":"subscription_id"},{"name":"currentPeriodStart","kind":"scalar","type":"DateTime","dbName":"current_period_start"},{"name":"currentPeriodEnd","kind":"scalar","type":"DateTime","dbName":"current_period_end"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"organization","kind":"object","type":"Organization","relationName":"OrganizationToSubscription"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToSubscription"}],"dbName":"subscriptions","schema":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String","dbName":"organization_id"},{"name":"subscriptionId","kind":"scalar","type":"String","dbName":"subscription_id"},{"name":"gateway","kind":"enum","type":"PaymentGateway"},{"name":"transactionId","kind":"scalar","type":"String","dbName":"transaction_id"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"invoiceUrl","kind":"scalar","type":"String","dbName":"invoice_url"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"organization","kind":"object","type":"Organization","relationName":"OrganizationToPayment"},{"name":"subscription","kind":"object","type":"Subscription","relationName":"PaymentToSubscription"}],"dbName":"payments","schema":null},"Task":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"projectId","kind":"scalar","type":"String","dbName":"project_id"},{"name":"sprintId","kind":"scalar","type":"String","dbName":"sprint_id"},{"name":"parentTaskId","kind":"scalar","type":"String","dbName":"parent_task_id"},{"name":"creatorId","kind":"scalar","type":"String","dbName":"creator_id"},{"name":"assigneeId","kind":"scalar","type":"String","dbName":"assignee_id"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TaskStatus"},{"name":"priority","kind":"enum","type":"TaskPriority"},{"name":"deletedAt","kind":"scalar","type":"DateTime","dbName":"deleted_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"project","kind":"object","type":"Project","relationName":"ProjectToTask"},{"name":"parentTask","kind":"object","type":"Task","relationName":"SubTasks"},{"name":"subTasks","kind":"object","type":"Task","relationName":"SubTasks"},{"name":"creator","kind":"object","type":"User","relationName":"TaskCreator"},{"name":"assignee","kind":"object","type":"User","relationName":"TaskAssignee"},{"name":"sprint","kind":"object","type":"Sprint","relationName":"SprintToTask"},{"name":"comments","kind":"object","type":"Comment","relationName":"CommentToTask"}],"dbName":"tasks","schema":null},"Team":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String","dbName":"organization_id"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"deletedAt","kind":"scalar","type":"DateTime","dbName":"deleted_at"},{"name":"organization","kind":"object","type":"Organization","relationName":"OrganizationToTeam"},{"name":"teamMembers","kind":"object","type":"TeamMembership","relationName":"TeamToTeamMembership"},{"name":"projects","kind":"object","type":"ProjectTeam","relationName":"ProjectTeamToTeam"}],"dbName":"teams","schema":null},"TeamMembership":{"fields":[{"name":"teamId","kind":"scalar","type":"String","dbName":"team_id"},{"name":"userId","kind":"scalar","type":"String","dbName":"user_id"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"team","kind":"object","type":"Team","relationName":"TeamToTeamMembership"},{"name":"user","kind":"object","type":"User","relationName":"TeamMembershipToUser"}],"dbName":"team_memberships","schema":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean","dbName":"email_verified"},{"name":"passwordHash","kind":"scalar","type":"String","dbName":"password_hash"},{"name":"fullName","kind":"scalar","type":"String","dbName":"full_name"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"authProvider","kind":"enum","type":"AuthProvider","dbName":"auth_provider"},{"name":"authProviderId","kind":"scalar","type":"String","dbName":"auth_provider_id"},{"name":"deletedAt","kind":"scalar","type":"DateTime","dbName":"deleted_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"memberships","kind":"object","type":"OrganizationMembership","relationName":"OrganizationMembershipToUser"},{"name":"teamMemberships","kind":"object","type":"TeamMembership","relationName":"TeamMembershipToUser"},{"name":"createdTasks","kind":"object","type":"Task","relationName":"TaskCreator"},{"name":"assignedTasks","kind":"object","type":"Task","relationName":"TaskAssignee"},{"name":"comments","kind":"object","type":"Comment","relationName":"CommentToUser"}],"dbName":"users","schema":null}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","organization","memberships","teamMembers","project","team","projects","_count","user","teamMemberships","createdTasks","assignedTasks","comments","teams","subscription","payments","subscriptions","tasks","sprints","parentTask","subTasks","creator","assignee","sprint","task","author","Comment.findUnique","Comment.findUniqueOrThrow","Comment.findFirst","Comment.findFirstOrThrow","Comment.findMany","data","Comment.createOne","Comment.createMany","Comment.createManyAndReturn","Comment.updateOne","Comment.updateMany","Comment.updateManyAndReturn","create","update","Comment.upsertOne","Comment.deleteOne","Comment.deleteMany","having","_min","_max","Comment.groupBy","Comment.aggregate","Organization.findUnique","Organization.findUniqueOrThrow","Organization.findFirst","Organization.findFirstOrThrow","Organization.findMany","Organization.createOne","Organization.createMany","Organization.createManyAndReturn","Organization.updateOne","Organization.updateMany","Organization.updateManyAndReturn","Organization.upsertOne","Organization.deleteOne","Organization.deleteMany","Organization.groupBy","Organization.aggregate","OrganizationMembership.findUnique","OrganizationMembership.findUniqueOrThrow","OrganizationMembership.findFirst","OrganizationMembership.findFirstOrThrow","OrganizationMembership.findMany","OrganizationMembership.createOne","OrganizationMembership.createMany","OrganizationMembership.createManyAndReturn","OrganizationMembership.updateOne","OrganizationMembership.updateMany","OrganizationMembership.updateManyAndReturn","OrganizationMembership.upsertOne","OrganizationMembership.deleteOne","OrganizationMembership.deleteMany","OrganizationMembership.groupBy","OrganizationMembership.aggregate","Project.findUnique","Project.findUniqueOrThrow","Project.findFirst","Project.findFirstOrThrow","Project.findMany","Project.createOne","Project.createMany","Project.createManyAndReturn","Project.updateOne","Project.updateMany","Project.updateManyAndReturn","Project.upsertOne","Project.deleteOne","Project.deleteMany","Project.groupBy","Project.aggregate","ProjectTeam.findUnique","ProjectTeam.findUniqueOrThrow","ProjectTeam.findFirst","ProjectTeam.findFirstOrThrow","ProjectTeam.findMany","ProjectTeam.createOne","ProjectTeam.createMany","ProjectTeam.createManyAndReturn","ProjectTeam.updateOne","ProjectTeam.updateMany","ProjectTeam.updateManyAndReturn","ProjectTeam.upsertOne","ProjectTeam.deleteOne","ProjectTeam.deleteMany","ProjectTeam.groupBy","ProjectTeam.aggregate","Sprint.findUnique","Sprint.findUniqueOrThrow","Sprint.findFirst","Sprint.findFirstOrThrow","Sprint.findMany","Sprint.createOne","Sprint.createMany","Sprint.createManyAndReturn","Sprint.updateOne","Sprint.updateMany","Sprint.updateManyAndReturn","Sprint.upsertOne","Sprint.deleteOne","Sprint.deleteMany","Sprint.groupBy","Sprint.aggregate","Subscription.findUnique","Subscription.findUniqueOrThrow","Subscription.findFirst","Subscription.findFirstOrThrow","Subscription.findMany","Subscription.createOne","Subscription.createMany","Subscription.createManyAndReturn","Subscription.updateOne","Subscription.updateMany","Subscription.updateManyAndReturn","Subscription.upsertOne","Subscription.deleteOne","Subscription.deleteMany","Subscription.groupBy","Subscription.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","_avg","_sum","Payment.groupBy","Payment.aggregate","Task.findUnique","Task.findUniqueOrThrow","Task.findFirst","Task.findFirstOrThrow","Task.findMany","Task.createOne","Task.createMany","Task.createManyAndReturn","Task.updateOne","Task.updateMany","Task.updateManyAndReturn","Task.upsertOne","Task.deleteOne","Task.deleteMany","Task.groupBy","Task.aggregate","Team.findUnique","Team.findUniqueOrThrow","Team.findFirst","Team.findFirstOrThrow","Team.findMany","Team.createOne","Team.createMany","Team.createManyAndReturn","Team.updateOne","Team.updateMany","Team.updateManyAndReturn","Team.upsertOne","Team.deleteOne","Team.deleteMany","Team.groupBy","Team.aggregate","TeamMembership.findUnique","TeamMembership.findUniqueOrThrow","TeamMembership.findFirst","TeamMembership.findFirstOrThrow","TeamMembership.findMany","TeamMembership.createOne","TeamMembership.createMany","TeamMembership.createManyAndReturn","TeamMembership.updateOne","TeamMembership.updateMany","TeamMembership.updateManyAndReturn","TeamMembership.upsertOne","TeamMembership.deleteOne","TeamMembership.deleteMany","TeamMembership.groupBy","TeamMembership.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","AND","OR","NOT","id","email","emailVerified","passwordHash","fullName","UserStatus","status","AuthProvider","authProvider","authProviderId","deletedAt","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","every","some","none","teamId","userId","organizationId","name","description","projectId","sprintId","parentTaskId","creatorId","assigneeId","title","TaskStatus","TaskPriority","priority","subscriptionId","PaymentGateway","gateway","transactionId","amount","currency","PaymentStatus","invoiceUrl","planName","SubscriptionStatus","currentPeriodStart","currentPeriodEnd","goal","SprintStatus","startDate","endDate","assignedAt","Role","role","OrganizationMembershipStatus","slug","stripeCustomerId","taskId","authorId","content","unique_team_name_per_organization","projectId_teamId","teamId_userId","organizationId_userId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "lgdqwAEMGgAAwAMAIBsAAMEDACDkAQAAvwMAMOUBAAAYABDmAQAAvwMAMOcBAQAAAAHxAUAA_wIAIfIBQACAAwAh8wFAAIADACGmAgEA_AIAIacCAQD8AgAhqAIBAPwCACEBAAAAAQAgDAMAAJ8DACAKAADBAwAg5AEAAM4DADDlAQAAAwAQ5gEAAM4DADDnAQEA_AIAIe0BAADQA6QCIvIBQACAAwAh8wFAAIADACGDAgEA_AIAIYQCAQD8AgAhogIAAM8DogIiAgMAAJcFACAKAACjBgAgDQMAAJ8DACAKAADBAwAg5AEAAM4DADDlAQAAAwAQ5gEAAM4DADDnAQEAAAAB7QEAANADpAIi8gFAAIADACHzAUAAgAMAIYMCAQD8AgAhhAIBAPwCACGiAgAAzwOiAiKsAgAAzQMAIAMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgCQcAAMoDACAKAADBAwAg5AEAAMwDADDlAQAACAAQ5gEAAMwDADDyAUAAgAMAIfMBQACAAwAhggIBAPwCACGDAgEA_AIAIQIHAAClBgAgCgAAowYAIAoHAADKAwAgCgAAwQMAIOQBAADMAwAw5QEAAAgAEOYBAADMAwAw8gFAAIADACHzAUAAgAMAIYICAQD8AgAhgwIBAPwCACGrAgAAywMAIAMAAAAIACABAAAJADACAAAKACADAAAACAAgAQAACQAwAgAACgAgCAYAALYDACAHAADKAwAg5AEAAMkDADDlAQAADQAQ5gEAAMkDADCCAgEA_AIAIYcCAQD8AgAhoAJAAIADACECBgAAnwYAIAcAAKUGACAJBgAAtgMAIAcAAMoDACDkAQAAyQMAMOUBAAANABDmAQAAyQMAMIICAQD8AgAhhwIBAPwCACGgAkAAgAMAIaoCAADIAwAgAwAAAA0AIAEAAA4AMAIAAA8AIAEAAAAIACABAAAADQAgFwYAALYDACAOAACEAwAgFQAAxQMAIBYAAIMDACAXAADGAwAgGAAAxgMAIBkAAMcDACDkAQAAwgMAMOUBAAATABDmAQAAwgMAMOcBAQD8AgAh7QEAAMMDjgIi8QFAAP8CACHyAUAAgAMAIfMBQACAAwAhhgIBAPsCACGHAgEA_AIAIYgCAQD7AgAhiQIBAPsCACGKAgEA-wIAIYsCAQD7AgAhjAIBAPwCACGPAgAAxAOPAiINBgAAnwYAIA4AAM4EACAVAACiBgAgFgAAzQQAIBcAAKMGACAYAACjBgAgGQAApAYAIPEBAADRAwAghgIAANEDACCIAgAA0QMAIIkCAADRAwAgigIAANEDACCLAgAA0QMAIBcGAAC2AwAgDgAAhAMAIBUAAMUDACAWAACDAwAgFwAAxgMAIBgAAMYDACAZAADHAwAg5AEAAMIDADDlAQAAEwAQ5gEAAMIDADDnAQEAAAAB7QEAAMMDjgIi8QFAAP8CACHyAUAAgAMAIfMBQACAAwAhhgIBAPsCACGHAgEA_AIAIYgCAQD7AgAhiQIBAPsCACGKAgEA-wIAIYsCAQD7AgAhjAIBAPwCACGPAgAAxAOPAiIDAAAAEwAgAQAAFAAwAgAAFQAgAwAAABMAIAEAABQAMAIAABUAIAwaAADAAwAgGwAAwQMAIOQBAAC_AwAw5QEAABgAEOYBAAC_AwAw5wEBAPwCACHxAUAA_wIAIfIBQACAAwAh8wFAAIADACGmAgEA_AIAIacCAQD8AgAhqAIBAPwCACEDGgAAogYAIBsAAKMGACDxAQAA0QMAIAMAAAAYACABAAAZADACAAABACABAAAAAwAgAQAAAAgAIAEAAAATACABAAAAEwAgAQAAABgAIA0DAACfAwAgBQAAggMAIAgAALwDACDkAQAAvgMAMOUBAAAgABDmAQAAvgMAMOcBAQD8AgAh8QFAAP8CACHyAUAAgAMAIfMBQACAAwAhhAIBAPwCACGFAgEA_AIAIYYCAQD7AgAhBQMAAJcFACAFAADMBAAgCAAAoQYAIPEBAADRAwAghgIAANEDACAOAwAAnwMAIAUAAIIDACAIAAC8AwAg5AEAAL4DADDlAQAAIAAQ5gEAAL4DADDnAQEAAAAB8QFAAP8CACHyAUAAgAMAIfMBQACAAwAhhAIBAPwCACGFAgEA_AIAIYYCAQD7AgAhqQIAAL0DACADAAAAIAAgAQAAIQAwAgAAIgAgDwMAAJ8DACAPAAC8AwAgEwAAgwMAIBQAALsDACDkAQAAugMAMOUBAAAkABDmAQAAugMAMOcBAQD8AgAh7QEBAPwCACHxAUAA_wIAIfIBQACAAwAh8wFAAIADACGEAgEA_AIAIYUCAQD8AgAhhgIBAPsCACEGAwAAlwUAIA8AAKEGACATAADNBAAgFAAAoAYAIPEBAADRAwAghgIAANEDACAPAwAAnwMAIA8AALwDACATAACDAwAgFAAAuwMAIOQBAAC6AwAw5QEAACQAEOYBAAC6AwAw5wEBAAAAAe0BAQD8AgAh8QFAAP8CACHyAUAAgAMAIfMBQACAAwAhhAIBAPwCACGFAgEA_AIAIYYCAQD7AgAhAwAAACQAIAEAACUAMAIAACYAIA8DAACfAwAgEQAAoAMAIOQBAACcAwAw5QEAACgAEOYBAACcAwAw5wEBAPwCACHtAQAAnQOaAiLyAUAAgAMAIfMBQACAAwAhhAIBAPwCACGQAgEA-wIAIZICAACeA5ICIpgCAQD8AgAhmgJAAP8CACGbAkAA_wIAIQEAAAAoACAQAwAAnwMAIBAAALIDACDkAQAAtwMAMOUBAAAqABDmAQAAtwMAMOcBAQD8AgAh7QEAALkDlwIi8gFAAIADACHzAUAAgAMAIYQCAQD8AgAhkAIBAPsCACGSAgAAngOSAiKTAgEA_AIAIZQCEAC4AwAhlQIBAPwCACGXAgEA-wIAIQQDAACXBQAgEAAAmwYAIJACAADRAwAglwIAANEDACAQAwAAnwMAIBAAALIDACDkAQAAtwMAMOUBAAAqABDmAQAAtwMAMOcBAQAAAAHtAQAAuQOXAiLyAUAAgAMAIfMBQACAAwAhhAIBAPwCACGQAgEA-wIAIZICAACeA5ICIpMCAQAAAAGUAhAAuAMAIZUCAQD8AgAhlwIBAPsCACEDAAAAKgAgAQAAKwAwAgAALAAgAQAAACgAIAEAAAAqACADAAAAKgAgAQAAKwAwAgAALAAgAQAAAAMAIAEAAAAgACABAAAAJAAgAQAAACoAIA8GAAC2AwAgEwAAgwMAIOQBAAC0AwAw5QEAADUAEOYBAAC0AwAw5wEBAPwCACHtAQAAtQOeAiLxAUAA_wIAIfIBQACAAwAh8wFAAIADACGFAgEA_AIAIYcCAQD8AgAhnAIBAPsCACGeAkAA_wIAIZ8CQAD_AgAhBgYAAJ8GACATAADNBAAg8QEAANEDACCcAgAA0QMAIJ4CAADRAwAgnwIAANEDACAPBgAAtgMAIBMAAIMDACDkAQAAtAMAMOUBAAA1ABDmAQAAtAMAMOcBAQAAAAHtAQAAtQOeAiLxAUAA_wIAIfIBQACAAwAh8wFAAIADACGFAgEA_AIAIYcCAQD8AgAhnAIBAPsCACGeAkAA_wIAIZ8CQAD_AgAhAwAAADUAIAEAADYAMAIAADcAIAMAAAATACABAAAUADACAAAVACABAAAAEwAgAwAAAA0AIAEAAA4AMAIAAA8AIAMAAAATACABAAAUADACAAAVACABAAAANQAgAQAAAA0AIAEAAAATACABAAAAEwAgAwAAABMAIAEAABQAMAIAABUAIBMEAACBAwAgCwAAggMAIAwAAIMDACANAACDAwAgDgAAhAMAIOQBAAD5AgAw5QEAAEIAEOYBAAD5AgAw5wEBAPwCACHoAQEA_AIAIekBIAD6AgAh6gEBAPsCACHrAQEA_AIAIe0BAAD9Au0BIu8BAAD-Au8BIvABAQD7AgAh8QFAAP8CACHyAUAAgAMAIfMBQACAAwAhAQAAAEIAIAEAAABCACABAAAANQAgAwAAABgAIAEAABkAMAIAAAEAIAEAAAATACABAAAAGAAgAQAAAAEAIAMAAAAYACABAAAZADACAAABACADAAAAGAAgAQAAGQAwAgAAAQAgAwAAABgAIAEAABkAMAIAAAEAIAkaAADuAwAgGwAAjAQAIOcBAQAAAAHxAUAAAAAB8gFAAAAAAfMBQAAAAAGmAgEAAAABpwIBAAAAAagCAQAAAAEBIQAATQAgB-cBAQAAAAHxAUAAAAAB8gFAAAAAAfMBQAAAAAGmAgEAAAABpwIBAAAAAagCAQAAAAEBIQAATwAwASEAAE8AMAkaAADsAwAgGwAAigQAIOcBAQDVAwAh8QFAANoDACHyAUAA2wMAIfMBQADbAwAhpgIBANUDACGnAgEA1QMAIagCAQDVAwAhAgAAAAEAICEAAFIAIAfnAQEA1QMAIfEBQADaAwAh8gFAANsDACHzAUAA2wMAIaYCAQDVAwAhpwIBANUDACGoAgEA1QMAIQIAAAAYACAhAABUACACAAAAGAAgIQAAVAAgAwAAAAEAICgAAE0AICkAAFIAIAEAAAABACABAAAAGAAgBAkAAJwGACAuAACeBgAgLwAAnQYAIPEBAADRAwAgCuQBAACzAwAw5QEAAFsAEOYBAACzAwAw5wEBAOICACHxAUAA5wIAIfIBQADoAgAh8wFAAOgCACGmAgEA4gIAIacCAQDiAgAhqAIBAOICACEDAAAAGAAgAQAAWgAwLQAAWwAgAwAAABgAIAEAABkAMAIAAAEAIA8EAACBAwAgCAAAsQMAIA8AALADACARAACgAwAgEgAAsgMAIOQBAACvAwAw5QEAAGEAEOYBAACvAwAw5wEBAAAAAfEBQAD_AgAh8gFAAIADACHzAUAAgAMAIYUCAQD8AgAhpAIBAAAAAaUCAQAAAAEBAAAAXgAgAQAAAF4AIA8EAACBAwAgCAAAsQMAIA8AALADACARAACgAwAgEgAAsgMAIOQBAACvAwAw5QEAAGEAEOYBAACvAwAw5wEBAPwCACHxAUAA_wIAIfIBQACAAwAh8wFAAIADACGFAgEA_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_wIAIQEAAADPAQAgAQAAAM8BACAFAwAAlwUAIBEAAJgFACCQAgAA0QMAIJoCAADRAwAgmwIAANEDACADAAAAKAAgAQAA0gEAMAIAAM8BACADAAAAKAAgAQAA0gEAMAIAAM8BACADAAAAKAAgAQAA0gEAMAIAAM8BACAMAwAAlQUAIBEAAJYFACDnAQEAAAAB7QEAAACaAgLyAUAAAAAB8wFAAAAAAYQCAQAAAAGQAgEAAAABkgIAAACSAgKYAgEAAAABmgJAAAAAAZsCQAAAAAEBIQAA1gEAIArnAQEAAAAB7QEAAACaAgLyAUAAAAAB8wFAAAAAAYQCAQAAAAGQAgEAAAABkgIAAACSAgKYAgEAAAABmgJAAAAAAZsCQAAAAAEBIQAA2AEAMAEhAADYAQAwDAMAAIcFACARAACIBQAg5wEBANUDACHtAQAAhgWaAiLyAUAA2wMAIfMBQADbAwAhhAIBANUDACGQAgEA1wMAIZICAAD8BJICIpgCAQDVAwAhmgJAANoDACGbAkAA2gMAIQIAAADPAQAgIQAA2wEAIArnAQEA1QMAIe0BAACGBZoCIvIBQADbAwAh8wFAANsDACGEAgEA1QMAIZACAQDXAwAhkgIAAPwEkgIimAIBANUDACGaAkAA2gMAIZsCQADaAwAhAgAAACgAICEAAN0BACACAAAAKAAgIQAA3QEAIAMAAADPAQAgKAAA1gEAICkAANsBACABAAAAzwEAIAEAAAAoACAGCQAAgwUAIC4AAIUFACAvAACEBQAgkAIAANEDACCaAgAA0QMAIJsCAADRAwAgDeQBAACYAwAw5QEAAOQBABDmAQAAmAMAMOcBAQDiAgAh7QEAAJkDmgIi8gFAAOgCACHzAUAA6AIAIYQCAQDiAgAhkAIBAOQCACGSAgAAjwOSAiKYAgEA4gIAIZoCQADnAgAhmwJAAOcCACEDAAAAKAAgAQAA4wEAMC0AAOQBACADAAAAKAAgAQAA0gEAMAIAAM8BACABAAAALAAgAQAAACwAIAMAAAAqACABAAArADACAAAsACADAAAAKgAgAQAAKwAwAgAALAAgAwAAACoAIAEAACsAMAIAACwAIA0DAACBBQAgEAAAggUAIOcBAQAAAAHtAQAAAJcCAvIBQAAAAAHzAUAAAAABhAIBAAAAAZACAQAAAAGSAgAAAJICApMCAQAAAAGUAhAAAAABlQIBAAAAAZcCAQAAAAEBIQAA7AEAIAvnAQEAAAAB7QEAAACXAgLyAUAAAAAB8wFAAAAAAYQCAQAAAAGQAgEAAAABkgIAAACSAgKTAgEAAAABlAIQAAAAAZUCAQAAAAGXAgEAAAABASEAAO4BADABIQAA7gEAMAEAAAAoACANAwAA_wQAIBAAAIAFACDnAQEA1QMAIe0BAAD-BJcCIvIBQADbAwAh8wFAANsDACGEAgEA1QMAIZACAQDXAwAhkgIAAPwEkgIikwIBANUDACGUAhAA_QQAIZUCAQDVAwAhlwIBANcDACECAAAALAAgIQAA8gEAIAvnAQEA1QMAIe0BAAD-BJcCIvIBQADbAwAh8wFAANsDACGEAgEA1QMAIZACAQDXAwAhkgIAAPwEkgIikwIBANUDACGUAhAA_QQAIZUCAQDVAwAhlwIBANcDACECAAAAKgAgIQAA9AEAIAIAAAAqACAhAAD0AQAgAQAAACgAIAMAAAAsACAoAADsAQAgKQAA8gEAIAEAAAAsACABAAAAKgAgBwkAAPcEACAuAAD6BAAgLwAA-QQAIKABAAD4BAAgoQEAAPsEACCQAgAA0QMAIJcCAADRAwAgDuQBAACOAwAw5QEAAPwBABDmAQAAjgMAMOcBAQDiAgAh7QEAAJEDlwIi8gFAAOgCACHzAUAA6AIAIYQCAQDiAgAhkAIBAOQCACGSAgAAjwOSAiKTAgEA4gIAIZQCEACQAwAhlQIBAOICACGXAgEA5AIAIQMAAAAqACABAAD7AQAwLQAA_AEAIAMAAAAqACABAAArADACAAAsACABAAAAFQAgAQAAABUAIAMAAAATACABAAAUADACAAAVACADAAAAEwAgAQAAFAAwAgAAFQAgAwAAABMAIAEAABQAMAIAABUAIBQGAACXBAAgDgAAnAQAIBUAAJ4EACAWAACYBAAgFwAAmQQAIBgAAJoEACAZAACbBAAg5wEBAAAAAe0BAAAAjgIC8QFAAAAAAfIBQAAAAAHzAUAAAAABhgIBAAAAAYcCAQAAAAGIAgEAAAABiQIBAAAAAYoCAQAAAAGLAgEAAAABjAIBAAAAAY8CAAAAjwICASEAAIQCACAN5wEBAAAAAe0BAAAAjgIC8QFAAAAAAfIBQAAAAAHzAUAAAAABhgIBAAAAAYcCAQAAAAGIAgEAAAABiQIBAAAAAYoCAQAAAAGLAgEAAAABjAIBAAAAAY8CAAAAjwICASEAAIYCADABIQAAhgIAMAEAAAATACABAAAAQgAgAQAAAEIAIAEAAAA1ACAUBgAA_AMAIA4AAIEEACAVAAD9AwAgFgAA_gMAIBcAAP8DACAYAACVBAAgGQAAgAQAIOcBAQDVAwAh7QEAAPkDjgIi8QFAANoDACHyAUAA2wMAIfMBQADbAwAhhgIBANcDACGHAgEA1QMAIYgCAQDXAwAhiQIBANcDACGKAgEA1wMAIYsCAQDXAwAhjAIBANUDACGPAgAA-gOPAiICAAAAFQAgIQAAjQIAIA3nAQEA1QMAIe0BAAD5A44CIvEBQADaAwAh8gFAANsDACHzAUAA2wMAIYYCAQDXAwAhhwIBANUDACGIAgEA1wMAIYkCAQDXAwAhigIBANcDACGLAgEA1wMAIYwCAQDVAwAhjwIAAPoDjwIiAgAAABMAICEAAI8CACACAAAAEwAgIQAAjwIAIAEAAAATACABAAAAQgAgAQAAAEIAIAEAAAA1ACADAAAAFQAgKAAAhAIAICkAAI0CACABAAAAFQAgAQAAABMAIAkJAAD0BAAgLgAA9gQAIC8AAPUEACDxAQAA0QMAIIYCAADRAwAgiAIAANEDACCJAgAA0QMAIIoCAADRAwAgiwIAANEDACAQ5AEAAIcDADDlAQAAmgIAEOYBAACHAwAw5wEBAOICACHtAQAAiAOOAiLxAUAA5wIAIfIBQADoAgAh8wFAAOgCACGGAgEA5AIAIYcCAQDiAgAhiAIBAOQCACGJAgEA5AIAIYoCAQDkAgAhiwIBAOQCACGMAgEA4gIAIY8CAACJA48CIgMAAAATACABAACZAgAwLQAAmgIAIAMAAAATACABAAAUADACAAAVACABAAAAIgAgAQAAACIAIAMAAAAgACABAAAhADACAAAiACADAAAAIAAgAQAAIQAwAgAAIgAgAwAAACAAIAEAACEAMAIAACIAIAoDAADxBAAgBQAA8gQAIAgAAPMEACDnAQEAAAAB8QFAAAAAAfIBQAAAAAHzAUAAAAABhAIBAAAAAYUCAQAAAAGGAgEAAAABASEAAKICACAH5wEBAAAAAfEBQAAAAAHyAUAAAAAB8wFAAAAAAYQCAQAAAAGFAgEAAAABhgIBAAAAAQEhAACkAgAwASEAAKQCADAKAwAA1wQAIAUAANgEACAIAADZBAAg5wEBANUDACHxAUAA2gMAIfIBQADbAwAh8wFAANsDACGEAgEA1QMAIYUCAQDVAwAhhgIBANcDACECAAAAIgAgIQAApwIAIAfnAQEA1QMAIfEBQADaAwAh8gFAANsDACHzAUAA2wMAIYQCAQDVAwAhhQIBANUDACGGAgEA1wMAIQIAAAAgACAhAACpAgAgAgAAACAAICEAAKkCACADAAAAIgAgKAAAogIAICkAAKcCACABAAAAIgAgAQAAACAAIAUJAADUBAAgLgAA1gQAIC8AANUEACDxAQAA0QMAIIYCAADRAwAgCuQBAACGAwAw5QEAALACABDmAQAAhgMAMOcBAQDiAgAh8QFAAOcCACHyAUAA6AIAIfMBQADoAgAhhAIBAOICACGFAgEA4gIAIYYCAQDkAgAhAwAAACAAIAEAAK8CADAtAACwAgAgAwAAACAAIAEAACEAMAIAACIAIAEAAAAKACABAAAACgAgAwAAAAgAIAEAAAkAMAIAAAoAIAMAAAAIACABAAAJADACAAAKACADAAAACAAgAQAACQAwAgAACgAgBgcAALUEACAKAADTBAAg8gFAAAAAAfMBQAAAAAGCAgEAAAABgwIBAAAAAQEhAAC4AgAgBPIBQAAAAAHzAUAAAAABggIBAAAAAYMCAQAAAAEBIQAAugIAMAEhAAC6AgAwBgcAALMEACAKAADSBAAg8gFAANsDACHzAUAA2wMAIYICAQDVAwAhgwIBANUDACECAAAACgAgIQAAvQIAIATyAUAA2wMAIfMBQADbAwAhggIBANUDACGDAgEA1QMAIQIAAAAIACAhAAC_AgAgAgAAAAgAICEAAL8CACADAAAACgAgKAAAuAIAICkAAL0CACABAAAACgAgAQAAAAgAIAMJAADPBAAgLgAA0QQAIC8AANAEACAH5AEAAIUDADDlAQAAxgIAEOYBAACFAwAw8gFAAOgCACHzAUAA6AIAIYICAQDiAgAhgwIBAOICACEDAAAACAAgAQAAxQIAMC0AAMYCACADAAAACAAgAQAACQAwAgAACgAgEwQAAIEDACALAACCAwAgDAAAgwMAIA0AAIMDACAOAACEAwAg5AEAAPkCADDlAQAAQgAQ5gEAAPkCADDnAQEAAAAB6AEBAAAAAekBIAD6AgAh6gEBAPsCACHrAQEA_AIAIe0BAAD9Au0BIu8BAAD-Au8BIvABAQD7AgAh8QFAAP8CACHyAUAAgAMAIfMBQACAAwAhAQAAAMkCACABAAAAyQIAIAgEAADLBAAgCwAAzAQAIAwAAM0EACANAADNBAAgDgAAzgQAIOoBAADRAwAg8AEAANEDACDxAQAA0QMAIAMAAABCACABAADMAgAwAgAAyQIAIAMAAABCACABAADMAgAwAgAAyQIAIAMAAABCACABAADMAgAwAgAAyQIAIBAEAADGBAAgCwAAxwQAIAwAAMgEACANAADJBAAgDgAAygQAIOcBAQAAAAHoAQEAAAAB6QEgAAAAAeoBAQAAAAHrAQEAAAAB7QEAAADtAQLvAQAAAO8BAvABAQAAAAHxAUAAAAAB8gFAAAAAAfMBQAAAAAEBIQAA0AIAIAvnAQEAAAAB6AEBAAAAAekBIAAAAAHqAQEAAAAB6wEBAAAAAe0BAAAA7QEC7wEAAADvAQLwAQEAAAAB8QFAAAAAAfIBQAAAAAHzAUAAAAABASEAANICADABIQAA0gIAMBAEAADcAwAgCwAA3QMAIAwAAN4DACANAADfAwAgDgAA4AMAIOcBAQDVAwAh6AEBANUDACHpASAA1gMAIeoBAQDXAwAh6wEBANUDACHtAQAA2APtASLvAQAA2QPvASLwAQEA1wMAIfEBQADaAwAh8gFAANsDACHzAUAA2wMAIQIAAADJAgAgIQAA1QIAIAvnAQEA1QMAIegBAQDVAwAh6QEgANYDACHqAQEA1wMAIesBAQDVAwAh7QEAANgD7QEi7wEAANkD7wEi8AEBANcDACHxAUAA2gMAIfIBQADbAwAh8wFAANsDACECAAAAQgAgIQAA1wIAIAIAAABCACAhAADXAgAgAwAAAMkCACAoAADQAgAgKQAA1QIAIAEAAADJAgAgAQAAAEIAIAYJAADSAwAgLgAA1AMAIC8AANMDACDqAQAA0QMAIPABAADRAwAg8QEAANEDACAO5AEAAOECADDlAQAA3gIAEOYBAADhAgAw5wEBAOICACHoAQEA4gIAIekBIADjAgAh6gEBAOQCACHrAQEA4gIAIe0BAADlAu0BIu8BAADmAu8BIvABAQDkAgAh8QFAAOcCACHyAUAA6AIAIfMBQADoAgAhAwAAAEIAIAEAAN0CADAtAADeAgAgAwAAAEIAIAEAAMwCADACAADJAgAgDuQBAADhAgAw5QEAAN4CABDmAQAA4QIAMOcBAQDiAgAh6AEBAOICACHpASAA4wIAIeoBAQDkAgAh6wEBAOICACHtAQAA5QLtASLvAQAA5gLvASLwAQEA5AIAIfEBQADnAgAh8gFAAOgCACHzAUAA6AIAIQ4JAADqAgAgLgAA-AIAIC8AAPgCACD0AQEAAAAB9QEBAAAABPYBAQAAAAT3AQEAAAAB-AEBAAAAAfkBAQAAAAH6AQEAAAAB-wEBAPcCACH8AQEAAAAB_QEBAAAAAf4BAQAAAAEFCQAA6gIAIC4AAPYCACAvAAD2AgAg9AEgAAAAAfsBIAD1AgAhDgkAAO0CACAuAAD0AgAgLwAA9AIAIPQBAQAAAAH1AQEAAAAF9gEBAAAABfcBAQAAAAH4AQEAAAAB-QEBAAAAAfoBAQAAAAH7AQEA8wIAIfwBAQAAAAH9AQEAAAAB_gEBAAAAAQcJAADqAgAgLgAA8gIAIC8AAPICACD0AQAAAO0BAvUBAAAA7QEI9gEAAADtAQj7AQAA8QLtASIHCQAA6gIAIC4AAPACACAvAADwAgAg9AEAAADvAQL1AQAAAO8BCPYBAAAA7wEI-wEAAO8C7wEiCwkAAO0CACAuAADuAgAgLwAA7gIAIPQBQAAAAAH1AUAAAAAF9gFAAAAABfcBQAAAAAH4AUAAAAAB-QFAAAAAAfoBQAAAAAH7AUAA7AIAIQsJAADqAgAgLgAA6wIAIC8AAOsCACD0AUAAAAAB9QFAAAAABPYBQAAAAAT3AUAAAAAB-AFAAAAAAfkBQAAAAAH6AUAAAAAB-wFAAOkCACELCQAA6gIAIC4AAOsCACAvAADrAgAg9AFAAAAAAfUBQAAAAAT2AUAAAAAE9wFAAAAAAfgBQAAAAAH5AUAAAAAB-gFAAAAAAfsBQADpAgAhCPQBAgAAAAH1AQIAAAAE9gECAAAABPcBAgAAAAH4AQIAAAAB-QECAAAAAfoBAgAAAAH7AQIA6gIAIQj0AUAAAAAB9QFAAAAABPYBQAAAAAT3AUAAAAAB-AFAAAAAAfkBQAAAAAH6AUAAAAAB-wFAAOsCACELCQAA7QIAIC4AAO4CACAvAADuAgAg9AFAAAAAAfUBQAAAAAX2AUAAAAAF9wFAAAAAAfgBQAAAAAH5AUAAAAAB-gFAAAAAAfsBQADsAgAhCPQBAgAAAAH1AQIAAAAF9gECAAAABfcBAgAAAAH4AQIAAAAB-QECAAAAAfoBAgAAAAH7AQIA7QIAIQj0AUAAAAAB9QFAAAAABfYBQAAAAAX3AUAAAAAB-AFAAAAAAfkBQAAAAAH6AUAAAAAB-wFAAO4CACEHCQAA6gIAIC4AAPACACAvAADwAgAg9AEAAADvAQL1AQAAAO8BCPYBAAAA7wEI-wEAAO8C7wEiBPQBAAAA7wEC9QEAAADvAQj2AQAAAO8BCPsBAADwAu8BIgcJAADqAgAgLgAA8gIAIC8AAPICACD0AQAAAO0BAvUBAAAA7QEI9gEAAADtAQj7AQAA8QLtASIE9AEAAADtAQL1AQAAAO0BCPYBAAAA7QEI-wEAAPIC7QEiDgkAAO0CACAuAAD0AgAgLwAA9AIAIPQBAQAAAAH1AQEAAAAF9gEBAAAABfcBAQAAAAH4AQEAAAAB-QEBAAAAAfoBAQAAAAH7AQEA8wIAIfwBAQAAAAH9AQEAAAAB_gEBAAAAAQv0AQEAAAAB9QEBAAAABfYBAQAAAAX3AQEAAAAB-AEBAAAAAfkBAQAAAAH6AQEAAAAB-wEBAPQCACH8AQEAAAAB_QEBAAAAAf4BAQAAAAEFCQAA6gIAIC4AAPYCACAvAAD2AgAg9AEgAAAAAfsBIAD1AgAhAvQBIAAAAAH7ASAA9gIAIQ4JAADqAgAgLgAA-AIAIC8AAPgCACD0AQEAAAAB9QEBAAAABPYBAQAAAAT3AQEAAAAB-AEBAAAAAfkBAQAAAAH6AQEAAAAB-wEBAPcCACH8AQEAAAAB_QEBAAAAAf4BAQAAAAEL9AEBAAAAAfUBAQAAAAT2AQEAAAAE9wEBAAAAAfgBAQAAAAH5AQEAAAAB-gEBAAAAAfsBAQD4AgAh_AEBAAAAAf0BAQAAAAH-AQEAAAABEwQAAIEDACALAACCAwAgDAAAgwMAIA0AAIMDACAOAACEAwAg5AEAAPkCADDlAQAAQgAQ5gEAAPkCADDnAQEA_AIAIegBAQD8AgAh6QEgAPoCACHqAQEA-wIAIesBAQD8AgAh7QEAAP0C7QEi7wEAAP4C7wEi8AEBAPsCACHxAUAA_wIAIfIBQACAAwAh8wFAAIADACEC9AEgAAAAAfsBIAD2AgAhC_QBAQAAAAH1AQEAAAAF9gEBAAAABfcBAQAAAAH4AQEAAAAB-QEBAAAAAfoBAQAAAAH7AQEA9AIAIfwBAQAAAAH9AQEAAAAB_gEBAAAAAQv0AQEAAAAB9QEBAAAABPYBAQAAAAT3AQEAAAAB-AEBAAAAAfkBAQAAAAH6AQEAAAAB-wEBAPgCACH8AQEAAAAB_QEBAAAAAf4BAQAAAAEE9AEAAADtAQL1AQAAAO0BCPYBAAAA7QEI-wEAAPIC7QEiBPQBAAAA7wEC9QEAAADvAQj2AQAAAO8BCPsBAADwAu8BIgj0AUAAAAAB9QFAAAAABfYBQAAAAAX3AUAAAAAB-AFAAAAAAfkBQAAAAAH6AUAAAAAB-wFAAO4CACEI9AFAAAAAAfUBQAAAAAT2AUAAAAAE9wFAAAAAAfgBQAAAAAH5AUAAAAAB-gFAAAAAAfsBQADrAgAhA_8BAAADACCAAgAAAwAggQIAAAMAIAP_AQAACAAggAIAAAgAIIECAAAIACAD_wEAABMAIIACAAATACCBAgAAEwAgA_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_AIAIZoCQAD_AgAhmwJAAP8CACEE9AEAAACaAgL1AQAAAJoCCPYBAAAAmgII-wEAAJsDmgIiBPQBAAAAkgIC9QEAAACSAgj2AQAAAJICCPsBAACXA5ICIhEEAACBAwAgCAAAsQMAIA8AALADACARAACgAwAgEgAAsgMAIOQBAACvAwAw5QEAAGEAEOYBAACvAwAw5wEBAPwCACHxAUAA_wIAIfIBQACAAwAh8wFAAIADACGFAgEA_AIAIaQCAQD8AgAhpQIBAPsCACGtAgAAYQAgrgIAAGEAIAP_AQAAKgAggAIAACoAIIECAAAqACAN5AEAAKEDADDlAQAAzAEAEOYBAAChAwAw5wEBAOICACHtAQAAogOeAiLxAUAA5wIAIfIBQADoAgAh8wFAAOgCACGFAgEA4gIAIYcCAQDiAgAhnAIBAOQCACGeAkAA5wIAIZ8CQADnAgAhBwkAAOoCACAuAACkAwAgLwAApAMAIPQBAAAAngIC9QEAAACeAgj2AQAAAJ4CCPsBAACjA54CIgcJAADqAgAgLgAApAMAIC8AAKQDACD0AQAAAJ4CAvUBAAAAngII9gEAAACeAgj7AQAAowOeAiIE9AEAAACeAgL1AQAAAJ4CCPYBAAAAngII-wEAAKQDngIiBuQBAAClAwAw5QEAALYBABDmAQAApQMAMIICAQDiAgAhhwIBAOICACGgAkAA6AIAIQvkAQAApgMAMOUBAACgAQAQ5gEAAKYDADDnAQEA4gIAIe0BAQDiAgAh8QFAAOcCACHyAUAA6AIAIfMBQADoAgAhhAIBAOICACGFAgEA4gIAIYYCAQDkAgAhCuQBAACnAwAw5QEAAIoBABDmAQAApwMAMOcBAQDiAgAh7QEAAKkDpAIi8gFAAOgCACHzAUAA6AIAIYMCAQDiAgAhhAIBAOICACGiAgAAqAOiAiIHCQAA6gIAIC4AAK0DACAvAACtAwAg9AEAAACiAgL1AQAAAKICCPYBAAAAogII-wEAAKwDogIiBwkAAOoCACAuAACrAwAgLwAAqwMAIPQBAAAApAIC9QEAAACkAgj2AQAAAKQCCPsBAACqA6QCIgcJAADqAgAgLgAAqwMAIC8AAKsDACD0AQAAAKQCAvUBAAAApAII9gEAAACkAgj7AQAAqgOkAiIE9AEAAACkAgL1AQAAAKQCCPYBAAAApAII-wEAAKsDpAIiBwkAAOoCACAuAACtAwAgLwAArQMAIPQBAAAAogIC9QEAAACiAgj2AQAAAKICCPsBAACsA6ICIgT0AQAAAKICAvUBAAAAogII9gEAAACiAgj7AQAArQOiAiIK5AEAAK4DADDlAQAAdAAQ5gEAAK4DADDnAQEA4gIAIfEBQADnAgAh8gFAAOgCACHzAUAA6AIAIYUCAQDiAgAhpAIBAOICACGlAgEA5AIAIQ8EAACBAwAgCAAAsQMAIA8AALADACARAACgAwAgEgAAsgMAIOQBAACvAwAw5QEAAGEAEOYBAACvAwAw5wEBAPwCACHxAUAA_wIAIfIBQACAAwAh8wFAAIADACGFAgEA_AIAIaQCAQD8AgAhpQIBAPsCACED_wEAACAAIIACAAAgACCBAgAAIAAgA_8BAAAkACCAAgAAJAAggQIAACQAIBEDAACfAwAgEQAAoAMAIOQBAACcAwAw5QEAACgAEOYBAACcAwAw5wEBAPwCACHtAQAAnQOaAiLyAUAAgAMAIfMBQACAAwAhhAIBAPwCACGQAgEA-wIAIZICAACeA5ICIpgCAQD8AgAhmgJAAP8CACGbAkAA_wIAIa0CAAAoACCuAgAAKAAgCuQBAACzAwAw5QEAAFsAEOYBAACzAwAw5wEBAOICACHxAUAA5wIAIfIBQADoAgAh8wFAAOgCACGmAgEA4gIAIacCAQDiAgAhqAIBAOICACEPBgAAtgMAIBMAAIMDACDkAQAAtAMAMOUBAAA1ABDmAQAAtAMAMOcBAQD8AgAh7QEAALUDngIi8QFAAP8CACHyAUAAgAMAIfMBQACAAwAhhQIBAPwCACGHAgEA_AIAIZwCAQD7AgAhngJAAP8CACGfAkAA_wIAIQT0AQAAAJ4CAvUBAAAAngII9gEAAACeAgj7AQAApAOeAiIRAwAAnwMAIA8AALwDACATAACDAwAgFAAAuwMAIOQBAAC6AwAw5QEAACQAEOYBAAC6AwAw5wEBAPwCACHtAQEA_AIAIfEBQAD_AgAh8gFAAIADACHzAUAAgAMAIYQCAQD8AgAhhQIBAPwCACGGAgEA-wIAIa0CAAAkACCuAgAAJAAgEAMAAJ8DACAQAACyAwAg5AEAALcDADDlAQAAKgAQ5gEAALcDADDnAQEA_AIAIe0BAAC5A5cCIvIBQACAAwAh8wFAAIADACGEAgEA_AIAIZACAQD7AgAhkgIAAJ4DkgIikwIBAPwCACGUAhAAuAMAIZUCAQD8AgAhlwIBAPsCACEI9AEQAAAAAfUBEAAAAAT2ARAAAAAE9wEQAAAAAfgBEAAAAAH5ARAAAAAB-gEQAAAAAfsBEACVAwAhBPQBAAAAlwIC9QEAAACXAgj2AQAAAJcCCPsBAACTA5cCIg8DAACfAwAgDwAAvAMAIBMAAIMDACAUAAC7AwAg5AEAALoDADDlAQAAJAAQ5gEAALoDADDnAQEA_AIAIe0BAQD8AgAh8QFAAP8CACHyAUAAgAMAIfMBQACAAwAhhAIBAPwCACGFAgEA_AIAIYYCAQD7AgAhA_8BAAA1ACCAAgAANQAggQIAADUAIAP_AQAADQAggAIAAA0AIIECAAANACAChAIBAAAAAYUCAQAAAAENAwAAnwMAIAUAAIIDACAIAAC8AwAg5AEAAL4DADDlAQAAIAAQ5gEAAL4DADDnAQEA_AIAIfEBQAD_AgAh8gFAAIADACHzAUAAgAMAIYQCAQD8AgAhhQIBAPwCACGGAgEA-wIAIQwaAADAAwAgGwAAwQMAIOQBAAC_AwAw5QEAABgAEOYBAAC_AwAw5wEBAPwCACHxAUAA_wIAIfIBQACAAwAh8wFAAIADACGmAgEA_AIAIacCAQD8AgAhqAIBAPwCACEZBgAAtgMAIA4AAIQDACAVAADFAwAgFgAAgwMAIBcAAMYDACAYAADGAwAgGQAAxwMAIOQBAADCAwAw5QEAABMAEOYBAADCAwAw5wEBAPwCACHtAQAAwwOOAiLxAUAA_wIAIfIBQACAAwAh8wFAAIADACGGAgEA-wIAIYcCAQD8AgAhiAIBAPsCACGJAgEA-wIAIYoCAQD7AgAhiwIBAPsCACGMAgEA_AIAIY8CAADEA48CIq0CAAATACCuAgAAEwAgFQQAAIEDACALAACCAwAgDAAAgwMAIA0AAIMDACAOAACEAwAg5AEAAPkCADDlAQAAQgAQ5gEAAPkCADDnAQEA_AIAIegBAQD8AgAh6QEgAPoCACHqAQEA-wIAIesBAQD8AgAh7QEAAP0C7QEi7wEAAP4C7wEi8AEBAPsCACHxAUAA_wIAIfIBQACAAwAh8wFAAIADACGtAgAAQgAgrgIAAEIAIBcGAAC2AwAgDgAAhAMAIBUAAMUDACAWAACDAwAgFwAAxgMAIBgAAMYDACAZAADHAwAg5AEAAMIDADDlAQAAEwAQ5gEAAMIDADDnAQEA_AIAIe0BAADDA44CIvEBQAD_AgAh8gFAAIADACHzAUAAgAMAIYYCAQD7AgAhhwIBAPwCACGIAgEA-wIAIYkCAQD7AgAhigIBAPsCACGLAgEA-wIAIYwCAQD8AgAhjwIAAMQDjwIiBPQBAAAAjgIC9QEAAACOAgj2AQAAAI4CCPsBAACNA44CIgT0AQAAAI8CAvUBAAAAjwII9gEAAACPAgj7AQAAiwOPAiIZBgAAtgMAIA4AAIQDACAVAADFAwAgFgAAgwMAIBcAAMYDACAYAADGAwAgGQAAxwMAIOQBAADCAwAw5QEAABMAEOYBAADCAwAw5wEBAPwCACHtAQAAwwOOAiLxAUAA_wIAIfIBQACAAwAh8wFAAIADACGGAgEA-wIAIYcCAQD8AgAhiAIBAPsCACGJAgEA-wIAIYoCAQD7AgAhiwIBAPsCACGMAgEA_AIAIY8CAADEA48CIq0CAAATACCuAgAAEwAgFQQAAIEDACALAACCAwAgDAAAgwMAIA0AAIMDACAOAACEAwAg5AEAAPkCADDlAQAAQgAQ5gEAAPkCADDnAQEA_AIAIegBAQD8AgAh6QEgAPoCACHqAQEA-wIAIesBAQD8AgAh7QEAAP0C7QEi7wEAAP4C7wEi8AEBAPsCACHxAUAA_wIAIfIBQACAAwAh8wFAAIADACGtAgAAQgAgrgIAAEIAIBEGAAC2AwAgEwAAgwMAIOQBAAC0AwAw5QEAADUAEOYBAAC0AwAw5wEBAPwCACHtAQAAtQOeAiLxAUAA_wIAIfIBQACAAwAh8wFAAIADACGFAgEA_AIAIYcCAQD8AgAhnAIBAPsCACGeAkAA_wIAIZ8CQAD_AgAhrQIAADUAIK4CAAA1ACACggIBAAAAAYcCAQAAAAEIBgAAtgMAIAcAAMoDACDkAQAAyQMAMOUBAAANABDmAQAAyQMAMIICAQD8AgAhhwIBAPwCACGgAkAAgAMAIQ8DAACfAwAgBQAAggMAIAgAALwDACDkAQAAvgMAMOUBAAAgABDmAQAAvgMAMOcBAQD8AgAh8QFAAP8CACHyAUAAgAMAIfMBQACAAwAhhAIBAPwCACGFAgEA_AIAIYYCAQD7AgAhrQIAACAAIK4CAAAgACACggIBAAAAAYMCAQAAAAEJBwAAygMAIAoAAMEDACDkAQAAzAMAMOUBAAAIABDmAQAAzAMAMPIBQACAAwAh8wFAAIADACGCAgEA_AIAIYMCAQD8AgAhAoMCAQAAAAGEAgEAAAABDAMAAJ8DACAKAADBAwAg5AEAAM4DADDlAQAAAwAQ5gEAAM4DADDnAQEA_AIAIe0BAADQA6QCIvIBQACAAwAh8wFAAIADACGDAgEA_AIAIYQCAQD8AgAhogIAAM8DogIiBPQBAAAAogIC9QEAAACiAgj2AQAAAKICCPsBAACtA6ICIgT0AQAAAKQCAvUBAAAApAII9gEAAACkAgj7AQAAqwOkAiIAAAAAAbICAQAAAAEBsgIgAAAAAQGyAgEAAAABAbICAAAA7QECAbICAAAA7wECAbICQAAAAAEBsgJAAAAAAQsoAAC2BAAwKQAAuwQAMK8CAAC3BAAwsAIAALgEADCxAgAAuQQAILICAAC6BAAwswIAALoEADC0AgAAugQAMLUCAAC6BAAwtgIAALwEADC3AgAAvQQAMAsoAACoBAAwKQAArQQAMK8CAACpBAAwsAIAAKoEADCxAgAAqwQAILICAACsBAAwswIAAKwEADC0AgAArAQAMLUCAACsBAAwtgIAAK4EADC3AgAArwQAMAsoAACfBAAwKQAAowQAMK8CAACgBAAwsAIAAKEEADCxAgAAogQAILICAADzAwAwswIAAPMDADC0AgAA8wMAMLUCAADzAwAwtgIAAKQEADC3AgAA9gMAMAsoAADvAwAwKQAA9AMAMK8CAADwAwAwsAIAAPEDADCxAgAA8gMAILICAADzAwAwswIAAPMDADC0AgAA8wMAMLUCAADzAwAwtgIAAPUDADC3AgAA9gMAMAsoAADhAwAwKQAA5gMAMK8CAADiAwAwsAIAAOMDADCxAgAA5AMAILICAADlAwAwswIAAOUDADC0AgAA5QMAMLUCAADlAwAwtgIAAOcDADC3AgAA6AMAMAcaAADuAwAg5wEBAAAAAfEBQAAAAAHyAUAAAAAB8wFAAAAAAaYCAQAAAAGoAgEAAAABAgAAAAEAICgAAO0DACADAAAAAQAgKAAA7QMAICkAAOsDACABIQAAlgcAMAwaAADAAwAgGwAAwQMAIOQBAAC_AwAw5QEAABgAEOYBAAC_AwAw5wEBAAAAAfEBQAD_AgAh8gFAAIADACHzAUAAgAMAIaYCAQD8AgAhpwIBAPwCACGoAgEA_AIAIQIAAAABACAhAADrAwAgAgAAAOkDACAhAADqAwAgCuQBAADoAwAw5QEAAOkDABDmAQAA6AMAMOcBAQD8AgAh8QFAAP8CACHyAUAAgAMAIfMBQACAAwAhpgIBAPwCACGnAgEA_AIAIagCAQD8AgAhCuQBAADoAwAw5QEAAOkDABDmAQAA6AMAMOcBAQD8AgAh8QFAAP8CACHyAUAAgAMAIfMBQACAAwAhpgIBAPwCACGnAgEA_AIAIagCAQD8AgAhBucBAQDVAwAh8QFAANoDACHyAUAA2wMAIfMBQADbAwAhpgIBANUDACGoAgEA1QMAIQcaAADsAwAg5wEBANUDACHxAUAA2gMAIfIBQADbAwAh8wFAANsDACGmAgEA1QMAIagCAQDVAwAhBSgAAJEHACApAACUBwAgrwIAAJIHACCwAgAAkwcAILUCAAAVACAHGgAA7gMAIOcBAQAAAAHxAUAAAAAB8gFAAAAAAfMBQAAAAAGmAgEAAAABqAIBAAAAAQMoAACRBwAgrwIAAJIHACC1AgAAFQAgEgYAAJcEACAOAACcBAAgFQAAngQAIBYAAJgEACAXAACZBAAgGQAAmwQAIOcBAQAAAAHtAQAAAI4CAvEBQAAAAAHyAUAAAAAB8wFAAAAAAYYCAQAAAAGHAgEAAAABiAIBAAAAAYkCAQAAAAGKAgEAAAABjAIBAAAAAY8CAAAAjwICAgAAABUAICgAAJ0EACADAAAAFQAgKAAAnQQAICkAAPsDACABIQAAkAcAMBcGAAC2AwAgDgAAhAMAIBUAAMUDACAWAACDAwAgFwAAxgMAIBgAAMYDACAZAADHAwAg5AEAAMIDADDlAQAAEwAQ5gEAAMIDADDnAQEAAAAB7QEAAMMDjgIi8QFAAP8CACHyAUAAgAMAIfMBQACAAwAhhgIBAPsCACGHAgEA_AIAIYgCAQD7AgAhiQIBAPsCACGKAgEA-wIAIYsCAQD7AgAhjAIBAPwCACGPAgAAxAOPAiICAAAAFQAgIQAA-wMAIAIAAAD3AwAgIQAA-AMAIBDkAQAA9gMAMOUBAAD3AwAQ5gEAAPYDADDnAQEA_AIAIe0BAADDA44CIvEBQAD_AgAh8gFAAIADACHzAUAAgAMAIYYCAQD7AgAhhwIBAPwCACGIAgEA-wIAIYkCAQD7AgAhigIBAPsCACGLAgEA-wIAIYwCAQD8AgAhjwIAAMQDjwIiEOQBAAD2AwAw5QEAAPcDABDmAQAA9gMAMOcBAQD8AgAh7QEAAMMDjgIi8QFAAP8CACHyAUAAgAMAIfMBQACAAwAhhgIBAPsCACGHAgEA_AIAIYgCAQD7AgAhiQIBAPsCACGKAgEA-wIAIYsCAQD7AgAhjAIBAPwCACGPAgAAxAOPAiIM5wEBANUDACHtAQAA-QOOAiLxAUAA2gMAIfIBQADbAwAh8wFAANsDACGGAgEA1wMAIYcCAQDVAwAhiAIBANcDACGJAgEA1wMAIYoCAQDXAwAhjAIBANUDACGPAgAA-gOPAiIBsgIAAACOAgIBsgIAAACPAgISBgAA_AMAIA4AAIEEACAVAAD9AwAgFgAA_gMAIBcAAP8DACAZAACABAAg5wEBANUDACHtAQAA-QOOAiLxAUAA2gMAIfIBQADbAwAh8wFAANsDACGGAgEA1wMAIYcCAQDVAwAhiAIBANcDACGJAgEA1wMAIYoCAQDXAwAhjAIBANUDACGPAgAA-gOPAiIFKAAA-AYAICkAAI4HACCvAgAA-QYAILACAACNBwAgtQIAACYAIAcoAADwBgAgKQAAiwcAIK8CAADxBgAgsAIAAIoHACCzAgAAEwAgtAIAABMAILUCAAAVACALKAAAjQQAMCkAAJEEADCvAgAAjgQAMLACAACPBAAwsQIAAJAEACCyAgAA8wMAMLMCAADzAwAwtAIAAPMDADC1AgAA8wMAMLYCAACSBAAwtwIAAPYDADAHKAAA9gYAICkAAIgHACCvAgAA9wYAILACAACHBwAgswIAAEIAILQCAABCACC1AgAAyQIAIAcoAADyBgAgKQAAhQcAIK8CAADzBgAgsAIAAIQHACCzAgAANQAgtAIAADUAILUCAAA3ACALKAAAggQAMCkAAIYEADCvAgAAgwQAMLACAACEBAAwsQIAAIUEACCyAgAA5QMAMLMCAADlAwAwtAIAAOUDADC1AgAA5QMAMLYCAACHBAAwtwIAAOgDADAHGwAAjAQAIOcBAQAAAAHxAUAAAAAB8gFAAAAAAfMBQAAAAAGnAgEAAAABqAIBAAAAAQIAAAABACAoAACLBAAgAwAAAAEAICgAAIsEACApAACJBAAgASEAAIMHADACAAAAAQAgIQAAiQQAIAIAAADpAwAgIQAAiAQAIAbnAQEA1QMAIfEBQADaAwAh8gFAANsDACHzAUAA2wMAIacCAQDVAwAhqAIBANUDACEHGwAAigQAIOcBAQDVAwAh8QFAANoDACHyAUAA2wMAIfMBQADbAwAhpwIBANUDACGoAgEA1QMAIQUoAAD-BgAgKQAAgQcAIK8CAAD_BgAgsAIAAIAHACC1AgAAyQIAIAcbAACMBAAg5wEBAAAAAfEBQAAAAAHyAUAAAAAB8wFAAAAAAacCAQAAAAGoAgEAAAABAygAAP4GACCvAgAA_wYAILUCAADJAgAgEgYAAJcEACAOAACcBAAgFgAAmAQAIBcAAJkEACAYAACaBAAgGQAAmwQAIOcBAQAAAAHtAQAAAI4CAvEBQAAAAAHyAUAAAAAB8wFAAAAAAYYCAQAAAAGHAgEAAAABiAIBAAAAAYoCAQAAAAGLAgEAAAABjAIBAAAAAY8CAAAAjwICAgAAABUAICgAAJYEACADAAAAFQAgKAAAlgQAICkAAJQEACABIQAA_QYAMAIAAAAVACAhAACUBAAgAgAAAPcDACAhAACTBAAgDOcBAQDVAwAh7QEAAPkDjgIi8QFAANoDACHyAUAA2wMAIfMBQADbAwAhhgIBANcDACGHAgEA1QMAIYgCAQDXAwAhigIBANcDACGLAgEA1wMAIYwCAQDVAwAhjwIAAPoDjwIiEgYAAPwDACAOAACBBAAgFgAA_gMAIBcAAP8DACAYAACVBAAgGQAAgAQAIOcBAQDVAwAh7QEAAPkDjgIi8QFAANoDACHyAUAA2wMAIfMBQADbAwAhhgIBANcDACGHAgEA1QMAIYgCAQDXAwAhigIBANcDACGLAgEA1wMAIYwCAQDVAwAhjwIAAPoDjwIiBygAAPQGACApAAD7BgAgrwIAAPUGACCwAgAA-gYAILMCAABCACC0AgAAQgAgtQIAAMkCACASBgAAlwQAIA4AAJwEACAWAACYBAAgFwAAmQQAIBgAAJoEACAZAACbBAAg5wEBAAAAAe0BAAAAjgIC8QFAAAAAAfIBQAAAAAHzAUAAAAABhgIBAAAAAYcCAQAAAAGIAgEAAAABigIBAAAAAYsCAQAAAAGMAgEAAAABjwIAAACPAgIDKAAA-AYAIK8CAAD5BgAgtQIAACYAIAQoAACNBAAwrwIAAI4EADCxAgAAkAQAILUCAADzAwAwAygAAPYGACCvAgAA9wYAILUCAADJAgAgAygAAPQGACCvAgAA9QYAILUCAADJAgAgAygAAPIGACCvAgAA8wYAILUCAAA3ACAEKAAAggQAMK8CAACDBAAwsQIAAIUEACC1AgAA5QMAMBIGAACXBAAgDgAAnAQAIBUAAJ4EACAWAACYBAAgFwAAmQQAIBkAAJsEACDnAQEAAAAB7QEAAACOAgLxAUAAAAAB8gFAAAAAAfMBQAAAAAGGAgEAAAABhwIBAAAAAYgCAQAAAAGJAgEAAAABigIBAAAAAYwCAQAAAAGPAgAAAI8CAgMoAADwBgAgrwIAAPEGACC1AgAAFQAgEgYAAJcEACAOAACcBAAgFQAAngQAIBYAAJgEACAYAACaBAAgGQAAmwQAIOcBAQAAAAHtAQAAAI4CAvEBQAAAAAHyAUAAAAAB8wFAAAAAAYYCAQAAAAGHAgEAAAABiAIBAAAAAYkCAQAAAAGLAgEAAAABjAIBAAAAAY8CAAAAjwICAgAAABUAICgAAKcEACADAAAAFQAgKAAApwQAICkAAKYEACABIQAA7wYAMAIAAAAVACAhAACmBAAgAgAAAPcDACAhAAClBAAgDOcBAQDVAwAh7QEAAPkDjgIi8QFAANoDACHyAUAA2wMAIfMBQADbAwAhhgIBANcDACGHAgEA1QMAIYgCAQDXAwAhiQIBANcDACGLAgEA1wMAIYwCAQDVAwAhjwIAAPoDjwIiEgYAAPwDACAOAACBBAAgFQAA_QMAIBYAAP4DACAYAACVBAAgGQAAgAQAIOcBAQDVAwAh7QEAAPkDjgIi8QFAANoDACHyAUAA2wMAIfMBQADbAwAhhgIBANcDACGHAgEA1QMAIYgCAQDXAwAhiQIBANcDACGLAgEA1wMAIYwCAQDVAwAhjwIAAPoDjwIiEgYAAJcEACAOAACcBAAgFQAAngQAIBYAAJgEACAYAACaBAAgGQAAmwQAIOcBAQAAAAHtAQAAAI4CAvEBQAAAAAHyAUAAAAAB8wFAAAAAAYYCAQAAAAGHAgEAAAABiAIBAAAAAYkCAQAAAAGLAgEAAAABjAIBAAAAAY8CAAAAjwICBAcAALUEACDyAUAAAAAB8wFAAAAAAYICAQAAAAECAAAACgAgKAAAtAQAIAMAAAAKACAoAAC0BAAgKQAAsgQAIAEhAADuBgAwCgcAAMoDACAKAADBAwAg5AEAAMwDADDlAQAACAAQ5gEAAMwDADDyAUAAgAMAIfMBQACAAwAhggIBAPwCACGDAgEA_AIAIasCAADLAwAgAgAAAAoAICEAALIEACACAAAAsAQAICEAALEEACAH5AEAAK8EADDlAQAAsAQAEOYBAACvBAAw8gFAAIADACHzAUAAgAMAIYICAQD8AgAhgwIBAPwCACEH5AEAAK8EADDlAQAAsAQAEOYBAACvBAAw8gFAAIADACHzAUAAgAMAIYICAQD8AgAhgwIBAPwCACED8gFAANsDACHzAUAA2wMAIYICAQDVAwAhBAcAALMEACDyAUAA2wMAIfMBQADbAwAhggIBANUDACEFKAAA6QYAICkAAOwGACCvAgAA6gYAILACAADrBgAgtQIAACIAIAQHAAC1BAAg8gFAAAAAAfMBQAAAAAGCAgEAAAABAygAAOkGACCvAgAA6gYAILUCAAAiACAHAwAAxQQAIOcBAQAAAAHtAQAAAKQCAvIBQAAAAAHzAUAAAAABhAIBAAAAAaICAAAAogICAgAAAAUAICgAAMQEACADAAAABQAgKAAAxAQAICkAAMIEACABIQAA6AYAMA0DAACfAwAgCgAAwQMAIOQBAADOAwAw5QEAAAMAEOYBAADOAwAw5wEBAAAAAe0BAADQA6QCIvIBQACAAwAh8wFAAIADACGDAgEA_AIAIYQCAQD8AgAhogIAAM8DogIirAIAAM0DACACAAAABQAgIQAAwgQAIAIAAAC-BAAgIQAAvwQAIArkAQAAvQQAMOUBAAC-BAAQ5gEAAL0EADDnAQEA_AIAIe0BAADQA6QCIvIBQACAAwAh8wFAAIADACGDAgEA_AIAIYQCAQD8AgAhogIAAM8DogIiCuQBAAC9BAAw5QEAAL4EABDmAQAAvQQAMOcBAQD8AgAh7QEAANADpAIi8gFAAIADACHzAUAAgAMAIYMCAQD8AgAhhAIBAPwCACGiAgAAzwOiAiIG5wEBANUDACHtAQAAwQSkAiLyAUAA2wMAIfMBQADbAwAhhAIBANUDACGiAgAAwASiAiIBsgIAAACiAgIBsgIAAACkAgIHAwAAwwQAIOcBAQDVAwAh7QEAAMEEpAIi8gFAANsDACHzAUAA2wMAIYQCAQDVAwAhogIAAMAEogIiBSgAAOMGACApAADmBgAgrwIAAOQGACCwAgAA5QYAILUCAABeACAHAwAAxQQAIOcBAQAAAAHtAQAAAKQCAvIBQAAAAAHzAUAAAAABhAIBAAAAAaICAAAAogICAygAAOMGACCvAgAA5AYAILUCAABeACAEKAAAtgQAMK8CAAC3BAAwsQIAALkEACC1AgAAugQAMAQoAACoBAAwrwIAAKkEADCxAgAAqwQAILUCAACsBAAwBCgAAJ8EADCvAgAAoAQAMLECAACiBAAgtQIAAPMDADAEKAAA7wMAMK8CAADwAwAwsQIAAPIDACC1AgAA8wMAMAQoAADhAwAwrwIAAOIDADCxAgAA5AMAILUCAADlAwAwAAAAAAAAAAUoAADeBgAgKQAA4QYAIK8CAADfBgAgsAIAAOAGACC1AgAAyQIAIAMoAADeBgAgrwIAAN8GACC1AgAAyQIAIAAAAAUoAADSBgAgKQAA3AYAIK8CAADTBgAgsAIAANsGACC1AgAAXgAgCygAAOgEADApAADsBAAwrwIAAOkEADCwAgAA6gQAMLECAADrBAAgsgIAAKwEADCzAgAArAQAMLQCAACsBAAwtQIAAKwEADC2AgAA7QQAMLcCAACvBAAwCygAANoEADApAADfBAAwrwIAANsEADCwAgAA3AQAMLECAADdBAAgsgIAAN4EADCzAgAA3gQAMLQCAADeBAAwtQIAAN4EADC2AgAA4AQAMLcCAADhBAAwAwYAAOcEACCHAgEAAAABoAJAAAAAAQIAAAAPACAoAADmBAAgAwAAAA8AICgAAOYEACApAADkBAAgASEAANoGADAJBgAAtgMAIAcAAMoDACDkAQAAyQMAMOUBAAANABDmAQAAyQMAMIICAQD8AgAhhwIBAPwCACGgAkAAgAMAIaoCAADIAwAgAgAAAA8AICEAAOQEACACAAAA4gQAICEAAOMEACAG5AEAAOEEADDlAQAA4gQAEOYBAADhBAAwggIBAPwCACGHAgEA_AIAIaACQACAAwAhBuQBAADhBAAw5QEAAOIEABDmAQAA4QQAMIICAQD8AgAhhwIBAPwCACGgAkAAgAMAIQKHAgEA1QMAIaACQADbAwAhAwYAAOUEACCHAgEA1QMAIaACQADbAwAhBSgAANUGACApAADYBgAgrwIAANYGACCwAgAA1wYAILUCAAAmACADBgAA5wQAIIcCAQAAAAGgAkAAAAABAygAANUGACCvAgAA1gYAILUCAAAmACAECgAA0wQAIPIBQAAAAAHzAUAAAAABgwIBAAAAAQIAAAAKACAoAADwBAAgAwAAAAoAICgAAPAEACApAADvBAAgASEAANQGADACAAAACgAgIQAA7wQAIAIAAACwBAAgIQAA7gQAIAPyAUAA2wMAIfMBQADbAwAhgwIBANUDACEECgAA0gQAIPIBQADbAwAh8wFAANsDACGDAgEA1QMAIQQKAADTBAAg8gFAAAAAAfMBQAAAAAGDAgEAAAABAygAANIGACCvAgAA0wYAILUCAABeACAEKAAA6AQAMK8CAADpBAAwsQIAAOsEACC1AgAArAQAMAQoAADaBAAwrwIAANsEADCxAgAA3QQAILUCAADeBAAwAAAAAAAAAAABsgIAAACSAgIFsgIQAAAAAbgCEAAAAAG5AhAAAAABugIQAAAAAbsCEAAAAAEBsgIAAACXAgIFKAAAygYAICkAANAGACCvAgAAywYAILACAADPBgAgtQIAAF4AIAcoAADIBgAgKQAAzQYAIK8CAADJBgAgsAIAAMwGACCzAgAAKAAgtAIAACgAILUCAADPAQAgAygAAMoGACCvAgAAywYAILUCAABeACADKAAAyAYAIK8CAADJBgAgtQIAAM8BACAAAAABsgIAAACaAgIFKAAAwgYAICkAAMYGACCvAgAAwwYAILACAADFBgAgtQIAAF4AIAsoAACJBQAwKQAAjgUAMK8CAACKBQAwsAIAAIsFADCxAgAAjAUAILICAACNBQAwswIAAI0FADC0AgAAjQUAMLUCAACNBQAwtgIAAI8FADC3AgAAkAUAMAsDAACBBQAg5wEBAAAAAe0BAAAAlwIC8gFAAAAAAfMBQAAAAAGEAgEAAAABkgIAAACSAgKTAgEAAAABlAIQAAAAAZUCAQAAAAGXAgEAAAABAgAAACwAICgAAJQFACADAAAALAAgKAAAlAUAICkAAJMFACABIQAAxAYAMBADAACfAwAgEAAAsgMAIOQBAAC3AwAw5QEAACoAEOYBAAC3AwAw5wEBAAAAAe0BAAC5A5cCIvIBQACAAwAh8wFAAIADACGEAgEA_AIAIZACAQD7AgAhkgIAAJ4DkgIikwIBAAAAAZQCEAC4AwAhlQIBAPwCACGXAgEA-wIAIQIAAAAsACAhAACTBQAgAgAAAJEFACAhAACSBQAgDuQBAACQBQAw5QEAAJEFABDmAQAAkAUAMOcBAQD8AgAh7QEAALkDlwIi8gFAAIADACHzAUAAgAMAIYQCAQD8AgAhkAIBAPsCACGSAgAAngOSAiKTAgEA_AIAIZQCEAC4AwAhlQIBAPwCACGXAgEA-wIAIQ7kAQAAkAUAMOUBAACRBQAQ5gEAAJAFADDnAQEA_AIAIe0BAAC5A5cCIvIBQACAAwAh8wFAAIADACGEAgEA_AIAIZACAQD7AgAhkgIAAJ4DkgIikwIBAPwCACGUAhAAuAMAIZUCAQD8AgAhlwIBAPsCACEK5wEBANUDACHtAQAA_gSXAiLyAUAA2wMAIfMBQADbAwAhhAIBANUDACGSAgAA_ASSAiKTAgEA1QMAIZQCEAD9BAAhlQIBANUDACGXAgEA1wMAIQsDAAD_BAAg5wEBANUDACHtAQAA_gSXAiLyAUAA2wMAIfMBQADbAwAhhAIBANUDACGSAgAA_ASSAiKTAgEA1QMAIZQCEAD9BAAhlQIBANUDACGXAgEA1wMAIQsDAACBBQAg5wEBAAAAAe0BAAAAlwIC8gFAAAAAAfMBQAAAAAGEAgEAAAABkgIAAACSAgKTAgEAAAABlAIQAAAAAZUCAQAAAAGXAgEAAAABAygAAMIGACCvAgAAwwYAILUCAABeACAEKAAAiQUAMK8CAACKBQAwsQIAAIwFACC1AgAAjQUAMAcEAADLBAAgCAAAmgYAIA8AAJkGACARAACYBQAgEgAAmwYAIPEBAADRAwAgpQIAANEDACAAAAAAAbICAAAAngICBSgAALwGACApAADABgAgrwIAAL0GACCwAgAAvwYAILUCAAAmACALKAAAnwUAMCkAAKMFADCvAgAAoAUAMLACAAChBQAwsQIAAKIFACCyAgAA8wMAMLMCAADzAwAwtAIAAPMDADC1AgAA8wMAMLYCAACkBQAwtwIAAPYDADASBgAAlwQAIA4AAJwEACAVAACeBAAgFgAAmAQAIBcAAJkEACAYAACaBAAg5wEBAAAAAe0BAAAAjgIC8QFAAAAAAfIBQAAAAAHzAUAAAAABhgIBAAAAAYcCAQAAAAGJAgEAAAABigIBAAAAAYsCAQAAAAGMAgEAAAABjwIAAACPAgICAAAAFQAgKAAApwUAIAMAAAAVACAoAACnBQAgKQAApgUAIAEhAAC-BgAwAgAAABUAICEAAKYFACACAAAA9wMAICEAAKUFACAM5wEBANUDACHtAQAA-QOOAiLxAUAA2gMAIfIBQADbAwAh8wFAANsDACGGAgEA1wMAIYcCAQDVAwAhiQIBANcDACGKAgEA1wMAIYsCAQDXAwAhjAIBANUDACGPAgAA-gOPAiISBgAA_AMAIA4AAIEEACAVAAD9AwAgFgAA_gMAIBcAAP8DACAYAACVBAAg5wEBANUDACHtAQAA-QOOAiLxAUAA2gMAIfIBQADbAwAh8wFAANsDACGGAgEA1wMAIYcCAQDVAwAhiQIBANcDACGKAgEA1wMAIYsCAQDXAwAhjAIBANUDACGPAgAA-gOPAiISBgAAlwQAIA4AAJwEACAVAACeBAAgFgAAmAQAIBcAAJkEACAYAACaBAAg5wEBAAAAAe0BAAAAjgIC8QFAAAAAAfIBQAAAAAHzAUAAAAABhgIBAAAAAYcCAQAAAAGJAgEAAAABigIBAAAAAYsCAQAAAAGMAgEAAAABjwIAAACPAgIDKAAAvAYAIK8CAAC9BgAgtQIAACYAIAQoAACfBQAwrwIAAKAFADCxAgAAogUAILUCAADzAwAwAAAABSgAALcGACApAAC6BgAgrwIAALgGACCwAgAAuQYAILUCAAAiACADKAAAtwYAIK8CAAC4BgAgtQIAACIAIAAAAAUoAACvBgAgKQAAtQYAIK8CAACwBgAgsAIAALQGACC1AgAAXgAgCygAAMgFADApAADNBQAwrwIAAMkFADCwAgAAygUAMLECAADLBQAgsgIAAMwFADCzAgAAzAUAMLQCAADMBQAwtQIAAMwFADC2AgAAzgUAMLcCAADPBQAwCygAAL8FADApAADDBQAwrwIAAMAFADCwAgAAwQUAMLECAADCBQAgsgIAAN4EADCzAgAA3gQAMLQCAADeBAAwtQIAAN4EADC2AgAAxAUAMLcCAADhBAAwCygAALYFADApAAC6BQAwrwIAALcFADCwAgAAuAUAMLECAAC5BQAgsgIAAPMDADCzAgAA8wMAMLQCAADzAwAwtQIAAPMDADC2AgAAuwUAMLcCAAD2AwAwEg4AAJwEACAVAACeBAAgFgAAmAQAIBcAAJkEACAYAACaBAAgGQAAmwQAIOcBAQAAAAHtAQAAAI4CAvEBQAAAAAHyAUAAAAAB8wFAAAAAAYYCAQAAAAGIAgEAAAABiQIBAAAAAYoCAQAAAAGLAgEAAAABjAIBAAAAAY8CAAAAjwICAgAAABUAICgAAL4FACADAAAAFQAgKAAAvgUAICkAAL0FACABIQAAswYAMAIAAAAVACAhAAC9BQAgAgAAAPcDACAhAAC8BQAgDOcBAQDVAwAh7QEAAPkDjgIi8QFAANoDACHyAUAA2wMAIfMBQADbAwAhhgIBANcDACGIAgEA1wMAIYkCAQDXAwAhigIBANcDACGLAgEA1wMAIYwCAQDVAwAhjwIAAPoDjwIiEg4AAIEEACAVAAD9AwAgFgAA_gMAIBcAAP8DACAYAACVBAAgGQAAgAQAIOcBAQDVAwAh7QEAAPkDjgIi8QFAANoDACHyAUAA2wMAIfMBQADbAwAhhgIBANcDACGIAgEA1wMAIYkCAQDXAwAhigIBANcDACGLAgEA1wMAIYwCAQDVAwAhjwIAAPoDjwIiEg4AAJwEACAVAACeBAAgFgAAmAQAIBcAAJkEACAYAACaBAAgGQAAmwQAIOcBAQAAAAHtAQAAAI4CAvEBQAAAAAHyAUAAAAAB8wFAAAAAAYYCAQAAAAGIAgEAAAABiQIBAAAAAYoCAQAAAAGLAgEAAAABjAIBAAAAAY8CAAAAjwICAwcAAK4FACCCAgEAAAABoAJAAAAAAQIAAAAPACAoAADHBQAgAwAAAA8AICgAAMcFACApAADGBQAgASEAALIGADACAAAADwAgIQAAxgUAIAIAAADiBAAgIQAAxQUAIAKCAgEA1QMAIaACQADbAwAhAwcAAK0FACCCAgEA1QMAIaACQADbAwAhAwcAAK4FACCCAgEAAAABoAJAAAAAAQoTAACpBQAg5wEBAAAAAe0BAAAAngIC8QFAAAAAAfIBQAAAAAHzAUAAAAABhQIBAAAAAZwCAQAAAAGeAkAAAAABnwJAAAAAAQIAAAA3ACAoAADTBQAgAwAAADcAICgAANMFACApAADSBQAgASEAALEGADAPBgAAtgMAIBMAAIMDACDkAQAAtAMAMOUBAAA1ABDmAQAAtAMAMOcBAQAAAAHtAQAAtQOeAiLxAUAA_wIAIfIBQACAAwAh8wFAAIADACGFAgEA_AIAIYcCAQD8AgAhnAIBAPsCACGeAkAA_wIAIZ8CQAD_AgAhAgAAADcAICEAANIFACACAAAA0AUAICEAANEFACAN5AEAAM8FADDlAQAA0AUAEOYBAADPBQAw5wEBAPwCACHtAQAAtQOeAiLxAUAA_wIAIfIBQACAAwAh8wFAAIADACGFAgEA_AIAIYcCAQD8AgAhnAIBAPsCACGeAkAA_wIAIZ8CQAD_AgAhDeQBAADPBQAw5QEAANAFABDmAQAAzwUAMOcBAQD8AgAh7QEAALUDngIi8QFAAP8CACHyAUAAgAMAIfMBQACAAwAhhQIBAPwCACGHAgEA_AIAIZwCAQD7AgAhngJAAP8CACGfAkAA_wIAIQnnAQEA1QMAIe0BAACcBZ4CIvEBQADaAwAh8gFAANsDACHzAUAA2wMAIYUCAQDVAwAhnAIBANcDACGeAkAA2gMAIZ8CQADaAwAhChMAAJ4FACDnAQEA1QMAIe0BAACcBZ4CIvEBQADaAwAh8gFAANsDACHzAUAA2wMAIYUCAQDVAwAhnAIBANcDACGeAkAA2gMAIZ8CQADaAwAhChMAAKkFACDnAQEAAAAB7QEAAACeAgLxAUAAAAAB8gFAAAAAAfMBQAAAAAGFAgEAAAABnAIBAAAAAZ4CQAAAAAGfAkAAAAABAygAAK8GACCvAgAAsAYAILUCAABeACAEKAAAyAUAMK8CAADJBQAwsQIAAMsFACC1AgAAzAUAMAQoAAC_BQAwrwIAAMAFADCxAgAAwgUAILUCAADeBAAwBCgAALYFADCvAgAAtwUAMLECAAC5BQAgtQIAAPMDADAAAAAFKAAAqgYAICkAAK0GACCvAgAAqwYAILACAACsBgAgtQIAAMkCACADKAAAqgYAIK8CAACrBgAgtQIAAMkCACAAAAALKAAAiwYAMCkAAI8GADCvAgAAjAYAMLACAACNBgAwsQIAAI4GACCyAgAAugQAMLMCAAC6BAAwtAIAALoEADC1AgAAugQAMLYCAACQBgAwtwIAAL0EADALKAAA_wUAMCkAAIQGADCvAgAAgAYAMLACAACBBgAwsQIAAIIGACCyAgAAgwYAMLMCAACDBgAwtAIAAIMGADC1AgAAgwYAMLYCAACFBgAwtwIAAIYGADALKAAA8wUAMCkAAPgFADCvAgAA9AUAMLACAAD1BQAwsQIAAPYFACCyAgAA9wUAMLMCAAD3BQAwtAIAAPcFADC1AgAA9wUAMLYCAAD5BQAwtwIAAPoFADAHKAAA7gUAICkAAPEFACCvAgAA7wUAILACAADwBQAgswIAACgAILQCAAAoACC1AgAAzwEAIAsoAADlBQAwKQAA6QUAMK8CAADmBQAwsAIAAOcFADCxAgAA6AUAILICAACNBQAwswIAAI0FADC0AgAAjQUAMLUCAACNBQAwtgIAAOoFADC3AgAAkAUAMAsQAACCBQAg5wEBAAAAAe0BAAAAlwIC8gFAAAAAAfMBQAAAAAGQAgEAAAABkgIAAACSAgKTAgEAAAABlAIQAAAAAZUCAQAAAAGXAgEAAAABAgAAACwAICgAAO0FACADAAAALAAgKAAA7QUAICkAAOwFACABIQAAqQYAMAIAAAAsACAhAADsBQAgAgAAAJEFACAhAADrBQAgCucBAQDVAwAh7QEAAP4ElwIi8gFAANsDACHzAUAA2wMAIZACAQDXAwAhkgIAAPwEkgIikwIBANUDACGUAhAA_QQAIZUCAQDVAwAhlwIBANcDACELEAAAgAUAIOcBAQDVAwAh7QEAAP4ElwIi8gFAANsDACHzAUAA2wMAIZACAQDXAwAhkgIAAPwEkgIikwIBANUDACGUAhAA_QQAIZUCAQDVAwAhlwIBANcDACELEAAAggUAIOcBAQAAAAHtAQAAAJcCAvIBQAAAAAHzAUAAAAABkAIBAAAAAZICAAAAkgICkwIBAAAAAZQCEAAAAAGVAgEAAAABlwIBAAAAAQoRAACWBQAg5wEBAAAAAe0BAAAAmgIC8gFAAAAAAfMBQAAAAAGQAgEAAAABkgIAAACSAgKYAgEAAAABmgJAAAAAAZsCQAAAAAECAAAAzwEAICgAAO4FACADAAAAKAAgKAAA7gUAICkAAPIFACAMAAAAKAAgEQAAiAUAICEAAPIFACDnAQEA1QMAIe0BAACGBZoCIvIBQADbAwAh8wFAANsDACGQAgEA1wMAIZICAAD8BJICIpgCAQDVAwAhmgJAANoDACGbAkAA2gMAIQoRAACIBQAg5wEBANUDACHtAQAAhgWaAiLyAUAA2wMAIfMBQADbAwAhkAIBANcDACGSAgAA_ASSAiKYAgEA1QMAIZoCQADaAwAhmwJAANoDACEKDwAA1gUAIBMAANcFACAUAADVBQAg5wEBAAAAAe0BAQAAAAHxAUAAAAAB8gFAAAAAAfMBQAAAAAGFAgEAAAABhgIBAAAAAQIAAAAmACAoAAD-BQAgAwAAACYAICgAAP4FACApAAD9BQAgASEAAKgGADAPAwAAnwMAIA8AALwDACATAACDAwAgFAAAuwMAIOQBAAC6AwAw5QEAACQAEOYBAAC6AwAw5wEBAAAAAe0BAQD8AgAh8QFAAP8CACHyAUAAgAMAIfMBQACAAwAhhAIBAPwCACGFAgEA_AIAIYYCAQD7AgAhAgAAACYAICEAAP0FACACAAAA-wUAICEAAPwFACAL5AEAAPoFADDlAQAA-wUAEOYBAAD6BQAw5wEBAPwCACHtAQEA_AIAIfEBQAD_AgAh8gFAAIADACHzAUAAgAMAIYQCAQD8AgAhhQIBAPwCACGGAgEA-wIAIQvkAQAA-gUAMOUBAAD7BQAQ5gEAAPoFADDnAQEA_AIAIe0BAQD8AgAh8QFAAP8CACHyAUAAgAMAIfMBQACAAwAhhAIBAPwCACGFAgEA_AIAIYYCAQD7AgAhB-cBAQDVAwAh7QEBANUDACHxAUAA2gMAIfIBQADbAwAh8wFAANsDACGFAgEA1QMAIYYCAQDXAwAhCg8AALQFACATAAC1BQAgFAAAswUAIOcBAQDVAwAh7QEBANUDACHxAUAA2gMAIfIBQADbAwAh8wFAANsDACGFAgEA1QMAIYYCAQDXAwAhCg8AANYFACATAADXBQAgFAAA1QUAIOcBAQAAAAHtAQEAAAAB8QFAAAAAAfIBQAAAAAHzAUAAAAABhQIBAAAAAYYCAQAAAAEIBQAA8gQAIAgAAPMEACDnAQEAAAAB8QFAAAAAAfIBQAAAAAHzAUAAAAABhQIBAAAAAYYCAQAAAAECAAAAIgAgKAAAigYAIAMAAAAiACAoAACKBgAgKQAAiQYAIAEhAACnBgAwDgMAAJ8DACAFAACCAwAgCAAAvAMAIOQBAAC-AwAw5QEAACAAEOYBAAC-AwAw5wEBAAAAAfEBQAD_AgAh8gFAAIADACHzAUAAgAMAIYQCAQD8AgAhhQIBAPwCACGGAgEA-wIAIakCAAC9AwAgAgAAACIAICEAAIkGACACAAAAhwYAICEAAIgGACAK5AEAAIYGADDlAQAAhwYAEOYBAACGBgAw5wEBAPwCACHxAUAA_wIAIfIBQACAAwAh8wFAAIADACGEAgEA_AIAIYUCAQD8AgAhhgIBAPsCACEK5AEAAIYGADDlAQAAhwYAEOYBAACGBgAw5wEBAPwCACHxAUAA_wIAIfIBQACAAwAh8wFAAIADACGEAgEA_AIAIYUCAQD8AgAhhgIBAPsCACEG5wEBANUDACHxAUAA2gMAIfIBQADbAwAh8wFAANsDACGFAgEA1QMAIYYCAQDXAwAhCAUAANgEACAIAADZBAAg5wEBANUDACHxAUAA2gMAIfIBQADbAwAh8wFAANsDACGFAgEA1QMAIYYCAQDXAwAhCAUAAPIEACAIAADzBAAg5wEBAAAAAfEBQAAAAAHyAUAAAAAB8wFAAAAAAYUCAQAAAAGGAgEAAAABBwoAANwFACDnAQEAAAAB7QEAAACkAgLyAUAAAAAB8wFAAAAAAYMCAQAAAAGiAgAAAKICAgIAAAAFACAoAACTBgAgAwAAAAUAICgAAJMGACApAACSBgAgASEAAKYGADACAAAABQAgIQAAkgYAIAIAAAC-BAAgIQAAkQYAIAbnAQEA1QMAIe0BAADBBKQCIvIBQADbAwAh8wFAANsDACGDAgEA1QMAIaICAADABKICIgcKAADbBQAg5wEBANUDACHtAQAAwQSkAiLyAUAA2wMAIfMBQADbAwAhgwIBANUDACGiAgAAwASiAiIHCgAA3AUAIOcBAQAAAAHtAQAAAKQCAvIBQAAAAAHzAUAAAAABgwIBAAAAAaICAAAAogICBCgAAIsGADCvAgAAjAYAMLECAACOBgAgtQIAALoEADAEKAAA_wUAMK8CAACABgAwsQIAAIIGACC1AgAAgwYAMAQoAADzBQAwrwIAAPQFADCxAgAA9gUAILUCAAD3BQAwAygAAO4FACCvAgAA7wUAILUCAADPAQAgBCgAAOUFADCvAgAA5gUAMLECAADoBQAgtQIAAI0FADAAAAUDAACXBQAgEQAAmAUAIJACAADRAwAgmgIAANEDACCbAgAA0QMAIAAAAAYDAACXBQAgDwAAoQYAIBMAAM0EACAUAACgBgAg8QEAANEDACCGAgAA0QMAIAAADQYAAJ8GACAOAADOBAAgFQAAogYAIBYAAM0EACAXAACjBgAgGAAAowYAIBkAAKQGACDxAQAA0QMAIIYCAADRAwAgiAIAANEDACCJAgAA0QMAIIoCAADRAwAgiwIAANEDACAIBAAAywQAIAsAAMwEACAMAADNBAAgDQAAzQQAIA4AAM4EACDqAQAA0QMAIPABAADRAwAg8QEAANEDACAGBgAAnwYAIBMAAM0EACDxAQAA0QMAIJwCAADRAwAgngIAANEDACCfAgAA0QMAIAUDAACXBQAgBQAAzAQAIAgAAKEGACDxAQAA0QMAIIYCAADRAwAgBucBAQAAAAHtAQAAAKQCAvIBQAAAAAHzAUAAAAABgwIBAAAAAaICAAAAogICBucBAQAAAAHxAUAAAAAB8gFAAAAAAfMBQAAAAAGFAgEAAAABhgIBAAAAAQfnAQEAAAAB7QEBAAAAAfEBQAAAAAHyAUAAAAAB8wFAAAAAAYUCAQAAAAGGAgEAAAABCucBAQAAAAHtAQAAAJcCAvIBQAAAAAHzAUAAAAABkAIBAAAAAZICAAAAkgICkwIBAAAAAZQCEAAAAAGVAgEAAAABlwIBAAAAAQ8LAADHBAAgDAAAyAQAIA0AAMkEACAOAADKBAAg5wEBAAAAAegBAQAAAAHpASAAAAAB6gEBAAAAAesBAQAAAAHtAQAAAO0BAu8BAAAA7wEC8AEBAAAAAfEBQAAAAAHyAUAAAAAB8wFAAAAAAQIAAADJAgAgKAAAqgYAIAMAAABCACAoAACqBgAgKQAArgYAIBEAAABCACALAADdAwAgDAAA3gMAIA0AAN8DACAOAADgAwAgIQAArgYAIOcBAQDVAwAh6AEBANUDACHpASAA1gMAIeoBAQDXAwAh6wEBANUDACHtAQAA2APtASLvAQAA2QPvASLwAQEA1wMAIfEBQADaAwAh8gFAANsDACHzAUAA2wMAIQ8LAADdAwAgDAAA3gMAIA0AAN8DACAOAADgAwAg5wEBANUDACHoAQEA1QMAIekBIADWAwAh6gEBANcDACHrAQEA1QMAIe0BAADYA-0BIu8BAADZA-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-0BIu8BAADZA-8BIvABAQDXAwAh8QFAANoDACHyAUAA2wMAIfMBQADbAwAhCwgAAJYGACAPAACVBgAgEQAAmAYAIBIAAJcGACDnAQEAAAAB8QFAAAAAAfIBQAAAAAHzAUAAAAABhQIBAAAAAaQCAQAAAAGlAgEAAAABAgAAAF4AICgAAOMGACADAAAAYQAgKAAA4wYAICkAAOcGACANAAAAYQAgCAAA4gUAIA8AAOEFACARAADkBQAgEgAA4wUAICEAAOcGACDnAQEA1QMAIfEBQADaAwAh8gFAANsDACHzAUAA2wMAIYUCAQDVAwAhpAIBANUDACGlAgEA1wMAIQsIAADiBQAgDwAA4QUAIBEAAOQFACASAADjBQAg5wEBANUDACHxAUAA2gMAIfIBQADbAwAh8wFAANsDACGFAgEA1QMAIaQCAQDVAwAhpQIBANcDACEG5wEBAAAAAe0BAAAApAIC8gFAAAAAAfMBQAAAAAGEAgEAAAABogIAAACiAgIJAwAA8QQAIAgAAPMEACDnAQEAAAAB8QFAAAAAAfIBQAAAAAHzAUAAAAABhAIBAAAAAYUCAQAAAAGGAgEAAAABAgAAACIAICgAAOkGACADAAAAIAAgKAAA6QYAICkAAO0GACALAAAAIAAgAwAA1wQAIAgAANkEACAhAADtBgAg5wEBANUDACHxAUAA2gMAIfIBQADbAwAh8wFAANsDACGEAgEA1QMAIYUCAQDVAwAhhgIBANcDACEJAwAA1wQAIAgAANkEACDnAQEA1QMAIfEBQADaAwAh8gFAANsDACHzAUAA2wMAIYQCAQDVAwAhhQIBANUDACGGAgEA1wMAIQPyAUAAAAAB8wFAAAAAAYICAQAAAAEM5wEBAAAAAe0BAAAAjgIC8QFAAAAAAfIBQAAAAAHzAUAAAAABhgIBAAAAAYcCAQAAAAGIAgEAAAABiQIBAAAAAYsCAQAAAAGMAgEAAAABjwIAAACPAgITBgAAlwQAIA4AAJwEACAVAACeBAAgFwAAmQQAIBgAAJoEACAZAACbBAAg5wEBAAAAAe0BAAAAjgIC8QFAAAAAAfIBQAAAAAHzAUAAAAABhgIBAAAAAYcCAQAAAAGIAgEAAAABiQIBAAAAAYoCAQAAAAGLAgEAAAABjAIBAAAAAY8CAAAAjwICAgAAABUAICgAAPAGACALBgAAqAUAIOcBAQAAAAHtAQAAAJ4CAvEBQAAAAAHyAUAAAAAB8wFAAAAAAYUCAQAAAAGHAgEAAAABnAIBAAAAAZ4CQAAAAAGfAkAAAAABAgAAADcAICgAAPIGACAPBAAAxgQAIAsAAMcEACAMAADIBAAgDgAAygQAIOcBAQAAAAHoAQEAAAAB6QEgAAAAAeoBAQAAAAHrAQEAAAAB7QEAAADtAQLvAQAAAO8BAvABAQAAAAHxAUAAAAAB8gFAAAAAAfMBQAAAAAECAAAAyQIAICgAAPQGACAPBAAAxgQAIAsAAMcEACANAADJBAAgDgAAygQAIOcBAQAAAAHoAQEAAAAB6QEgAAAAAeoBAQAAAAHrAQEAAAAB7QEAAADtAQLvAQAAAO8BAvABAQAAAAHxAUAAAAAB8gFAAAAAAfMBQAAAAAECAAAAyQIAICgAAPYGACALAwAA1AUAIA8AANYFACAUAADVBQAg5wEBAAAAAe0BAQAAAAHxAUAAAAAB8gFAAAAAAfMBQAAAAAGEAgEAAAABhQIBAAAAAYYCAQAAAAECAAAAJgAgKAAA-AYAIAMAAABCACAoAAD0BgAgKQAA_AYAIBEAAABCACAEAADcAwAgCwAA3QMAIAwAAN4DACAOAADgAwAgIQAA_AYAIOcBAQDVAwAh6AEBANUDACHpASAA1gMAIeoBAQDXAwAh6wEBANUDACHtAQAA2APtASLvAQAA2QPvASLwAQEA1wMAIfEBQADaAwAh8gFAANsDACHzAUAA2wMAIQ8EAADcAwAgCwAA3QMAIAwAAN4DACAOAADgAwAg5wEBANUDACHoAQEA1QMAIekBIADWAwAh6gEBANcDACHrAQEA1QMAIe0BAADYA-0BIu8BAADZA-8BIvABAQDXAwAh8QFAANoDACHyAUAA2wMAIfMBQADbAwAhDOcBAQAAAAHtAQAAAI4CAvEBQAAAAAHyAUAAAAAB8wFAAAAAAYYCAQAAAAGHAgEAAAABiAIBAAAAAYoCAQAAAAGLAgEAAAABjAIBAAAAAY8CAAAAjwICDwQAAMYEACALAADHBAAgDAAAyAQAIA0AAMkEACDnAQEAAAAB6AEBAAAAAekBIAAAAAHqAQEAAAAB6wEBAAAAAe0BAAAA7QEC7wEAAADvAQLwAQEAAAAB8QFAAAAAAfIBQAAAAAHzAUAAAAABAgAAAMkCACAoAAD-BgAgAwAAAEIAICgAAP4GACApAACCBwAgEQAAAEIAIAQAANwDACALAADdAwAgDAAA3gMAIA0AAN8DACAhAACCBwAg5wEBANUDACHoAQEA1QMAIekBIADWAwAh6gEBANcDACHrAQEA1QMAIe0BAADYA-0BIu8BAADZA-8BIvABAQDXAwAh8QFAANoDACHyAUAA2wMAIfMBQADbAwAhDwQAANwDACALAADdAwAgDAAA3gMAIA0AAN8DACDnAQEA1QMAIegBAQDVAwAh6QEgANYDACHqAQEA1wMAIesBAQDVAwAh7QEAANgD7QEi7wEAANkD7wEi8AEBANcDACHxAUAA2gMAIfIBQADbAwAh8wFAANsDACEG5wEBAAAAAfEBQAAAAAHyAUAAAAAB8wFAAAAAAacCAQAAAAGoAgEAAAABAwAAADUAICgAAPIGACApAACGBwAgDQAAADUAIAYAAJ0FACAhAACGBwAg5wEBANUDACHtAQAAnAWeAiLxAUAA2gMAIfIBQADbAwAh8wFAANsDACGFAgEA1QMAIYcCAQDVAwAhnAIBANcDACGeAkAA2gMAIZ8CQADaAwAhCwYAAJ0FACDnAQEA1QMAIe0BAACcBZ4CIvEBQADaAwAh8gFAANsDACHzAUAA2wMAIYUCAQDVAwAhhwIBANUDACGcAgEA1wMAIZ4CQADaAwAhnwJAANoDACEDAAAAQgAgKAAA9gYAICkAAIkHACARAAAAQgAgBAAA3AMAIAsAAN0DACANAADfAwAgDgAA4AMAICEAAIkHACDnAQEA1QMAIegBAQDVAwAh6QEgANYDACHqAQEA1wMAIesBAQDVAwAh7QEAANgD7QEi7wEAANkD7wEi8AEBANcDACHxAUAA2gMAIfIBQADbAwAh8wFAANsDACEPBAAA3AMAIAsAAN0DACANAADfAwAgDgAA4AMAIOcBAQDVAwAh6AEBANUDACHpASAA1gMAIeoBAQDXAwAh6wEBANUDACHtAQAA2APtASLvAQAA2QPvASLwAQEA1wMAIfEBQADaAwAh8gFAANsDACHzAUAA2wMAIQMAAAATACAoAADwBgAgKQAAjAcAIBUAAAATACAGAAD8AwAgDgAAgQQAIBUAAP0DACAXAAD_AwAgGAAAlQQAIBkAAIAEACAhAACMBwAg5wEBANUDACHtAQAA-QOOAiLxAUAA2gMAIfIBQADbAwAh8wFAANsDACGGAgEA1wMAIYcCAQDVAwAhiAIBANcDACGJAgEA1wMAIYoCAQDXAwAhiwIBANcDACGMAgEA1QMAIY8CAAD6A48CIhMGAAD8AwAgDgAAgQQAIBUAAP0DACAXAAD_AwAgGAAAlQQAIBkAAIAEACDnAQEA1QMAIe0BAAD5A44CIvEBQADaAwAh8gFAANsDACHzAUAA2wMAIYYCAQDXAwAhhwIBANUDACGIAgEA1wMAIYkCAQDXAwAhigIBANcDACGLAgEA1wMAIYwCAQDVAwAhjwIAAPoDjwIiAwAAACQAICgAAPgGACApAACPBwAgDQAAACQAIAMAALIFACAPAAC0BQAgFAAAswUAICEAAI8HACDnAQEA1QMAIe0BAQDVAwAh8QFAANoDACHyAUAA2wMAIfMBQADbAwAhhAIBANUDACGFAgEA1QMAIYYCAQDXAwAhCwMAALIFACAPAAC0BQAgFAAAswUAIOcBAQDVAwAh7QEBANUDACHxAUAA2gMAIfIBQADbAwAh8wFAANsDACGEAgEA1QMAIYUCAQDVAwAhhgIBANcDACEM5wEBAAAAAe0BAAAAjgIC8QFAAAAAAfIBQAAAAAHzAUAAAAABhgIBAAAAAYcCAQAAAAGIAgEAAAABiQIBAAAAAYoCAQAAAAGMAgEAAAABjwIAAACPAgITBgAAlwQAIBUAAJ4EACAWAACYBAAgFwAAmQQAIBgAAJoEACAZAACbBAAg5wEBAAAAAe0BAAAAjgIC8QFAAAAAAfIBQAAAAAHzAUAAAAABhgIBAAAAAYcCAQAAAAGIAgEAAAABiQIBAAAAAYoCAQAAAAGLAgEAAAABjAIBAAAAAY8CAAAAjwICAgAAABUAICgAAJEHACADAAAAEwAgKAAAkQcAICkAAJUHACAVAAAAEwAgBgAA_AMAIBUAAP0DACAWAAD-AwAgFwAA_wMAIBgAAJUEACAZAACABAAgIQAAlQcAIOcBAQDVAwAh7QEAAPkDjgIi8QFAANoDACHyAUAA2wMAIfMBQADbAwAhhgIBANcDACGHAgEA1QMAIYgCAQDXAwAhiQIBANcDACGKAgEA1wMAIYsCAQDXAwAhjAIBANUDACGPAgAA-gOPAiITBgAA_AMAIBUAAP0DACAWAAD-AwAgFwAA_wMAIBgAAJUEACAZAACABAAg5wEBANUDACHtAQAA-QOOAiLxAUAA2gMAIfIBQADbAwAh8wFAANsDACGGAgEA1wMAIYcCAQDVAwAhiAIBANcDACGJAgEA1wMAIYoCAQDXAwAhiwIBANcDACGMAgEA1QMAIY8CAAD6A48CIgbnAQEAAAAB8QFAAAAAAfIBQAAAAAHzAUAAAAABpgIBAAAAAagCAQAAAAECGgACGwAGCAYAAwkAEw5GARVAAhZBAhdDBhhEBhlFEAUDAAQJABIPOwkTPAIUOBAGBAYFCCcDCQAPDyMIETANEikMAgMABAoABgYEBwUJAAsLCwcMFgINFwIOGgECBwAICgAGBAMABAUMBwgQCQkACgIGAAMHAAgCBREACBIABQQbAAscAAwdAA0eAA4fAAMDAAQJAA4RLQ0CAwAEEC4MAREvAAQEMQAIMwAPMgARNAADBgADCQAREzkCARM6AAMPPgATPwAUPQACDkgAFkcAAAIaAAIbAAYCGgACGwAGAwkAGC4AGS8AGgAAAAMJABguABkvABoAAAMJAB8uACAvACEAAAADCQAfLgAgLwAhAgMABAoABgIDAAQKAAYDCQAmLgAnLwAoAAAAAwkAJi4AJy8AKAEDAAQBAwAEAwkALS4ALi8ALwAAAAMJAC0uAC4vAC8CBgADBwAIAgYAAwcACAMJADQuADUvADYAAAADCQA0LgA1LwA2AQYAAwEGAAMDCQA7LgA8LwA9AAAAAwkAOy4APC8APQEDAAQBAwAEAwkAQi4AQy8ARAAAAAMJAEIuAEMvAEQCAwAEEPEBDAIDAAQQ9wEMBQkASS4ATC8ATaABAEqhAQBLAAAAAAAFCQBJLgBMLwBNoAEASqEBAEsFBgADFYkCAheKAgYYiwIGGYwCEAUGAAMVkgICF5MCBhiUAgYZlQIQAwkAUi4AUy8AVAAAAAMJAFIuAFMvAFQBAwAEAQMABAMJAFkuAFovAFsAAAADCQBZLgBaLwBbAgcACAoABgIHAAgKAAYDCQBgLgBhLwBiAAAAAwkAYC4AYS8AYgAAAwkAZy4AaC8AaQAAAAMJAGcuAGgvAGkcAgEdSQEeSgEfSwEgTAEiTgEjUBQkURUlUwEmVRQnVhYqVwErWAEsWRQwXBcxXRsyXwQzYAQ0YwQ1ZAQ2ZQQ3ZwQ4aRQ5ahw6bAQ7bhQ8bx09cAQ-cQQ_chRAdR5BdiJCdwVDeAVEeQVFegVGewVHfQVIfxRJgAEjSoIBBUuEARRMhQEkTYYBBU6HAQVPiAEUUIsBJVGMASlSjQEDU44BA1SPAQNVkAEDVpEBA1eTAQNYlQEUWZYBKlqYAQNbmgEUXJsBK12cAQNenQEDX54BFGChASxhogEwYqMBCWOkAQlkpQEJZaYBCWanAQlnqQEJaKsBFGmsATFqrgEJa7ABFGyxATJtsgEJbrMBCW-0ARRwtwEzcbgBN3K5ARBzugEQdLsBEHW8ARB2vQEQd78BEHjBARR5wgE4esQBEHvGARR8xwE5fcgBEH7JARB_ygEUgAHNATqBAc4BPoIB0AEMgwHRAQyEAdMBDIUB1AEMhgHVAQyHAdcBDIgB2QEUiQHaAT-KAdwBDIsB3gEUjAHfAUCNAeABDI4B4QEMjwHiARSQAeUBQZEB5gFFkgHnAQ2TAegBDZQB6QENlQHqAQ2WAesBDZcB7QENmAHvARSZAfABRpoB8wENmwH1ARScAfYBR50B-AENngH5AQ2fAfoBFKIB_QFIowH-AU6kAf8BAqUBgAICpgGBAgKnAYICAqgBgwICqQGFAgKqAYcCFKsBiAJPrAGOAgKtAZACFK4BkQJQrwGWAgKwAZcCArEBmAIUsgGbAlGzAZwCVbQBnQIItQGeAgi2AZ8CCLcBoAIIuAGhAgi5AaMCCLoBpQIUuwGmAla8AagCCL0BqgIUvgGrAle_AawCCMABrQIIwQGuAhTCAbECWMMBsgJcxAGzAgfFAbQCB8YBtQIHxwG2AgfIAbcCB8kBuQIHygG7AhTLAbwCXcwBvgIHzQHAAhTOAcECXs8BwgIH0AHDAgfRAcQCFNIBxwJf0wHIAmPUAcoCBtUBywIG1gHNAgbXAc4CBtgBzwIG2QHRAgbaAdMCFNsB1AJk3AHWAgbdAdgCFN4B2QJl3wHaAgbgAdsCBuEB3AIU4gHfAmbjAeACag"
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
  PaymentScalarFieldEnum: () => PaymentScalarFieldEnum,
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
  Payment: "Payment",
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
  updatedAt: "updatedAt",
  stripeCustomerId: "stripeCustomerId"
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
  planName: "planName",
  status: "status",
  gateway: "gateway",
  subscriptionId: "subscriptionId",
  currentPeriodStart: "currentPeriodStart",
  currentPeriodEnd: "currentPeriodEnd",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var PaymentScalarFieldEnum = {
  id: "id",
  organizationId: "organizationId",
  subscriptionId: "subscriptionId",
  gateway: "gateway",
  transactionId: "transactionId",
  amount: "amount",
  currency: "currency",
  status: "status",
  invoiceUrl: "invoiceUrl",
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
var SubscriptionStatus = {
  PENDING: "PENDING",
  ACTIVE: "ACTIVE",
  CANCELED: "CANCELED",
  PAST_DUE: "PAST_DUE",
  TRIALING: "TRIALING"
};
var PaymentStatus = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED"
};
var PaymentGateway = {
  STRIPE: "STRIPE",
  SSLCOMMERZ: "SSLCOMMERZ",
  BKASH: "BKASH"
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
  upstash_redis_rest_token: process.env.UPSTASH_REDIS_REST_TOKEN,
  orbrin_base_one_month_plan_id: process.env.ORBRIN_BASE_ONE_MONTH_PLAN_ID
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

// src/app/middleware/subscription-check.ts
var subscriptionCheck = async (req, res, next) => {
  try {
    const organizationId = req.user?.organizationId;
    if (!organizationId) {
      return res.status(400).json({
        success: false,
        message: "Organization context is required.",
        errors: []
      });
    }
    const subscription = await prisma.subscription.findUnique({
      where: {
        organizationId
      },
      select: {
        status: true,
        currentPeriodEnd: true
      }
    });
    if (!subscription) {
      return res.status(403).json({
        success: false,
        message: "An active subscription is required.",
        errors: []
      });
    }
    if (subscription.status !== SubscriptionStatus.ACTIVE) {
      return res.status(403).json({
        success: false,
        message: "Please activate your subscription to access this feature.",
        errors: []
      });
    }
    if (subscription.currentPeriodEnd && subscription.currentPeriodEnd < /* @__PURE__ */ new Date()) {
      return res.status(403).json({
        success: false,
        message: "Subscription has expired. Please renew your subscription.",
        errors: []
      });
    }
    return next();
  } catch (error) {
    console.error("Subscription check error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      errors: []
    });
  }
};

// src/app/module/team/team.route.ts
var router2 = Router2();
router2.post(
  "/",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  subscriptionCheck,
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
  subscriptionCheck,
  validate(teamValidation.updateTeamSchema),
  teamController.updateTeam
);
router2.delete(
  "/:teamId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  subscriptionCheck,
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
  subscriptionCheck,
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
  subscriptionCheck,
  validate(projectValidation.updateProjectSchema),
  projectController.updateProject
);
router3.delete(
  "/:projectId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  subscriptionCheck,
  projectController.deleteProject
);
router3.post(
  "/:projectId/teams",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  subscriptionCheck,
  validate(projectValidation.assignTeamSchema),
  projectController.assignTeamToProject
);
router3.delete(
  "/:projectId/teams/:teamId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  subscriptionCheck,
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
    const result = await taskService.getTasksByProject(
      organizationId,
      projectId
    );
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
    const result = await taskService.getTaskById(
      organizationId,
      taskId
    );
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
    const result = await taskService.updateTask(
      organizationId,
      taskId,
      req.body,
      userId,
      role
    );
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
    const result = await taskService.deleteTask(
      organizationId,
      taskId
    );
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
    priority: z4.enum([
      TaskPriority.HIGH,
      TaskPriority.MEDIUM,
      TaskPriority.LOW,
      TaskPriority.URGENT
    ]).optional(),
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
    priority: z4.enum([
      TaskPriority.HIGH,
      TaskPriority.MEDIUM,
      TaskPriority.LOW,
      TaskPriority.URGENT
    ]).optional(),
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
  subscriptionCheck,
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
  subscriptionCheck,
  validate(taskValidation.updateTaskSchema),
  taskController.updateTask
);
router4.delete(
  "/:taskId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  subscriptionCheck,
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
    const result = await sprintService.getSprintsByProject(
      organizationId,
      projectId
    );
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
    const result = await sprintService.getSprintById(
      organizationId,
      sprintId
    );
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
    const result = await sprintService.updateSprint(
      organizationId,
      sprintId,
      req.body
    );
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
    const result = await sprintService.deleteSprint(
      organizationId,
      sprintId
    );
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
    status: z5.enum([
      SprintStatus.ACTIVE,
      SprintStatus.COMPLETED,
      SprintStatus.PLANNING
    ]).optional(),
    startDate: z5.coerce.date({ message: "Start date must be a valid date" }).optional(),
    endDate: z5.coerce.date({ message: "End date must be a valid date" }).optional()
  })
});
var updateSprintSchema = z5.object({
  body: z5.object({
    name: z5.string().trim().min(1, { error: "Sprint name cannot be empty" }).optional(),
    goal: z5.string().optional(),
    status: z5.enum([
      SprintStatus.ACTIVE,
      SprintStatus.COMPLETED,
      SprintStatus.PLANNING
    ]).optional(),
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
  subscriptionCheck,
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
  subscriptionCheck,
  validate(sprintValidation.updateSprintSchema),
  sprintController.updateSprint
);
router5.delete(
  "/:sprintId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  subscriptionCheck,
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
    const result = await commentService.getCommentsByTask(
      organizationId,
      taskId
    );
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
  subscriptionCheck,
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
  subscriptionCheck,
  validate(commentValidation.updateCommentSchema),
  commentController.updateComment
);
router6.delete(
  "/:commentId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  subscriptionCheck,
  commentController.deleteComment
);
var commentRoutes = router6;

// src/app/module/subscription/subscripton.route.ts
import { Router as Router7 } from "express";

// src/app/lib/stripe.ts
import Stripe from "stripe";
var stripe = new Stripe(config_default.stripe_secret_key);

// src/app/utils/stripe-event.ts
var handlePaymentSuccess = async (session) => {
  const organizationId = session.metadata?.organizationId;
  if (!organizationId) {
    throw new Error(
      "Missing organizationId in Stripe Checkout session metadata"
    );
  }
  const planName = session.metadata?.planName ?? "Orbrin Base One Month";
  const stripeSubscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
  if (!stripeSubscriptionId) {
    throw new Error("Missing Stripe subscription ID from Checkout session");
  }
  const stripeSub = await stripe.subscriptions.retrieve(stripeSubscriptionId);
  console.log("Stripe subscription:", stripeSub);
  const subscriptionItem = stripeSub.items.data[0];
  if (!subscriptionItem) {
    throw new Error(`No subscription item found for ${stripeSub.id}`);
  }
  const periodStart = subscriptionItem.current_period_start;
  const periodEnd = subscriptionItem.current_period_end;
  if (typeof periodStart !== "number" || typeof periodEnd !== "number") {
    throw new Error(`Invalid subscription period for ${stripeSub.id}`);
  }
  const currentPeriodStart = new Date(periodStart * 1e3);
  const currentPeriodEnd = new Date(periodEnd * 1e3);
  const subRecord = await prisma.subscription.upsert({
    where: {
      organizationId
    },
    update: {
      planName,
      status: SubscriptionStatus.ACTIVE,
      gateway: PaymentGateway.STRIPE,
      subscriptionId: stripeSub.id,
      currentPeriodStart,
      currentPeriodEnd
    },
    create: {
      organizationId,
      planName,
      status: SubscriptionStatus.ACTIVE,
      gateway: PaymentGateway.STRIPE,
      subscriptionId: stripeSub.id,
      currentPeriodStart,
      currentPeriodEnd
    }
  });
  console.log("Subscription saved:", subRecord.id);
  return subRecord;
};
var handleInvoicePaymentSucceeded = async (invoice) => {
  const stripeSubscriptionId = invoice.parent?.subscription_details?.subscription;
  if (!stripeSubscriptionId) {
    throw new Error(`Invoice ${invoice.id} has no subscription ID`);
  }
  console.log("Invoice ID:", invoice.id);
  console.log("Stripe subscription ID:", stripeSubscriptionId);
  let subscription = await prisma.subscription.findUnique({
    where: {
      subscriptionId: stripeSubscriptionId
    }
  });
  if (!subscription) {
    console.log(
      "Local subscription not found. Creating it from Stripe subscription."
    );
    const stripeSub = await stripe.subscriptions.retrieve(
      stripeSubscriptionId
    );
    const subscriptionItem = stripeSub.items.data[0];
    if (!subscriptionItem) {
      throw new Error(`No subscription item found for ${stripeSub.id}`);
    }
    const periodStart = subscriptionItem.current_period_start;
    const periodEnd = subscriptionItem.current_period_end;
    const customerId = typeof stripeSub.customer === "string" ? stripeSub.customer : stripeSub.customer.id;
    const customer = await stripe.customers.retrieve(customerId);
    if (customer.deleted) {
      throw new Error(`Stripe customer ${customerId} has been deleted`);
    }
    const organizationId = customer.metadata?.organizationId;
    if (!organizationId) {
      throw new Error(
        `Missing organizationId in Stripe customer metadata for ${customerId}`
      );
    }
    const planName = stripeSub.items.data[0]?.price?.nickname ?? "Orbrin Base One Month";
    subscription = await prisma.subscription.upsert({
      where: {
        organizationId
      },
      update: {
        planName,
        status: SubscriptionStatus.ACTIVE,
        gateway: PaymentGateway.STRIPE,
        subscriptionId: stripeSub.id,
        currentPeriodStart: new Date(periodStart * 1e3),
        currentPeriodEnd: new Date(periodEnd * 1e3)
      },
      create: {
        organizationId,
        planName,
        status: SubscriptionStatus.ACTIVE,
        gateway: PaymentGateway.STRIPE,
        subscriptionId: stripeSub.id,
        currentPeriodStart: new Date(periodStart * 1e3),
        currentPeriodEnd: new Date(periodEnd * 1e3)
      }
    });
  }
  const amount = invoice.amount_paid / 100;
  const currency = invoice.currency.toUpperCase();
  const payment = await prisma.payment.upsert({
    where: {
      transactionId: invoice.id
    },
    update: {
      status: PaymentStatus.COMPLETED,
      amount,
      currency,
      organizationId: subscription.organizationId,
      subscriptionId: subscription.id
    },
    create: {
      organizationId: subscription.organizationId,
      subscriptionId: subscription.id,
      gateway: PaymentGateway.STRIPE,
      transactionId: invoice.id,
      amount,
      currency,
      status: PaymentStatus.COMPLETED
    }
  });
  console.log("Payment saved:", payment.id);
  return payment;
};

// src/app/module/subscription/subscripton.service.ts
var createCheckoutSession = async (organizationId) => {
  const organization = await prisma.organization.findUnique({
    where: { id: organizationId, deletedAt: null },
    include: { subscriptions: true }
  });
  if (!organization) {
    throw new Error("Organization not found");
  }
  const subscription = organization.subscriptions;
  const today = /* @__PURE__ */ new Date();
  const subcriptionEndDate = subscription?.currentPeriodEnd;
  if (subcriptionEndDate && subcriptionEndDate > today) {
    throw new Error(
      "Cannot create a new subscription while the current subscription is still active."
    );
  }
  let customerId = organization.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      name: organization.name,
      metadata: { organizationId }
    });
    customerId = customer.id;
    await prisma.organization.update({
      where: { id: organizationId },
      data: { stripeCustomerId: customerId }
    });
  }
  await prisma.subscription.upsert({
    where: { organizationId },
    update: {
      status: SubscriptionStatus.PENDING
    },
    create: {
      organizationId,
      planName: "orbrin base one month",
      status: SubscriptionStatus.PENDING,
      gateway: PaymentGateway.STRIPE
      // Will be set after successful checkout
    }
  });
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [{ price: config_default.orbrin_base_one_month_plan_id, quantity: 1 }],
    mode: "subscription",
    success_url: `${config_default.frontend_url}/subscription/success`,
    cancel_url: `${config_default.frontend_url}/subscription/cancel`,
    metadata: {
      organizationId,
      planName: "orbrin base one month",
      amount: "20"
    }
  });
  return { url: session.url };
};
var webhookHandler = async (payload, signature) => {
  const webhookSecret = config_default.stripe_webhook_secret;
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    webhookSecret
  );
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      await handlePaymentSuccess(session);
      break;
    }
    case "invoice.payment_succeeded": {
      console.log("invoice payment succeeded hit");
      const invoice = event.data.object;
      await handleInvoicePaymentSucceeded(invoice);
      break;
    }
    default: {
      console.log(`Unhandled Stripe event: ${event.type}`);
      break;
    }
  }
  return {
    eventType: event.type,
    eventId: event.id
  };
};
var getOrganizationSubscriptionHistory = async (organizationId) => {
  const subscriptions = await prisma.subscription.findFirst({
    where: { organizationId },
    include: {
      payments: true
    },
    orderBy: { createdAt: "desc" }
  });
  if (!subscriptions) {
    throw new Error("No subscription history found for the organization");
  }
  return subscriptions;
};
var subscriptionService = {
  createCheckoutSession,
  getOrganizationSubscriptionHistory,
  webhookHandler
};

// src/app/module/subscription/subscripton.controller.ts
import { StatusCodes as StatusCodes8 } from "http-status-codes";
var createCheckoutSession2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    const result = await subscriptionService.createCheckoutSession(organizationId);
    sendSuccessResponse(res, {
      statusCode: StatusCodes8.OK,
      message: "Checkout session created successfully",
      data: result
    });
  }
);
var getSubscriptionHistory = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    const result = await subscriptionService.getOrganizationSubscriptionHistory(
      organizationId
    );
    sendSuccessResponse(res, {
      statusCode: StatusCodes8.OK,
      message: "Subscription and billing history retrieved successfully",
      data: result
    });
  }
);
var webhookHandler2 = catch_async_default(
  async (req, res, next) => {
    const signature = req.headers["stripe-signature"];
    const result = await subscriptionService.webhookHandler(
      req.body,
      signature
    );
    sendSuccessResponse(res, {
      statusCode: StatusCodes8.OK,
      message: "Webhook processed successfully",
      data: result
    });
  }
);
var subscriptionController = {
  createCheckoutSession: createCheckoutSession2,
  getSubscriptionHistory,
  webhookHandler: webhookHandler2
};

// src/app/module/subscription/subscripton.route.ts
var router7 = Router7();
router7.post("/webhook", subscriptionController.webhookHandler);
router7.post(
  "/checkout",
  authMiddleware.auth(Role.ADMIN),
  subscriptionController.createCheckoutSession
);
router7.get(
  "/history",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  subscriptionController.getSubscriptionHistory
);
var subscriptionRoutes = router7;

// src/app.ts
var app = express();
var corsOptions = {
  origin: config_default.frontend_url,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(
  "/api/v1/subscriptions/webhook",
  express.raw({ type: "application/json" })
);
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
app.use("/api/v1/subscriptions", subscriptionRoutes);
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