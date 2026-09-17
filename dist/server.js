
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
  id           String    @id @default(uuid())
  name         String
  slug         String    @unique
  logoUrl      String?   @map("logo_url")
  logoPublicId String?   @map("logo_public_id")
  deletedAt    DateTime? @map("deleted_at")
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")

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
  id               String    @id @default(uuid())
  organizationId   String    @map("organization_id")
  name             String
  description      String?
  documentUrl      String?   @map("document_url")
  documentPublicId String?   @map("document_public_id")
  status           String    @default("active")
  deletedAt        DateTime? @map("deleted_at")
  createdAt        DateTime  @default(now()) @map("created_at")
  updatedAt        DateTime  @updatedAt @map("updated_at")

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
  id                   String       @id @default(uuid())
  email                String       @unique
  emailVerified        Boolean      @default(false) @map("email_verified")
  passwordHash         String?      @map("password_hash")
  fullName             String       @map("full_name")
  profileImageUrl      String?      @map("profile_image_url")
  profileImagePublicId String?      @map("profile_image_public_id")
  status               UserStatus   @default(ACTIVE)
  authProvider         AuthProvider @default(LOCAL) @map("auth_provider")
  authProviderId       String?      @map("auth_provider_id")
  deletedAt            DateTime?    @map("deleted_at")
  createdAt            DateTime     @default(now()) @map("created_at")
  updatedAt            DateTime     @updatedAt @map("updated_at")

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
config.runtimeDataModel = JSON.parse('{"models":{"Comment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"taskId","kind":"scalar","type":"String","dbName":"task_id"},{"name":"authorId","kind":"scalar","type":"String","dbName":"author_id"},{"name":"content","kind":"scalar","type":"String"},{"name":"deletedAt","kind":"scalar","type":"DateTime","dbName":"deleted_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"task","kind":"object","type":"Task","relationName":"CommentToTask"},{"name":"author","kind":"object","type":"User","relationName":"CommentToUser"}],"dbName":"comments","schema":null},"Organization":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"logoUrl","kind":"scalar","type":"String","dbName":"logo_url"},{"name":"logoPublicId","kind":"scalar","type":"String","dbName":"logo_public_id"},{"name":"deletedAt","kind":"scalar","type":"DateTime","dbName":"deleted_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"stripeCustomerId","kind":"scalar","type":"String","dbName":"stripe_customer_id"},{"name":"memberships","kind":"object","type":"OrganizationMembership","relationName":"OrganizationToOrganizationMembership"},{"name":"teams","kind":"object","type":"Team","relationName":"OrganizationToTeam"},{"name":"projects","kind":"object","type":"Project","relationName":"OrganizationToProject"},{"name":"subscriptions","kind":"object","type":"Subscription","relationName":"OrganizationToSubscription"},{"name":"payments","kind":"object","type":"Payment","relationName":"OrganizationToPayment"}],"dbName":"organizations","schema":null},"OrganizationMembership":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String","dbName":"organization_id"},{"name":"userId","kind":"scalar","type":"String","dbName":"user_id"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"OrganizationMembershipStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"organization","kind":"object","type":"Organization","relationName":"OrganizationToOrganizationMembership"},{"name":"user","kind":"object","type":"User","relationName":"OrganizationMembershipToUser"}],"dbName":"organization_memberships","schema":null},"Project":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String","dbName":"organization_id"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"documentUrl","kind":"scalar","type":"String","dbName":"document_url"},{"name":"documentPublicId","kind":"scalar","type":"String","dbName":"document_public_id"},{"name":"status","kind":"scalar","type":"String"},{"name":"deletedAt","kind":"scalar","type":"DateTime","dbName":"deleted_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"organization","kind":"object","type":"Organization","relationName":"OrganizationToProject"},{"name":"sprints","kind":"object","type":"Sprint","relationName":"ProjectToSprint"},{"name":"teams","kind":"object","type":"ProjectTeam","relationName":"ProjectToProjectTeam"},{"name":"tasks","kind":"object","type":"Task","relationName":"ProjectToTask"}],"dbName":"projects","schema":null},"ProjectTeam":{"fields":[{"name":"projectId","kind":"scalar","type":"String","dbName":"project_id"},{"name":"teamId","kind":"scalar","type":"String","dbName":"team_id"},{"name":"assignedAt","kind":"scalar","type":"DateTime","dbName":"assigned_at"},{"name":"project","kind":"object","type":"Project","relationName":"ProjectToProjectTeam"},{"name":"team","kind":"object","type":"Team","relationName":"ProjectTeamToTeam"}],"dbName":"project_teams","schema":null},"Sprint":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"projectId","kind":"scalar","type":"String","dbName":"project_id"},{"name":"name","kind":"scalar","type":"String"},{"name":"goal","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"SprintStatus"},{"name":"startDate","kind":"scalar","type":"DateTime","dbName":"start_date"},{"name":"endDate","kind":"scalar","type":"DateTime","dbName":"end_date"},{"name":"deletedAt","kind":"scalar","type":"DateTime","dbName":"deleted_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"project","kind":"object","type":"Project","relationName":"ProjectToSprint"},{"name":"tasks","kind":"object","type":"Task","relationName":"SprintToTask"}],"dbName":"sprints","schema":null},"Subscription":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String","dbName":"organization_id"},{"name":"planName","kind":"scalar","type":"String","dbName":"plan_name"},{"name":"status","kind":"enum","type":"SubscriptionStatus"},{"name":"gateway","kind":"enum","type":"PaymentGateway"},{"name":"subscriptionId","kind":"scalar","type":"String","dbName":"subscription_id"},{"name":"currentPeriodStart","kind":"scalar","type":"DateTime","dbName":"current_period_start"},{"name":"currentPeriodEnd","kind":"scalar","type":"DateTime","dbName":"current_period_end"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"organization","kind":"object","type":"Organization","relationName":"OrganizationToSubscription"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToSubscription"}],"dbName":"subscriptions","schema":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String","dbName":"organization_id"},{"name":"subscriptionId","kind":"scalar","type":"String","dbName":"subscription_id"},{"name":"gateway","kind":"enum","type":"PaymentGateway"},{"name":"transactionId","kind":"scalar","type":"String","dbName":"transaction_id"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"invoiceUrl","kind":"scalar","type":"String","dbName":"invoice_url"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"organization","kind":"object","type":"Organization","relationName":"OrganizationToPayment"},{"name":"subscription","kind":"object","type":"Subscription","relationName":"PaymentToSubscription"}],"dbName":"payments","schema":null},"Task":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"projectId","kind":"scalar","type":"String","dbName":"project_id"},{"name":"sprintId","kind":"scalar","type":"String","dbName":"sprint_id"},{"name":"parentTaskId","kind":"scalar","type":"String","dbName":"parent_task_id"},{"name":"creatorId","kind":"scalar","type":"String","dbName":"creator_id"},{"name":"assigneeId","kind":"scalar","type":"String","dbName":"assignee_id"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TaskStatus"},{"name":"priority","kind":"enum","type":"TaskPriority"},{"name":"deletedAt","kind":"scalar","type":"DateTime","dbName":"deleted_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"project","kind":"object","type":"Project","relationName":"ProjectToTask"},{"name":"parentTask","kind":"object","type":"Task","relationName":"SubTasks"},{"name":"subTasks","kind":"object","type":"Task","relationName":"SubTasks"},{"name":"creator","kind":"object","type":"User","relationName":"TaskCreator"},{"name":"assignee","kind":"object","type":"User","relationName":"TaskAssignee"},{"name":"sprint","kind":"object","type":"Sprint","relationName":"SprintToTask"},{"name":"comments","kind":"object","type":"Comment","relationName":"CommentToTask"}],"dbName":"tasks","schema":null},"Team":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"organizationId","kind":"scalar","type":"String","dbName":"organization_id"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"deletedAt","kind":"scalar","type":"DateTime","dbName":"deleted_at"},{"name":"organization","kind":"object","type":"Organization","relationName":"OrganizationToTeam"},{"name":"teamMembers","kind":"object","type":"TeamMembership","relationName":"TeamToTeamMembership"},{"name":"projects","kind":"object","type":"ProjectTeam","relationName":"ProjectTeamToTeam"}],"dbName":"teams","schema":null},"TeamMembership":{"fields":[{"name":"teamId","kind":"scalar","type":"String","dbName":"team_id"},{"name":"userId","kind":"scalar","type":"String","dbName":"user_id"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"team","kind":"object","type":"Team","relationName":"TeamToTeamMembership"},{"name":"user","kind":"object","type":"User","relationName":"TeamMembershipToUser"}],"dbName":"team_memberships","schema":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean","dbName":"email_verified"},{"name":"passwordHash","kind":"scalar","type":"String","dbName":"password_hash"},{"name":"fullName","kind":"scalar","type":"String","dbName":"full_name"},{"name":"profileImageUrl","kind":"scalar","type":"String","dbName":"profile_image_url"},{"name":"profileImagePublicId","kind":"scalar","type":"String","dbName":"profile_image_public_id"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"authProvider","kind":"enum","type":"AuthProvider","dbName":"auth_provider"},{"name":"authProviderId","kind":"scalar","type":"String","dbName":"auth_provider_id"},{"name":"deletedAt","kind":"scalar","type":"DateTime","dbName":"deleted_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"memberships","kind":"object","type":"OrganizationMembership","relationName":"OrganizationMembershipToUser"},{"name":"teamMemberships","kind":"object","type":"TeamMembership","relationName":"TeamMembershipToUser"},{"name":"createdTasks","kind":"object","type":"Task","relationName":"TaskCreator"},{"name":"assignedTasks","kind":"object","type":"Task","relationName":"TaskAssignee"},{"name":"comments","kind":"object","type":"Comment","relationName":"CommentToUser"}],"dbName":"users","schema":null}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","organization","memberships","teamMembers","project","team","projects","_count","user","teamMemberships","createdTasks","assignedTasks","comments","teams","subscription","payments","subscriptions","tasks","sprints","parentTask","subTasks","creator","assignee","sprint","task","author","Comment.findUnique","Comment.findUniqueOrThrow","Comment.findFirst","Comment.findFirstOrThrow","Comment.findMany","data","Comment.createOne","Comment.createMany","Comment.createManyAndReturn","Comment.updateOne","Comment.updateMany","Comment.updateManyAndReturn","create","update","Comment.upsertOne","Comment.deleteOne","Comment.deleteMany","having","_min","_max","Comment.groupBy","Comment.aggregate","Organization.findUnique","Organization.findUniqueOrThrow","Organization.findFirst","Organization.findFirstOrThrow","Organization.findMany","Organization.createOne","Organization.createMany","Organization.createManyAndReturn","Organization.updateOne","Organization.updateMany","Organization.updateManyAndReturn","Organization.upsertOne","Organization.deleteOne","Organization.deleteMany","Organization.groupBy","Organization.aggregate","OrganizationMembership.findUnique","OrganizationMembership.findUniqueOrThrow","OrganizationMembership.findFirst","OrganizationMembership.findFirstOrThrow","OrganizationMembership.findMany","OrganizationMembership.createOne","OrganizationMembership.createMany","OrganizationMembership.createManyAndReturn","OrganizationMembership.updateOne","OrganizationMembership.updateMany","OrganizationMembership.updateManyAndReturn","OrganizationMembership.upsertOne","OrganizationMembership.deleteOne","OrganizationMembership.deleteMany","OrganizationMembership.groupBy","OrganizationMembership.aggregate","Project.findUnique","Project.findUniqueOrThrow","Project.findFirst","Project.findFirstOrThrow","Project.findMany","Project.createOne","Project.createMany","Project.createManyAndReturn","Project.updateOne","Project.updateMany","Project.updateManyAndReturn","Project.upsertOne","Project.deleteOne","Project.deleteMany","Project.groupBy","Project.aggregate","ProjectTeam.findUnique","ProjectTeam.findUniqueOrThrow","ProjectTeam.findFirst","ProjectTeam.findFirstOrThrow","ProjectTeam.findMany","ProjectTeam.createOne","ProjectTeam.createMany","ProjectTeam.createManyAndReturn","ProjectTeam.updateOne","ProjectTeam.updateMany","ProjectTeam.updateManyAndReturn","ProjectTeam.upsertOne","ProjectTeam.deleteOne","ProjectTeam.deleteMany","ProjectTeam.groupBy","ProjectTeam.aggregate","Sprint.findUnique","Sprint.findUniqueOrThrow","Sprint.findFirst","Sprint.findFirstOrThrow","Sprint.findMany","Sprint.createOne","Sprint.createMany","Sprint.createManyAndReturn","Sprint.updateOne","Sprint.updateMany","Sprint.updateManyAndReturn","Sprint.upsertOne","Sprint.deleteOne","Sprint.deleteMany","Sprint.groupBy","Sprint.aggregate","Subscription.findUnique","Subscription.findUniqueOrThrow","Subscription.findFirst","Subscription.findFirstOrThrow","Subscription.findMany","Subscription.createOne","Subscription.createMany","Subscription.createManyAndReturn","Subscription.updateOne","Subscription.updateMany","Subscription.updateManyAndReturn","Subscription.upsertOne","Subscription.deleteOne","Subscription.deleteMany","Subscription.groupBy","Subscription.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","_avg","_sum","Payment.groupBy","Payment.aggregate","Task.findUnique","Task.findUniqueOrThrow","Task.findFirst","Task.findFirstOrThrow","Task.findMany","Task.createOne","Task.createMany","Task.createManyAndReturn","Task.updateOne","Task.updateMany","Task.updateManyAndReturn","Task.upsertOne","Task.deleteOne","Task.deleteMany","Task.groupBy","Task.aggregate","Team.findUnique","Team.findUniqueOrThrow","Team.findFirst","Team.findFirstOrThrow","Team.findMany","Team.createOne","Team.createMany","Team.createManyAndReturn","Team.updateOne","Team.updateMany","Team.updateManyAndReturn","Team.upsertOne","Team.deleteOne","Team.deleteMany","Team.groupBy","Team.aggregate","TeamMembership.findUnique","TeamMembership.findUniqueOrThrow","TeamMembership.findFirst","TeamMembership.findFirstOrThrow","TeamMembership.findMany","TeamMembership.createOne","TeamMembership.createMany","TeamMembership.createManyAndReturn","TeamMembership.updateOne","TeamMembership.updateMany","TeamMembership.updateManyAndReturn","TeamMembership.upsertOne","TeamMembership.deleteOne","TeamMembership.deleteMany","TeamMembership.groupBy","TeamMembership.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","AND","OR","NOT","id","email","emailVerified","passwordHash","fullName","profileImageUrl","profileImagePublicId","UserStatus","status","AuthProvider","authProvider","authProviderId","deletedAt","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","every","some","none","teamId","userId","organizationId","name","description","projectId","sprintId","parentTaskId","creatorId","assigneeId","title","TaskStatus","TaskPriority","priority","subscriptionId","PaymentGateway","gateway","transactionId","amount","currency","PaymentStatus","invoiceUrl","planName","SubscriptionStatus","currentPeriodStart","currentPeriodEnd","goal","SprintStatus","startDate","endDate","assignedAt","documentUrl","documentPublicId","Role","role","OrganizationMembershipStatus","slug","logoUrl","logoPublicId","stripeCustomerId","taskId","authorId","content","unique_team_name_per_organization","projectId_teamId","teamId_userId","organizationId_userId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "lgdqwAEMGgAAwAMAIBsAAMEDACDkAQAAvwMAMOUBAAAYABDmAQAAvwMAMOcBAQAAAAHzAUAA_wIAIfQBQACAAwAh9QFAAIADACGsAgEA_AIAIa0CAQD8AgAhrgIBAPwCACEBAAAAAQAgDAMAAJ8DACAKAADBAwAg5AEAAM4DADDlAQAAAwAQ5gEAAM4DADDnAQEA_AIAIe8BAADQA6gCIvQBQACAAwAh9QFAAIADACGFAgEA_AIAIYYCAQD8AgAhpgIAAM8DpgIiAgMAAJcFACAKAACjBgAgDQMAAJ8DACAKAADBAwAg5AEAAM4DADDlAQAAAwAQ5gEAAM4DADDnAQEAAAAB7wEAANADqAIi9AFAAIADACH1AUAAgAMAIYUCAQD8AgAhhgIBAPwCACGmAgAAzwOmAiKyAgAAzQMAIAMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgCQcAAMoDACAKAADBAwAg5AEAAMwDADDlAQAACAAQ5gEAAMwDADD0AUAAgAMAIfUBQACAAwAhhAIBAPwCACGFAgEA_AIAIQIHAAClBgAgCgAAowYAIAoHAADKAwAgCgAAwQMAIOQBAADMAwAw5QEAAAgAEOYBAADMAwAw9AFAAIADACH1AUAAgAMAIYQCAQD8AgAhhQIBAPwCACGxAgAAywMAIAMAAAAIACABAAAJADACAAAKACADAAAACAAgAQAACQAwAgAACgAgCAYAALYDACAHAADKAwAg5AEAAMkDADDlAQAADQAQ5gEAAMkDADCEAgEA_AIAIYkCAQD8AgAhogJAAIADACECBgAAnwYAIAcAAKUGACAJBgAAtgMAIAcAAMoDACDkAQAAyQMAMOUBAAANABDmAQAAyQMAMIQCAQD8AgAhiQIBAPwCACGiAkAAgAMAIbACAADIAwAgAwAAAA0AIAEAAA4AMAIAAA8AIAEAAAAIACABAAAADQAgFwYAALYDACAOAACEAwAgFQAAxQMAIBYAAIMDACAXAADGAwAgGAAAxgMAIBkAAMcDACDkAQAAwgMAMOUBAAATABDmAQAAwgMAMOcBAQD8AgAh7wEAAMMDkAIi8wFAAP8CACH0AUAAgAMAIfUBQACAAwAhiAIBAPsCACGJAgEA_AIAIYoCAQD7AgAhiwIBAPsCACGMAgEA-wIAIY0CAQD7AgAhjgIBAPwCACGRAgAAxAORAiINBgAAnwYAIA4AAM4EACAVAACiBgAgFgAAzQQAIBcAAKMGACAYAACjBgAgGQAApAYAIPMBAADRAwAgiAIAANEDACCKAgAA0QMAIIsCAADRAwAgjAIAANEDACCNAgAA0QMAIBcGAAC2AwAgDgAAhAMAIBUAAMUDACAWAACDAwAgFwAAxgMAIBgAAMYDACAZAADHAwAg5AEAAMIDADDlAQAAEwAQ5gEAAMIDADDnAQEAAAAB7wEAAMMDkAIi8wFAAP8CACH0AUAAgAMAIfUBQACAAwAhiAIBAPsCACGJAgEA_AIAIYoCAQD7AgAhiwIBAPsCACGMAgEA-wIAIY0CAQD7AgAhjgIBAPwCACGRAgAAxAORAiIDAAAAEwAgAQAAFAAwAgAAFQAgAwAAABMAIAEAABQAMAIAABUAIAwaAADAAwAgGwAAwQMAIOQBAAC_AwAw5QEAABgAEOYBAAC_AwAw5wEBAPwCACHzAUAA_wIAIfQBQACAAwAh9QFAAIADACGsAgEA_AIAIa0CAQD8AgAhrgIBAPwCACEDGgAAogYAIBsAAKMGACDzAQAA0QMAIAMAAAAYACABAAAZADACAAABACABAAAAAwAgAQAAAAgAIAEAAAATACABAAAAEwAgAQAAABgAIA0DAACfAwAgBQAAggMAIAgAALwDACDkAQAAvgMAMOUBAAAgABDmAQAAvgMAMOcBAQD8AgAh8wFAAP8CACH0AUAAgAMAIfUBQACAAwAhhgIBAPwCACGHAgEA_AIAIYgCAQD7AgAhBQMAAJcFACAFAADMBAAgCAAAoQYAIPMBAADRAwAgiAIAANEDACAOAwAAnwMAIAUAAIIDACAIAAC8AwAg5AEAAL4DADDlAQAAIAAQ5gEAAL4DADDnAQEAAAAB8wFAAP8CACH0AUAAgAMAIfUBQACAAwAhhgIBAPwCACGHAgEA_AIAIYgCAQD7AgAhrwIAAL0DACADAAAAIAAgAQAAIQAwAgAAIgAgEQMAAJ8DACAPAAC8AwAgEwAAgwMAIBQAALsDACDkAQAAugMAMOUBAAAkABDmAQAAugMAMOcBAQD8AgAh7wEBAPwCACHzAUAA_wIAIfQBQACAAwAh9QFAAIADACGGAgEA_AIAIYcCAQD8AgAhiAIBAPsCACGjAgEA-wIAIaQCAQD7AgAhCAMAAJcFACAPAAChBgAgEwAAzQQAIBQAAKAGACDzAQAA0QMAIIgCAADRAwAgowIAANEDACCkAgAA0QMAIBEDAACfAwAgDwAAvAMAIBMAAIMDACAUAAC7AwAg5AEAALoDADDlAQAAJAAQ5gEAALoDADDnAQEAAAAB7wEBAPwCACHzAUAA_wIAIfQBQACAAwAh9QFAAIADACGGAgEA_AIAIYcCAQD8AgAhiAIBAPsCACGjAgEA-wIAIaQCAQD7AgAhAwAAACQAIAEAACUAMAIAACYAIA8DAACfAwAgEQAAoAMAIOQBAACcAwAw5QEAACgAEOYBAACcAwAw5wEBAPwCACHvAQAAnQOcAiL0AUAAgAMAIfUBQACAAwAhhgIBAPwCACGSAgEA-wIAIZQCAACeA5QCIpoCAQD8AgAhnAJAAP8CACGdAkAA_wIAIQEAAAAoACAQAwAAnwMAIBAAALIDACDkAQAAtwMAMOUBAAAqABDmAQAAtwMAMOcBAQD8AgAh7wEAALkDmQIi9AFAAIADACH1AUAAgAMAIYYCAQD8AgAhkgIBAPsCACGUAgAAngOUAiKVAgEA_AIAIZYCEAC4AwAhlwIBAPwCACGZAgEA-wIAIQQDAACXBQAgEAAAmwYAIJICAADRAwAgmQIAANEDACAQAwAAnwMAIBAAALIDACDkAQAAtwMAMOUBAAAqABDmAQAAtwMAMOcBAQAAAAHvAQAAuQOZAiL0AUAAgAMAIfUBQACAAwAhhgIBAPwCACGSAgEA-wIAIZQCAACeA5QCIpUCAQAAAAGWAhAAuAMAIZcCAQD8AgAhmQIBAPsCACEDAAAAKgAgAQAAKwAwAgAALAAgAQAAACgAIAEAAAAqACADAAAAKgAgAQAAKwAwAgAALAAgAQAAAAMAIAEAAAAgACABAAAAJAAgAQAAACoAIA8GAAC2AwAgEwAAgwMAIOQBAAC0AwAw5QEAADUAEOYBAAC0AwAw5wEBAPwCACHvAQAAtQOgAiLzAUAA_wIAIfQBQACAAwAh9QFAAIADACGHAgEA_AIAIYkCAQD8AgAhngIBAPsCACGgAkAA_wIAIaECQAD_AgAhBgYAAJ8GACATAADNBAAg8wEAANEDACCeAgAA0QMAIKACAADRAwAgoQIAANEDACAPBgAAtgMAIBMAAIMDACDkAQAAtAMAMOUBAAA1ABDmAQAAtAMAMOcBAQAAAAHvAQAAtQOgAiLzAUAA_wIAIfQBQACAAwAh9QFAAIADACGHAgEA_AIAIYkCAQD8AgAhngIBAPsCACGgAkAA_wIAIaECQAD_AgAhAwAAADUAIAEAADYAMAIAADcAIAMAAAATACABAAAUADACAAAVACABAAAAEwAgAwAAAA0AIAEAAA4AMAIAAA8AIAMAAAATACABAAAUADACAAAVACABAAAANQAgAQAAAA0AIAEAAAATACABAAAAEwAgAwAAABMAIAEAABQAMAIAABUAIBUEAACBAwAgCwAAggMAIAwAAIMDACANAACDAwAgDgAAhAMAIOQBAAD5AgAw5QEAAEIAEOYBAAD5AgAw5wEBAPwCACHoAQEA_AIAIekBIAD6AgAh6gEBAPsCACHrAQEA_AIAIewBAQD7AgAh7QEBAPsCACHvAQAA_QLvASLxAQAA_gLxASLyAQEA-wIAIfMBQAD_AgAh9AFAAIADACH1AUAAgAMAIQEAAABCACABAAAAQgAgAQAAADUAIAMAAAAYACABAAAZADACAAABACABAAAAEwAgAQAAABgAIAEAAAABACADAAAAGAAgAQAAGQAwAgAAAQAgAwAAABgAIAEAABkAMAIAAAEAIAMAAAAYACABAAAZADACAAABACAJGgAA7gMAIBsAAIwEACDnAQEAAAAB8wFAAAAAAfQBQAAAAAH1AUAAAAABrAIBAAAAAa0CAQAAAAGuAgEAAAABASEAAE0AIAfnAQEAAAAB8wFAAAAAAfQBQAAAAAH1AUAAAAABrAIBAAAAAa0CAQAAAAGuAgEAAAABASEAAE8AMAEhAABPADAJGgAA7AMAIBsAAIoEACDnAQEA1QMAIfMBQADaAwAh9AFAANsDACH1AUAA2wMAIawCAQDVAwAhrQIBANUDACGuAgEA1QMAIQIAAAABACAhAABSACAH5wEBANUDACHzAUAA2gMAIfQBQADbAwAh9QFAANsDACGsAgEA1QMAIa0CAQDVAwAhrgIBANUDACECAAAAGAAgIQAAVAAgAgAAABgAICEAAFQAIAMAAAABACAoAABNACApAABSACABAAAAAQAgAQAAABgAIAQJAACcBgAgLgAAngYAIC8AAJ0GACDzAQAA0QMAIArkAQAAswMAMOUBAABbABDmAQAAswMAMOcBAQDiAgAh8wFAAOcCACH0AUAA6AIAIfUBQADoAgAhrAIBAOICACGtAgEA4gIAIa4CAQDiAgAhAwAAABgAIAEAAFoAMC0AAFsAIAMAAAAYACABAAAZADACAAABACARBAAAgQMAIAgAALEDACAPAACwAwAgEQAAoAMAIBIAALIDACDkAQAArwMAMOUBAABhABDmAQAArwMAMOcBAQAAAAHzAUAA_wIAIfQBQACAAwAh9QFAAIADACGHAgEA_AIAIagCAQAAAAGpAgEA-wIAIaoCAQD7AgAhqwIBAAAAAQEAAABeACABAAAAXgAgEQQAAIEDACAIAACxAwAgDwAAsAMAIBEAAKADACASAACyAwAg5AEAAK8DADDlAQAAYQAQ5gEAAK8DADDnAQEA_AIAIfMBQAD_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_wIAIZ0CQAD_AgAhAQAAAM8BACABAAAAzwEAIAUDAACXBQAgEQAAmAUAIJICAADRAwAgnAIAANEDACCdAgAA0QMAIAMAAAAoACABAADSAQAwAgAAzwEAIAMAAAAoACABAADSAQAwAgAAzwEAIAMAAAAoACABAADSAQAwAgAAzwEAIAwDAACVBQAgEQAAlgUAIOcBAQAAAAHvAQAAAJwCAvQBQAAAAAH1AUAAAAABhgIBAAAAAZICAQAAAAGUAgAAAJQCApoCAQAAAAGcAkAAAAABnQJAAAAAAQEhAADWAQAgCucBAQAAAAHvAQAAAJwCAvQBQAAAAAH1AUAAAAABhgIBAAAAAZICAQAAAAGUAgAAAJQCApoCAQAAAAGcAkAAAAABnQJAAAAAAQEhAADYAQAwASEAANgBADAMAwAAhwUAIBEAAIgFACDnAQEA1QMAIe8BAACGBZwCIvQBQADbAwAh9QFAANsDACGGAgEA1QMAIZICAQDXAwAhlAIAAPwElAIimgIBANUDACGcAkAA2gMAIZ0CQADaAwAhAgAAAM8BACAhAADbAQAgCucBAQDVAwAh7wEAAIYFnAIi9AFAANsDACH1AUAA2wMAIYYCAQDVAwAhkgIBANcDACGUAgAA_ASUAiKaAgEA1QMAIZwCQADaAwAhnQJAANoDACECAAAAKAAgIQAA3QEAIAIAAAAoACAhAADdAQAgAwAAAM8BACAoAADWAQAgKQAA2wEAIAEAAADPAQAgAQAAACgAIAYJAACDBQAgLgAAhQUAIC8AAIQFACCSAgAA0QMAIJwCAADRAwAgnQIAANEDACAN5AEAAJgDADDlAQAA5AEAEOYBAACYAwAw5wEBAOICACHvAQAAmQOcAiL0AUAA6AIAIfUBQADoAgAhhgIBAOICACGSAgEA5AIAIZQCAACPA5QCIpoCAQDiAgAhnAJAAOcCACGdAkAA5wIAIQMAAAAoACABAADjAQAwLQAA5AEAIAMAAAAoACABAADSAQAwAgAAzwEAIAEAAAAsACABAAAALAAgAwAAACoAIAEAACsAMAIAACwAIAMAAAAqACABAAArADACAAAsACADAAAAKgAgAQAAKwAwAgAALAAgDQMAAIEFACAQAACCBQAg5wEBAAAAAe8BAAAAmQIC9AFAAAAAAfUBQAAAAAGGAgEAAAABkgIBAAAAAZQCAAAAlAIClQIBAAAAAZYCEAAAAAGXAgEAAAABmQIBAAAAAQEhAADsAQAgC-cBAQAAAAHvAQAAAJkCAvQBQAAAAAH1AUAAAAABhgIBAAAAAZICAQAAAAGUAgAAAJQCApUCAQAAAAGWAhAAAAABlwIBAAAAAZkCAQAAAAEBIQAA7gEAMAEhAADuAQAwAQAAACgAIA0DAAD_BAAgEAAAgAUAIOcBAQDVAwAh7wEAAP4EmQIi9AFAANsDACH1AUAA2wMAIYYCAQDVAwAhkgIBANcDACGUAgAA_ASUAiKVAgEA1QMAIZYCEAD9BAAhlwIBANUDACGZAgEA1wMAIQIAAAAsACAhAADyAQAgC-cBAQDVAwAh7wEAAP4EmQIi9AFAANsDACH1AUAA2wMAIYYCAQDVAwAhkgIBANcDACGUAgAA_ASUAiKVAgEA1QMAIZYCEAD9BAAhlwIBANUDACGZAgEA1wMAIQIAAAAqACAhAAD0AQAgAgAAACoAICEAAPQBACABAAAAKAAgAwAAACwAICgAAOwBACApAADyAQAgAQAAACwAIAEAAAAqACAHCQAA9wQAIC4AAPoEACAvAAD5BAAgoAEAAPgEACChAQAA-wQAIJICAADRAwAgmQIAANEDACAO5AEAAI4DADDlAQAA_AEAEOYBAACOAwAw5wEBAOICACHvAQAAkQOZAiL0AUAA6AIAIfUBQADoAgAhhgIBAOICACGSAgEA5AIAIZQCAACPA5QCIpUCAQDiAgAhlgIQAJADACGXAgEA4gIAIZkCAQDkAgAhAwAAACoAIAEAAPsBADAtAAD8AQAgAwAAACoAIAEAACsAMAIAACwAIAEAAAAVACABAAAAFQAgAwAAABMAIAEAABQAMAIAABUAIAMAAAATACABAAAUADACAAAVACADAAAAEwAgAQAAFAAwAgAAFQAgFAYAAJcEACAOAACcBAAgFQAAngQAIBYAAJgEACAXAACZBAAgGAAAmgQAIBkAAJsEACDnAQEAAAAB7wEAAACQAgLzAUAAAAAB9AFAAAAAAfUBQAAAAAGIAgEAAAABiQIBAAAAAYoCAQAAAAGLAgEAAAABjAIBAAAAAY0CAQAAAAGOAgEAAAABkQIAAACRAgIBIQAAhAIAIA3nAQEAAAAB7wEAAACQAgLzAUAAAAAB9AFAAAAAAfUBQAAAAAGIAgEAAAABiQIBAAAAAYoCAQAAAAGLAgEAAAABjAIBAAAAAY0CAQAAAAGOAgEAAAABkQIAAACRAgIBIQAAhgIAMAEhAACGAgAwAQAAABMAIAEAAABCACABAAAAQgAgAQAAADUAIBQGAAD8AwAgDgAAgQQAIBUAAP0DACAWAAD-AwAgFwAA_wMAIBgAAJUEACAZAACABAAg5wEBANUDACHvAQAA-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-QIAMOUBAABCABDmAQAA-QIAMOcBAQAAAAHoAQEAAAAB6QEgAPoCACHqAQEA-wIAIesBAQD8AgAh7AEBAPsCACHtAQEA-wIAIe8BAAD9Au8BIvEBAAD-AvEBIvIBAQD7AgAh8wFAAP8CACH0AUAAgAMAIfUBQACAAwAhAQAAAMkCACABAAAAyQIAIAoEAADLBAAgCwAAzAQAIAwAAM0EACANAADNBAAgDgAAzgQAIOoBAADRAwAg7AEAANEDACDtAQAA0QMAIPIBAADRAwAg8wEAANEDACADAAAAQgAgAQAAzAIAMAIAAMkCACADAAAAQgAgAQAAzAIAMAIAAMkCACADAAAAQgAgAQAAzAIAMAIAAMkCACASBAAAxgQAIAsAAMcEACAMAADIBAAgDQAAyQQAIA4AAMoEACDnAQEAAAAB6AEBAAAAAekBIAAAAAHqAQEAAAAB6wEBAAAAAewBAQAAAAHtAQEAAAAB7wEAAADvAQLxAQAAAPEBAvIBAQAAAAHzAUAAAAAB9AFAAAAAAfUBQAAAAAEBIQAA0AIAIA3nAQEAAAAB6AEBAAAAAekBIAAAAAHqAQEAAAAB6wEBAAAAAewBAQAAAAHtAQEAAAAB7wEAAADvAQLxAQAAAPEBAvIBAQAAAAHzAUAAAAAB9AFAAAAAAfUBQAAAAAEBIQAA0gIAMAEhAADSAgAwEgQAANwDACALAADdAwAgDAAA3gMAIA0AAN8DACAOAADgAwAg5wEBANUDACHoAQEA1QMAIekBIADWAwAh6gEBANcDACHrAQEA1QMAIewBAQDXAwAh7QEBANcDACHvAQAA2APvASLxAQAA2QPxASLyAQEA1wMAIfMBQADaAwAh9AFAANsDACH1AUAA2wMAIQIAAADJAgAgIQAA1QIAIA3nAQEA1QMAIegBAQDVAwAh6QEgANYDACHqAQEA1wMAIesBAQDVAwAh7AEBANcDACHtAQEA1wMAIe8BAADYA-8BIvEBAADZA_EBIvIBAQDXAwAh8wFAANoDACH0AUAA2wMAIfUBQADbAwAhAgAAAEIAICEAANcCACACAAAAQgAgIQAA1wIAIAMAAADJAgAgKAAA0AIAICkAANUCACABAAAAyQIAIAEAAABCACAICQAA0gMAIC4AANQDACAvAADTAwAg6gEAANEDACDsAQAA0QMAIO0BAADRAwAg8gEAANEDACDzAQAA0QMAIBDkAQAA4QIAMOUBAADeAgAQ5gEAAOECADDnAQEA4gIAIegBAQDiAgAh6QEgAOMCACHqAQEA5AIAIesBAQDiAgAh7AEBAOQCACHtAQEA5AIAIe8BAADlAu8BIvEBAADmAvEBIvIBAQDkAgAh8wFAAOcCACH0AUAA6AIAIfUBQADoAgAhAwAAAEIAIAEAAN0CADAtAADeAgAgAwAAAEIAIAEAAMwCADACAADJAgAgEOQBAADhAgAw5QEAAN4CABDmAQAA4QIAMOcBAQDiAgAh6AEBAOICACHpASAA4wIAIeoBAQDkAgAh6wEBAOICACHsAQEA5AIAIe0BAQDkAgAh7wEAAOUC7wEi8QEAAOYC8QEi8gEBAOQCACHzAUAA5wIAIfQBQADoAgAh9QFAAOgCACEOCQAA6gIAIC4AAPgCACAvAAD4AgAg9gEBAAAAAfcBAQAAAAT4AQEAAAAE-QEBAAAAAfoBAQAAAAH7AQEAAAAB_AEBAAAAAf0BAQD3AgAh_gEBAAAAAf8BAQAAAAGAAgEAAAABBQkAAOoCACAuAAD2AgAgLwAA9gIAIPYBIAAAAAH9ASAA9QIAIQ4JAADtAgAgLgAA9AIAIC8AAPQCACD2AQEAAAAB9wEBAAAABfgBAQAAAAX5AQEAAAAB-gEBAAAAAfsBAQAAAAH8AQEAAAAB_QEBAPMCACH-AQEAAAAB_wEBAAAAAYACAQAAAAEHCQAA6gIAIC4AAPICACAvAADyAgAg9gEAAADvAQL3AQAAAO8BCPgBAAAA7wEI_QEAAPEC7wEiBwkAAOoCACAuAADwAgAgLwAA8AIAIPYBAAAA8QEC9wEAAADxAQj4AQAAAPEBCP0BAADvAvEBIgsJAADtAgAgLgAA7gIAIC8AAO4CACD2AUAAAAAB9wFAAAAABfgBQAAAAAX5AUAAAAAB-gFAAAAAAfsBQAAAAAH8AUAAAAAB_QFAAOwCACELCQAA6gIAIC4AAOsCACAvAADrAgAg9gFAAAAAAfcBQAAAAAT4AUAAAAAE-QFAAAAAAfoBQAAAAAH7AUAAAAAB_AFAAAAAAf0BQADpAgAhCwkAAOoCACAuAADrAgAgLwAA6wIAIPYBQAAAAAH3AUAAAAAE-AFAAAAABPkBQAAAAAH6AUAAAAAB-wFAAAAAAfwBQAAAAAH9AUAA6QIAIQj2AQIAAAAB9wECAAAABPgBAgAAAAT5AQIAAAAB-gECAAAAAfsBAgAAAAH8AQIAAAAB_QECAOoCACEI9gFAAAAAAfcBQAAAAAT4AUAAAAAE-QFAAAAAAfoBQAAAAAH7AUAAAAAB_AFAAAAAAf0BQADrAgAhCwkAAO0CACAuAADuAgAgLwAA7gIAIPYBQAAAAAH3AUAAAAAF-AFAAAAABfkBQAAAAAH6AUAAAAAB-wFAAAAAAfwBQAAAAAH9AUAA7AIAIQj2AQIAAAAB9wECAAAABfgBAgAAAAX5AQIAAAAB-gECAAAAAfsBAgAAAAH8AQIAAAAB_QECAO0CACEI9gFAAAAAAfcBQAAAAAX4AUAAAAAF-QFAAAAAAfoBQAAAAAH7AUAAAAAB_AFAAAAAAf0BQADuAgAhBwkAAOoCACAuAADwAgAgLwAA8AIAIPYBAAAA8QEC9wEAAADxAQj4AQAAAPEBCP0BAADvAvEBIgT2AQAAAPEBAvcBAAAA8QEI-AEAAADxAQj9AQAA8ALxASIHCQAA6gIAIC4AAPICACAvAADyAgAg9gEAAADvAQL3AQAAAO8BCPgBAAAA7wEI_QEAAPEC7wEiBPYBAAAA7wEC9wEAAADvAQj4AQAAAO8BCP0BAADyAu8BIg4JAADtAgAgLgAA9AIAIC8AAPQCACD2AQEAAAAB9wEBAAAABfgBAQAAAAX5AQEAAAAB-gEBAAAAAfsBAQAAAAH8AQEAAAAB_QEBAPMCACH-AQEAAAAB_wEBAAAAAYACAQAAAAEL9gEBAAAAAfcBAQAAAAX4AQEAAAAF-QEBAAAAAfoBAQAAAAH7AQEAAAAB_AEBAAAAAf0BAQD0AgAh_gEBAAAAAf8BAQAAAAGAAgEAAAABBQkAAOoCACAuAAD2AgAgLwAA9gIAIPYBIAAAAAH9ASAA9QIAIQL2ASAAAAAB_QEgAPYCACEOCQAA6gIAIC4AAPgCACAvAAD4AgAg9gEBAAAAAfcBAQAAAAT4AQEAAAAE-QEBAAAAAfoBAQAAAAH7AQEAAAAB_AEBAAAAAf0BAQD3AgAh_gEBAAAAAf8BAQAAAAGAAgEAAAABC_YBAQAAAAH3AQEAAAAE-AEBAAAABPkBAQAAAAH6AQEAAAAB-wEBAAAAAfwBAQAAAAH9AQEA-AIAIf4BAQAAAAH_AQEAAAABgAIBAAAAARUEAACBAwAgCwAAggMAIAwAAIMDACANAACDAwAgDgAAhAMAIOQBAAD5AgAw5QEAAEIAEOYBAAD5AgAw5wEBAPwCACHoAQEA_AIAIekBIAD6AgAh6gEBAPsCACHrAQEA_AIAIewBAQD7AgAh7QEBAPsCACHvAQAA_QLvASLxAQAA_gLxASLyAQEA-wIAIfMBQAD_AgAh9AFAAIADACH1AUAAgAMAIQL2ASAAAAAB_QEgAPYCACEL9gEBAAAAAfcBAQAAAAX4AQEAAAAF-QEBAAAAAfoBAQAAAAH7AQEAAAAB_AEBAAAAAf0BAQD0AgAh_gEBAAAAAf8BAQAAAAGAAgEAAAABC_YBAQAAAAH3AQEAAAAE-AEBAAAABPkBAQAAAAH6AQEAAAAB-wEBAAAAAfwBAQAAAAH9AQEA-AIAIf4BAQAAAAH_AQEAAAABgAIBAAAAAQT2AQAAAO8BAvcBAAAA7wEI-AEAAADvAQj9AQAA8gLvASIE9gEAAADxAQL3AQAAAPEBCPgBAAAA8QEI_QEAAPAC8QEiCPYBQAAAAAH3AUAAAAAF-AFAAAAABfkBQAAAAAH6AUAAAAAB-wFAAAAAAfwBQAAAAAH9AUAA7gIAIQj2AUAAAAAB9wFAAAAABPgBQAAAAAT5AUAAAAAB-gFAAAAAAfsBQAAAAAH8AUAAAAAB_QFAAOsCACEDgQIAAAMAIIICAAADACCDAgAAAwAgA4ECAAAIACCCAgAACAAggwIAAAgAIAOBAgAAEwAgggIAABMAIIMCAAATACADgQIAABgAIIICAAAYACCDAgAAGAAgB-QBAACFAwAw5QEAAMYCABDmAQAAhQMAMPQBQADoAgAh9QFAAOgCACGEAgEA4gIAIYUCAQDiAgAhCuQBAACGAwAw5QEAALACABDmAQAAhgMAMOcBAQDiAgAh8wFAAOcCACH0AUAA6AIAIfUBQADoAgAhhgIBAOICACGHAgEA4gIAIYgCAQDkAgAhEOQBAACHAwAw5QEAAJoCABDmAQAAhwMAMOcBAQDiAgAh7wEAAIgDkAIi8wFAAOcCACH0AUAA6AIAIfUBQADoAgAhiAIBAOQCACGJAgEA4gIAIYoCAQDkAgAhiwIBAOQCACGMAgEA5AIAIY0CAQDkAgAhjgIBAOICACGRAgAAiQORAiIHCQAA6gIAIC4AAI0DACAvAACNAwAg9gEAAACQAgL3AQAAAJACCPgBAAAAkAII_QEAAIwDkAIiBwkAAOoCACAuAACLAwAgLwAAiwMAIPYBAAAAkQIC9wEAAACRAgj4AQAAAJECCP0BAACKA5ECIgcJAADqAgAgLgAAiwMAIC8AAIsDACD2AQAAAJECAvcBAAAAkQII-AEAAACRAgj9AQAAigORAiIE9gEAAACRAgL3AQAAAJECCPgBAAAAkQII_QEAAIsDkQIiBwkAAOoCACAuAACNAwAgLwAAjQMAIPYBAAAAkAIC9wEAAACQAgj4AQAAAJACCP0BAACMA5ACIgT2AQAAAJACAvcBAAAAkAII-AEAAACQAgj9AQAAjQOQAiIO5AEAAI4DADDlAQAA_AEAEOYBAACOAwAw5wEBAOICACHvAQAAkQOZAiL0AUAA6AIAIfUBQADoAgAhhgIBAOICACGSAgEA5AIAIZQCAACPA5QCIpUCAQDiAgAhlgIQAJADACGXAgEA4gIAIZkCAQDkAgAhBwkAAOoCACAuAACXAwAgLwAAlwMAIPYBAAAAlAIC9wEAAACUAgj4AQAAAJQCCP0BAACWA5QCIg0JAADqAgAgLgAAlQMAIC8AAJUDACCgAQAAlQMAIKEBAACVAwAg9gEQAAAAAfcBEAAAAAT4ARAAAAAE-QEQAAAAAfoBEAAAAAH7ARAAAAAB_AEQAAAAAf0BEACUAwAhBwkAAOoCACAuAACTAwAgLwAAkwMAIPYBAAAAmQIC9wEAAACZAgj4AQAAAJkCCP0BAACSA5kCIgcJAADqAgAgLgAAkwMAIC8AAJMDACD2AQAAAJkCAvcBAAAAmQII-AEAAACZAgj9AQAAkgOZAiIE9gEAAACZAgL3AQAAAJkCCPgBAAAAmQII_QEAAJMDmQIiDQkAAOoCACAuAACVAwAgLwAAlQMAIKABAACVAwAgoQEAAJUDACD2ARAAAAAB9wEQAAAABPgBEAAAAAT5ARAAAAAB-gEQAAAAAfsBEAAAAAH8ARAAAAAB_QEQAJQDACEI9gEQAAAAAfcBEAAAAAT4ARAAAAAE-QEQAAAAAfoBEAAAAAH7ARAAAAAB_AEQAAAAAf0BEACVAwAhBwkAAOoCACAuAACXAwAgLwAAlwMAIPYBAAAAlAIC9wEAAACUAgj4AQAAAJQCCP0BAACWA5QCIgT2AQAAAJQCAvcBAAAAlAII-AEAAACUAgj9AQAAlwOUAiIN5AEAAJgDADDlAQAA5AEAEOYBAACYAwAw5wEBAOICACHvAQAAmQOcAiL0AUAA6AIAIfUBQADoAgAhhgIBAOICACGSAgEA5AIAIZQCAACPA5QCIpoCAQDiAgAhnAJAAOcCACGdAkAA5wIAIQcJAADqAgAgLgAAmwMAIC8AAJsDACD2AQAAAJwCAvcBAAAAnAII-AEAAACcAgj9AQAAmgOcAiIHCQAA6gIAIC4AAJsDACAvAACbAwAg9gEAAACcAgL3AQAAAJwCCPgBAAAAnAII_QEAAJoDnAIiBPYBAAAAnAIC9wEAAACcAgj4AQAAAJwCCP0BAACbA5wCIg8DAACfAwAgEQAAoAMAIOQBAACcAwAw5QEAACgAEOYBAACcAwAw5wEBAPwCACHvAQAAnQOcAiL0AUAAgAMAIfUBQACAAwAhhgIBAPwCACGSAgEA-wIAIZQCAACeA5QCIpoCAQD8AgAhnAJAAP8CACGdAkAA_wIAIQT2AQAAAJwCAvcBAAAAnAII-AEAAACcAgj9AQAAmwOcAiIE9gEAAACUAgL3AQAAAJQCCPgBAAAAlAII_QEAAJcDlAIiEwQAAIEDACAIAACxAwAgDwAAsAMAIBEAAKADACASAACyAwAg5AEAAK8DADDlAQAAYQAQ5gEAAK8DADDnAQEA_AIAIfMBQAD_AgAh9AFAAIADACH1AUAAgAMAIYcCAQD8AgAhqAIBAPwCACGpAgEA-wIAIaoCAQD7AgAhqwIBAPsCACGzAgAAYQAgtAIAAGEAIAOBAgAAKgAgggIAACoAIIMCAAAqACAN5AEAAKEDADDlAQAAzAEAEOYBAAChAwAw5wEBAOICACHvAQAAogOgAiLzAUAA5wIAIfQBQADoAgAh9QFAAOgCACGHAgEA4gIAIYkCAQDiAgAhngIBAOQCACGgAkAA5wIAIaECQADnAgAhBwkAAOoCACAuAACkAwAgLwAApAMAIPYBAAAAoAIC9wEAAACgAgj4AQAAAKACCP0BAACjA6ACIgcJAADqAgAgLgAApAMAIC8AAKQDACD2AQAAAKACAvcBAAAAoAII-AEAAACgAgj9AQAAowOgAiIE9gEAAACgAgL3AQAAAKACCPgBAAAAoAII_QEAAKQDoAIiBuQBAAClAwAw5QEAALYBABDmAQAApQMAMIQCAQDiAgAhiQIBAOICACGiAkAA6AIAIQ3kAQAApgMAMOUBAACgAQAQ5gEAAKYDADDnAQEA4gIAIe8BAQDiAgAh8wFAAOcCACH0AUAA6AIAIfUBQADoAgAhhgIBAOICACGHAgEA4gIAIYgCAQDkAgAhowIBAOQCACGkAgEA5AIAIQrkAQAApwMAMOUBAACKAQAQ5gEAAKcDADDnAQEA4gIAIe8BAACpA6gCIvQBQADoAgAh9QFAAOgCACGFAgEA4gIAIYYCAQDiAgAhpgIAAKgDpgIiBwkAAOoCACAuAACtAwAgLwAArQMAIPYBAAAApgIC9wEAAACmAgj4AQAAAKYCCP0BAACsA6YCIgcJAADqAgAgLgAAqwMAIC8AAKsDACD2AQAAAKgCAvcBAAAAqAII-AEAAACoAgj9AQAAqgOoAiIHCQAA6gIAIC4AAKsDACAvAACrAwAg9gEAAACoAgL3AQAAAKgCCPgBAAAAqAII_QEAAKoDqAIiBPYBAAAAqAIC9wEAAACoAgj4AQAAAKgCCP0BAACrA6gCIgcJAADqAgAgLgAArQMAIC8AAK0DACD2AQAAAKYCAvcBAAAApgII-AEAAACmAgj9AQAArAOmAiIE9gEAAACmAgL3AQAAAKYCCPgBAAAApgII_QEAAK0DpgIiDOQBAACuAwAw5QEAAHQAEOYBAACuAwAw5wEBAOICACHzAUAA5wIAIfQBQADoAgAh9QFAAOgCACGHAgEA4gIAIagCAQDiAgAhqQIBAOQCACGqAgEA5AIAIasCAQDkAgAhEQQAAIEDACAIAACxAwAgDwAAsAMAIBEAAKADACASAACyAwAg5AEAAK8DADDlAQAAYQAQ5gEAAK8DADDnAQEA_AIAIfMBQAD_AgAh9AFAAIADACH1AUAAgAMAIYcCAQD8AgAhqAIBAPwCACGpAgEA-wIAIaoCAQD7AgAhqwIBAPsCACEDgQIAACAAIIICAAAgACCDAgAAIAAgA4ECAAAkACCCAgAAJAAggwIAACQAIBEDAACfAwAgEQAAoAMAIOQBAACcAwAw5QEAACgAEOYBAACcAwAw5wEBAPwCACHvAQAAnQOcAiL0AUAAgAMAIfUBQACAAwAhhgIBAPwCACGSAgEA-wIAIZQCAACeA5QCIpoCAQD8AgAhnAJAAP8CACGdAkAA_wIAIbMCAAAoACC0AgAAKAAgCuQBAACzAwAw5QEAAFsAEOYBAACzAwAw5wEBAOICACHzAUAA5wIAIfQBQADoAgAh9QFAAOgCACGsAgEA4gIAIa0CAQDiAgAhrgIBAOICACEPBgAAtgMAIBMAAIMDACDkAQAAtAMAMOUBAAA1ABDmAQAAtAMAMOcBAQD8AgAh7wEAALUDoAIi8wFAAP8CACH0AUAAgAMAIfUBQACAAwAhhwIBAPwCACGJAgEA_AIAIZ4CAQD7AgAhoAJAAP8CACGhAkAA_wIAIQT2AQAAAKACAvcBAAAAoAII-AEAAACgAgj9AQAApAOgAiITAwAAnwMAIA8AALwDACATAACDAwAgFAAAuwMAIOQBAAC6AwAw5QEAACQAEOYBAAC6AwAw5wEBAPwCACHvAQEA_AIAIfMBQAD_AgAh9AFAAIADACH1AUAAgAMAIYYCAQD8AgAhhwIBAPwCACGIAgEA-wIAIaMCAQD7AgAhpAIBAPsCACGzAgAAJAAgtAIAACQAIBADAACfAwAgEAAAsgMAIOQBAAC3AwAw5QEAACoAEOYBAAC3AwAw5wEBAPwCACHvAQAAuQOZAiL0AUAAgAMAIfUBQACAAwAhhgIBAPwCACGSAgEA-wIAIZQCAACeA5QCIpUCAQD8AgAhlgIQALgDACGXAgEA_AIAIZkCAQD7AgAhCPYBEAAAAAH3ARAAAAAE-AEQAAAABPkBEAAAAAH6ARAAAAAB-wEQAAAAAfwBEAAAAAH9ARAAlQMAIQT2AQAAAJkCAvcBAAAAmQII-AEAAACZAgj9AQAAkwOZAiIRAwAAnwMAIA8AALwDACATAACDAwAgFAAAuwMAIOQBAAC6AwAw5QEAACQAEOYBAAC6AwAw5wEBAPwCACHvAQEA_AIAIfMBQAD_AgAh9AFAAIADACH1AUAAgAMAIYYCAQD8AgAhhwIBAPwCACGIAgEA-wIAIaMCAQD7AgAhpAIBAPsCACEDgQIAADUAIIICAAA1ACCDAgAANQAgA4ECAAANACCCAgAADQAggwIAAA0AIAKGAgEAAAABhwIBAAAAAQ0DAACfAwAgBQAAggMAIAgAALwDACDkAQAAvgMAMOUBAAAgABDmAQAAvgMAMOcBAQD8AgAh8wFAAP8CACH0AUAAgAMAIfUBQACAAwAhhgIBAPwCACGHAgEA_AIAIYgCAQD7AgAhDBoAAMADACAbAADBAwAg5AEAAL8DADDlAQAAGAAQ5gEAAL8DADDnAQEA_AIAIfMBQAD_AgAh9AFAAIADACH1AUAAgAMAIawCAQD8AgAhrQIBAPwCACGuAgEA_AIAIRkGAAC2AwAgDgAAhAMAIBUAAMUDACAWAACDAwAgFwAAxgMAIBgAAMYDACAZAADHAwAg5AEAAMIDADDlAQAAEwAQ5gEAAMIDADDnAQEA_AIAIe8BAADDA5ACIvMBQAD_AgAh9AFAAIADACH1AUAAgAMAIYgCAQD7AgAhiQIBAPwCACGKAgEA-wIAIYsCAQD7AgAhjAIBAPsCACGNAgEA-wIAIY4CAQD8AgAhkQIAAMQDkQIiswIAABMAILQCAAATACAXBAAAgQMAIAsAAIIDACAMAACDAwAgDQAAgwMAIA4AAIQDACDkAQAA-QIAMOUBAABCABDmAQAA-QIAMOcBAQD8AgAh6AEBAPwCACHpASAA-gIAIeoBAQD7AgAh6wEBAPwCACHsAQEA-wIAIe0BAQD7AgAh7wEAAP0C7wEi8QEAAP4C8QEi8gEBAPsCACHzAUAA_wIAIfQBQACAAwAh9QFAAIADACGzAgAAQgAgtAIAAEIAIBcGAAC2AwAgDgAAhAMAIBUAAMUDACAWAACDAwAgFwAAxgMAIBgAAMYDACAZAADHAwAg5AEAAMIDADDlAQAAEwAQ5gEAAMIDADDnAQEA_AIAIe8BAADDA5ACIvMBQAD_AgAh9AFAAIADACH1AUAAgAMAIYgCAQD7AgAhiQIBAPwCACGKAgEA-wIAIYsCAQD7AgAhjAIBAPsCACGNAgEA-wIAIY4CAQD8AgAhkQIAAMQDkQIiBPYBAAAAkAIC9wEAAACQAgj4AQAAAJACCP0BAACNA5ACIgT2AQAAAJECAvcBAAAAkQII-AEAAACRAgj9AQAAiwORAiIZBgAAtgMAIA4AAIQDACAVAADFAwAgFgAAgwMAIBcAAMYDACAYAADGAwAgGQAAxwMAIOQBAADCAwAw5QEAABMAEOYBAADCAwAw5wEBAPwCACHvAQAAwwOQAiLzAUAA_wIAIfQBQACAAwAh9QFAAIADACGIAgEA-wIAIYkCAQD8AgAhigIBAPsCACGLAgEA-wIAIYwCAQD7AgAhjQIBAPsCACGOAgEA_AIAIZECAADEA5ECIrMCAAATACC0AgAAEwAgFwQAAIEDACALAACCAwAgDAAAgwMAIA0AAIMDACAOAACEAwAg5AEAAPkCADDlAQAAQgAQ5gEAAPkCADDnAQEA_AIAIegBAQD8AgAh6QEgAPoCACHqAQEA-wIAIesBAQD8AgAh7AEBAPsCACHtAQEA-wIAIe8BAAD9Au8BIvEBAAD-AvEBIvIBAQD7AgAh8wFAAP8CACH0AUAAgAMAIfUBQACAAwAhswIAAEIAILQCAABCACARBgAAtgMAIBMAAIMDACDkAQAAtAMAMOUBAAA1ABDmAQAAtAMAMOcBAQD8AgAh7wEAALUDoAIi8wFAAP8CACH0AUAAgAMAIfUBQACAAwAhhwIBAPwCACGJAgEA_AIAIZ4CAQD7AgAhoAJAAP8CACGhAkAA_wIAIbMCAAA1ACC0AgAANQAgAoQCAQAAAAGJAgEAAAABCAYAALYDACAHAADKAwAg5AEAAMkDADDlAQAADQAQ5gEAAMkDADCEAgEA_AIAIYkCAQD8AgAhogJAAIADACEPAwAAnwMAIAUAAIIDACAIAAC8AwAg5AEAAL4DADDlAQAAIAAQ5gEAAL4DADDnAQEA_AIAIfMBQAD_AgAh9AFAAIADACH1AUAAgAMAIYYCAQD8AgAhhwIBAPwCACGIAgEA-wIAIbMCAAAgACC0AgAAIAAgAoQCAQAAAAGFAgEAAAABCQcAAMoDACAKAADBAwAg5AEAAMwDADDlAQAACAAQ5gEAAMwDADD0AUAAgAMAIfUBQACAAwAhhAIBAPwCACGFAgEA_AIAIQKFAgEAAAABhgIBAAAAAQwDAACfAwAgCgAAwQMAIOQBAADOAwAw5QEAAAMAEOYBAADOAwAw5wEBAPwCACHvAQAA0AOoAiL0AUAAgAMAIfUBQACAAwAhhQIBAPwCACGGAgEA_AIAIaYCAADPA6YCIgT2AQAAAKYCAvcBAAAApgII-AEAAACmAgj9AQAArQOmAiIE9gEAAACoAgL3AQAAAKgCCPgBAAAAqAII_QEAAKsDqAIiAAAAAAG4AgEAAAABAbgCIAAAAAEBuAIBAAAAAQG4AgAAAO8BAgG4AgAAAPEBAgG4AkAAAAABAbgCQAAAAAELKAAAtgQAMCkAALsEADC1AgAAtwQAMLYCAAC4BAAwtwIAALkEACC4AgAAugQAMLkCAAC6BAAwugIAALoEADC7AgAAugQAMLwCAAC8BAAwvQIAAL0EADALKAAAqAQAMCkAAK0EADC1AgAAqQQAMLYCAACqBAAwtwIAAKsEACC4AgAArAQAMLkCAACsBAAwugIAAKwEADC7AgAArAQAMLwCAACuBAAwvQIAAK8EADALKAAAnwQAMCkAAKMEADC1AgAAoAQAMLYCAAChBAAwtwIAAKIEACC4AgAA8wMAMLkCAADzAwAwugIAAPMDADC7AgAA8wMAMLwCAACkBAAwvQIAAPYDADALKAAA7wMAMCkAAPQDADC1AgAA8AMAMLYCAADxAwAwtwIAAPIDACC4AgAA8wMAMLkCAADzAwAwugIAAPMDADC7AgAA8wMAMLwCAAD1AwAwvQIAAPYDADALKAAA4QMAMCkAAOYDADC1AgAA4gMAMLYCAADjAwAwtwIAAOQDACC4AgAA5QMAMLkCAADlAwAwugIAAOUDADC7AgAA5QMAMLwCAADnAwAwvQIAAOgDADAHGgAA7gMAIOcBAQAAAAHzAUAAAAAB9AFAAAAAAfUBQAAAAAGsAgEAAAABrgIBAAAAAQIAAAABACAoAADtAwAgAwAAAAEAICgAAO0DACApAADrAwAgASEAAJYHADAMGgAAwAMAIBsAAMEDACDkAQAAvwMAMOUBAAAYABDmAQAAvwMAMOcBAQAAAAHzAUAA_wIAIfQBQACAAwAh9QFAAIADACGsAgEA_AIAIa0CAQD8AgAhrgIBAPwCACECAAAAAQAgIQAA6wMAIAIAAADpAwAgIQAA6gMAIArkAQAA6AMAMOUBAADpAwAQ5gEAAOgDADDnAQEA_AIAIfMBQAD_AgAh9AFAAIADACH1AUAAgAMAIawCAQD8AgAhrQIBAPwCACGuAgEA_AIAIQrkAQAA6AMAMOUBAADpAwAQ5gEAAOgDADDnAQEA_AIAIfMBQAD_AgAh9AFAAIADACH1AUAAgAMAIawCAQD8AgAhrQIBAPwCACGuAgEA_AIAIQbnAQEA1QMAIfMBQADaAwAh9AFAANsDACH1AUAA2wMAIawCAQDVAwAhrgIBANUDACEHGgAA7AMAIOcBAQDVAwAh8wFAANoDACH0AUAA2wMAIfUBQADbAwAhrAIBANUDACGuAgEA1QMAIQUoAACRBwAgKQAAlAcAILUCAACSBwAgtgIAAJMHACC7AgAAFQAgBxoAAO4DACDnAQEAAAAB8wFAAAAAAfQBQAAAAAH1AUAAAAABrAIBAAAAAa4CAQAAAAEDKAAAkQcAILUCAACSBwAguwIAABUAIBIGAACXBAAgDgAAnAQAIBUAAJ4EACAWAACYBAAgFwAAmQQAIBkAAJsEACDnAQEAAAAB7wEAAACQAgLzAUAAAAAB9AFAAAAAAfUBQAAAAAGIAgEAAAABiQIBAAAAAYoCAQAAAAGLAgEAAAABjAIBAAAAAY4CAQAAAAGRAgAAAJECAgIAAAAVACAoAACdBAAgAwAAABUAICgAAJ0EACApAAD7AwAgASEAAJAHADAXBgAAtgMAIA4AAIQDACAVAADFAwAgFgAAgwMAIBcAAMYDACAYAADGAwAgGQAAxwMAIOQBAADCAwAw5QEAABMAEOYBAADCAwAw5wEBAAAAAe8BAADDA5ACIvMBQAD_AgAh9AFAAIADACH1AUAAgAMAIYgCAQD7AgAhiQIBAPwCACGKAgEA-wIAIYsCAQD7AgAhjAIBAPsCACGNAgEA-wIAIY4CAQD8AgAhkQIAAMQDkQIiAgAAABUAICEAAPsDACACAAAA9wMAICEAAPgDACAQ5AEAAPYDADDlAQAA9wMAEOYBAAD2AwAw5wEBAPwCACHvAQAAwwOQAiLzAUAA_wIAIfQBQACAAwAh9QFAAIADACGIAgEA-wIAIYkCAQD8AgAhigIBAPsCACGLAgEA-wIAIYwCAQD7AgAhjQIBAPsCACGOAgEA_AIAIZECAADEA5ECIhDkAQAA9gMAMOUBAAD3AwAQ5gEAAPYDADDnAQEA_AIAIe8BAADDA5ACIvMBQAD_AgAh9AFAAIADACH1AUAAgAMAIYgCAQD7AgAhiQIBAPwCACGKAgEA-wIAIYsCAQD7AgAhjAIBAPsCACGNAgEA-wIAIY4CAQD8AgAhkQIAAMQDkQIiDOcBAQDVAwAh7wEAAPkDkAIi8wFAANoDACH0AUAA2wMAIfUBQADbAwAhiAIBANcDACGJAgEA1QMAIYoCAQDXAwAhiwIBANcDACGMAgEA1wMAIY4CAQDVAwAhkQIAAPoDkQIiAbgCAAAAkAICAbgCAAAAkQICEgYAAPwDACAOAACBBAAgFQAA_QMAIBYAAP4DACAXAAD_AwAgGQAAgAQAIOcBAQDVAwAh7wEAAPkDkAIi8wFAANoDACH0AUAA2wMAIfUBQADbAwAhiAIBANcDACGJAgEA1QMAIYoCAQDXAwAhiwIBANcDACGMAgEA1wMAIY4CAQDVAwAhkQIAAPoDkQIiBSgAAPgGACApAACOBwAgtQIAAPkGACC2AgAAjQcAILsCAAAmACAHKAAA8AYAICkAAIsHACC1AgAA8QYAILYCAACKBwAguQIAABMAILoCAAATACC7AgAAFQAgCygAAI0EADApAACRBAAwtQIAAI4EADC2AgAAjwQAMLcCAACQBAAguAIAAPMDADC5AgAA8wMAMLoCAADzAwAwuwIAAPMDADC8AgAAkgQAML0CAAD2AwAwBygAAPYGACApAACIBwAgtQIAAPcGACC2AgAAhwcAILkCAABCACC6AgAAQgAguwIAAMkCACAHKAAA8gYAICkAAIUHACC1AgAA8wYAILYCAACEBwAguQIAADUAILoCAAA1ACC7AgAANwAgCygAAIIEADApAACGBAAwtQIAAIMEADC2AgAAhAQAMLcCAACFBAAguAIAAOUDADC5AgAA5QMAMLoCAADlAwAwuwIAAOUDADC8AgAAhwQAML0CAADoAwAwBxsAAIwEACDnAQEAAAAB8wFAAAAAAfQBQAAAAAH1AUAAAAABrQIBAAAAAa4CAQAAAAECAAAAAQAgKAAAiwQAIAMAAAABACAoAACLBAAgKQAAiQQAIAEhAACDBwAwAgAAAAEAICEAAIkEACACAAAA6QMAICEAAIgEACAG5wEBANUDACHzAUAA2gMAIfQBQADbAwAh9QFAANsDACGtAgEA1QMAIa4CAQDVAwAhBxsAAIoEACDnAQEA1QMAIfMBQADaAwAh9AFAANsDACH1AUAA2wMAIa0CAQDVAwAhrgIBANUDACEFKAAA_gYAICkAAIEHACC1AgAA_wYAILYCAACABwAguwIAAMkCACAHGwAAjAQAIOcBAQAAAAHzAUAAAAAB9AFAAAAAAfUBQAAAAAGtAgEAAAABrgIBAAAAAQMoAAD-BgAgtQIAAP8GACC7AgAAyQIAIBIGAACXBAAgDgAAnAQAIBYAAJgEACAXAACZBAAgGAAAmgQAIBkAAJsEACDnAQEAAAAB7wEAAACQAgLzAUAAAAAB9AFAAAAAAfUBQAAAAAGIAgEAAAABiQIBAAAAAYoCAQAAAAGMAgEAAAABjQIBAAAAAY4CAQAAAAGRAgAAAJECAgIAAAAVACAoAACWBAAgAwAAABUAICgAAJYEACApAACUBAAgASEAAP0GADACAAAAFQAgIQAAlAQAIAIAAAD3AwAgIQAAkwQAIAznAQEA1QMAIe8BAAD5A5ACIvMBQADaAwAh9AFAANsDACH1AUAA2wMAIYgCAQDXAwAhiQIBANUDACGKAgEA1wMAIYwCAQDXAwAhjQIBANcDACGOAgEA1QMAIZECAAD6A5ECIhIGAAD8AwAgDgAAgQQAIBYAAP4DACAXAAD_AwAgGAAAlQQAIBkAAIAEACDnAQEA1QMAIe8BAAD5A5ACIvMBQADaAwAh9AFAANsDACH1AUAA2wMAIYgCAQDXAwAhiQIBANUDACGKAgEA1wMAIYwCAQDXAwAhjQIBANcDACGOAgEA1QMAIZECAAD6A5ECIgcoAAD0BgAgKQAA-wYAILUCAAD1BgAgtgIAAPoGACC5AgAAQgAgugIAAEIAILsCAADJAgAgEgYAAJcEACAOAACcBAAgFgAAmAQAIBcAAJkEACAYAACaBAAgGQAAmwQAIOcBAQAAAAHvAQAAAJACAvMBQAAAAAH0AUAAAAAB9QFAAAAAAYgCAQAAAAGJAgEAAAABigIBAAAAAYwCAQAAAAGNAgEAAAABjgIBAAAAAZECAAAAkQICAygAAPgGACC1AgAA-QYAILsCAAAmACAEKAAAjQQAMLUCAACOBAAwtwIAAJAEACC7AgAA8wMAMAMoAAD2BgAgtQIAAPcGACC7AgAAyQIAIAMoAAD0BgAgtQIAAPUGACC7AgAAyQIAIAMoAADyBgAgtQIAAPMGACC7AgAANwAgBCgAAIIEADC1AgAAgwQAMLcCAACFBAAguwIAAOUDADASBgAAlwQAIA4AAJwEACAVAACeBAAgFgAAmAQAIBcAAJkEACAZAACbBAAg5wEBAAAAAe8BAAAAkAIC8wFAAAAAAfQBQAAAAAH1AUAAAAABiAIBAAAAAYkCAQAAAAGKAgEAAAABiwIBAAAAAYwCAQAAAAGOAgEAAAABkQIAAACRAgIDKAAA8AYAILUCAADxBgAguwIAABUAIBIGAACXBAAgDgAAnAQAIBUAAJ4EACAWAACYBAAgGAAAmgQAIBkAAJsEACDnAQEAAAAB7wEAAACQAgLzAUAAAAAB9AFAAAAAAfUBQAAAAAGIAgEAAAABiQIBAAAAAYoCAQAAAAGLAgEAAAABjQIBAAAAAY4CAQAAAAGRAgAAAJECAgIAAAAVACAoAACnBAAgAwAAABUAICgAAKcEACApAACmBAAgASEAAO8GADACAAAAFQAgIQAApgQAIAIAAAD3AwAgIQAApQQAIAznAQEA1QMAIe8BAAD5A5ACIvMBQADaAwAh9AFAANsDACH1AUAA2wMAIYgCAQDXAwAhiQIBANUDACGKAgEA1wMAIYsCAQDXAwAhjQIBANcDACGOAgEA1QMAIZECAAD6A5ECIhIGAAD8AwAgDgAAgQQAIBUAAP0DACAWAAD-AwAgGAAAlQQAIBkAAIAEACDnAQEA1QMAIe8BAAD5A5ACIvMBQADaAwAh9AFAANsDACH1AUAA2wMAIYgCAQDXAwAhiQIBANUDACGKAgEA1wMAIYsCAQDXAwAhjQIBANcDACGOAgEA1QMAIZECAAD6A5ECIhIGAACXBAAgDgAAnAQAIBUAAJ4EACAWAACYBAAgGAAAmgQAIBkAAJsEACDnAQEAAAAB7wEAAACQAgLzAUAAAAAB9AFAAAAAAfUBQAAAAAGIAgEAAAABiQIBAAAAAYoCAQAAAAGLAgEAAAABjQIBAAAAAY4CAQAAAAGRAgAAAJECAgQHAAC1BAAg9AFAAAAAAfUBQAAAAAGEAgEAAAABAgAAAAoAICgAALQEACADAAAACgAgKAAAtAQAICkAALIEACABIQAA7gYAMAoHAADKAwAgCgAAwQMAIOQBAADMAwAw5QEAAAgAEOYBAADMAwAw9AFAAIADACH1AUAAgAMAIYQCAQD8AgAhhQIBAPwCACGxAgAAywMAIAIAAAAKACAhAACyBAAgAgAAALAEACAhAACxBAAgB-QBAACvBAAw5QEAALAEABDmAQAArwQAMPQBQACAAwAh9QFAAIADACGEAgEA_AIAIYUCAQD8AgAhB-QBAACvBAAw5QEAALAEABDmAQAArwQAMPQBQACAAwAh9QFAAIADACGEAgEA_AIAIYUCAQD8AgAhA_QBQADbAwAh9QFAANsDACGEAgEA1QMAIQQHAACzBAAg9AFAANsDACH1AUAA2wMAIYQCAQDVAwAhBSgAAOkGACApAADsBgAgtQIAAOoGACC2AgAA6wYAILsCAAAiACAEBwAAtQQAIPQBQAAAAAH1AUAAAAABhAIBAAAAAQMoAADpBgAgtQIAAOoGACC7AgAAIgAgBwMAAMUEACDnAQEAAAAB7wEAAACoAgL0AUAAAAAB9QFAAAAAAYYCAQAAAAGmAgAAAKYCAgIAAAAFACAoAADEBAAgAwAAAAUAICgAAMQEACApAADCBAAgASEAAOgGADANAwAAnwMAIAoAAMEDACDkAQAAzgMAMOUBAAADABDmAQAAzgMAMOcBAQAAAAHvAQAA0AOoAiL0AUAAgAMAIfUBQACAAwAhhQIBAPwCACGGAgEA_AIAIaYCAADPA6YCIrICAADNAwAgAgAAAAUAICEAAMIEACACAAAAvgQAICEAAL8EACAK5AEAAL0EADDlAQAAvgQAEOYBAAC9BAAw5wEBAPwCACHvAQAA0AOoAiL0AUAAgAMAIfUBQACAAwAhhQIBAPwCACGGAgEA_AIAIaYCAADPA6YCIgrkAQAAvQQAMOUBAAC-BAAQ5gEAAL0EADDnAQEA_AIAIe8BAADQA6gCIvQBQACAAwAh9QFAAIADACGFAgEA_AIAIYYCAQD8AgAhpgIAAM8DpgIiBucBAQDVAwAh7wEAAMEEqAIi9AFAANsDACH1AUAA2wMAIYYCAQDVAwAhpgIAAMAEpgIiAbgCAAAApgICAbgCAAAAqAICBwMAAMMEACDnAQEA1QMAIe8BAADBBKgCIvQBQADbAwAh9QFAANsDACGGAgEA1QMAIaYCAADABKYCIgUoAADjBgAgKQAA5gYAILUCAADkBgAgtgIAAOUGACC7AgAAXgAgBwMAAMUEACDnAQEAAAAB7wEAAACoAgL0AUAAAAAB9QFAAAAAAYYCAQAAAAGmAgAAAKYCAgMoAADjBgAgtQIAAOQGACC7AgAAXgAgBCgAALYEADC1AgAAtwQAMLcCAAC5BAAguwIAALoEADAEKAAAqAQAMLUCAACpBAAwtwIAAKsEACC7AgAArAQAMAQoAACfBAAwtQIAAKAEADC3AgAAogQAILsCAADzAwAwBCgAAO8DADC1AgAA8AMAMLcCAADyAwAguwIAAPMDADAEKAAA4QMAMLUCAADiAwAwtwIAAOQDACC7AgAA5QMAMAAAAAAAAAAFKAAA3gYAICkAAOEGACC1AgAA3wYAILYCAADgBgAguwIAAMkCACADKAAA3gYAILUCAADfBgAguwIAAMkCACAAAAAFKAAA0gYAICkAANwGACC1AgAA0wYAILYCAADbBgAguwIAAF4AIAsoAADoBAAwKQAA7AQAMLUCAADpBAAwtgIAAOoEADC3AgAA6wQAILgCAACsBAAwuQIAAKwEADC6AgAArAQAMLsCAACsBAAwvAIAAO0EADC9AgAArwQAMAsoAADaBAAwKQAA3wQAMLUCAADbBAAwtgIAANwEADC3AgAA3QQAILgCAADeBAAwuQIAAN4EADC6AgAA3gQAMLsCAADeBAAwvAIAAOAEADC9AgAA4QQAMAMGAADnBAAgiQIBAAAAAaICQAAAAAECAAAADwAgKAAA5gQAIAMAAAAPACAoAADmBAAgKQAA5AQAIAEhAADaBgAwCQYAALYDACAHAADKAwAg5AEAAMkDADDlAQAADQAQ5gEAAMkDADCEAgEA_AIAIYkCAQD8AgAhogJAAIADACGwAgAAyAMAIAIAAAAPACAhAADkBAAgAgAAAOIEACAhAADjBAAgBuQBAADhBAAw5QEAAOIEABDmAQAA4QQAMIQCAQD8AgAhiQIBAPwCACGiAkAAgAMAIQbkAQAA4QQAMOUBAADiBAAQ5gEAAOEEADCEAgEA_AIAIYkCAQD8AgAhogJAAIADACECiQIBANUDACGiAkAA2wMAIQMGAADlBAAgiQIBANUDACGiAkAA2wMAIQUoAADVBgAgKQAA2AYAILUCAADWBgAgtgIAANcGACC7AgAAJgAgAwYAAOcEACCJAgEAAAABogJAAAAAAQMoAADVBgAgtQIAANYGACC7AgAAJgAgBAoAANMEACD0AUAAAAAB9QFAAAAAAYUCAQAAAAECAAAACgAgKAAA8AQAIAMAAAAKACAoAADwBAAgKQAA7wQAIAEhAADUBgAwAgAAAAoAICEAAO8EACACAAAAsAQAICEAAO4EACAD9AFAANsDACH1AUAA2wMAIYUCAQDVAwAhBAoAANIEACD0AUAA2wMAIfUBQADbAwAhhQIBANUDACEECgAA0wQAIPQBQAAAAAH1AUAAAAABhQIBAAAAAQMoAADSBgAgtQIAANMGACC7AgAAXgAgBCgAAOgEADC1AgAA6QQAMLcCAADrBAAguwIAAKwEADAEKAAA2gQAMLUCAADbBAAwtwIAAN0EACC7AgAA3gQAMAAAAAAAAAAAAbgCAAAAlAICBbgCEAAAAAG-AhAAAAABvwIQAAAAAcACEAAAAAHBAhAAAAABAbgCAAAAmQICBSgAAMoGACApAADQBgAgtQIAAMsGACC2AgAAzwYAILsCAABeACAHKAAAyAYAICkAAM0GACC1AgAAyQYAILYCAADMBgAguQIAACgAILoCAAAoACC7AgAAzwEAIAMoAADKBgAgtQIAAMsGACC7AgAAXgAgAygAAMgGACC1AgAAyQYAILsCAADPAQAgAAAAAbgCAAAAnAICBSgAAMIGACApAADGBgAgtQIAAMMGACC2AgAAxQYAILsCAABeACALKAAAiQUAMCkAAI4FADC1AgAAigUAMLYCAACLBQAwtwIAAIwFACC4AgAAjQUAMLkCAACNBQAwugIAAI0FADC7AgAAjQUAMLwCAACPBQAwvQIAAJAFADALAwAAgQUAIOcBAQAAAAHvAQAAAJkCAvQBQAAAAAH1AUAAAAABhgIBAAAAAZQCAAAAlAIClQIBAAAAAZYCEAAAAAGXAgEAAAABmQIBAAAAAQIAAAAsACAoAACUBQAgAwAAACwAICgAAJQFACApAACTBQAgASEAAMQGADAQAwAAnwMAIBAAALIDACDkAQAAtwMAMOUBAAAqABDmAQAAtwMAMOcBAQAAAAHvAQAAuQOZAiL0AUAAgAMAIfUBQACAAwAhhgIBAPwCACGSAgEA-wIAIZQCAACeA5QCIpUCAQAAAAGWAhAAuAMAIZcCAQD8AgAhmQIBAPsCACECAAAALAAgIQAAkwUAIAIAAACRBQAgIQAAkgUAIA7kAQAAkAUAMOUBAACRBQAQ5gEAAJAFADDnAQEA_AIAIe8BAAC5A5kCIvQBQACAAwAh9QFAAIADACGGAgEA_AIAIZICAQD7AgAhlAIAAJ4DlAIilQIBAPwCACGWAhAAuAMAIZcCAQD8AgAhmQIBAPsCACEO5AEAAJAFADDlAQAAkQUAEOYBAACQBQAw5wEBAPwCACHvAQAAuQOZAiL0AUAAgAMAIfUBQACAAwAhhgIBAPwCACGSAgEA-wIAIZQCAACeA5QCIpUCAQD8AgAhlgIQALgDACGXAgEA_AIAIZkCAQD7AgAhCucBAQDVAwAh7wEAAP4EmQIi9AFAANsDACH1AUAA2wMAIYYCAQDVAwAhlAIAAPwElAIilQIBANUDACGWAhAA_QQAIZcCAQDVAwAhmQIBANcDACELAwAA_wQAIOcBAQDVAwAh7wEAAP4EmQIi9AFAANsDACH1AUAA2wMAIYYCAQDVAwAhlAIAAPwElAIilQIBANUDACGWAhAA_QQAIZcCAQDVAwAhmQIBANcDACELAwAAgQUAIOcBAQAAAAHvAQAAAJkCAvQBQAAAAAH1AUAAAAABhgIBAAAAAZQCAAAAlAIClQIBAAAAAZYCEAAAAAGXAgEAAAABmQIBAAAAAQMoAADCBgAgtQIAAMMGACC7AgAAXgAgBCgAAIkFADC1AgAAigUAMLcCAACMBQAguwIAAI0FADAJBAAAywQAIAgAAJoGACAPAACZBgAgEQAAmAUAIBIAAJsGACDzAQAA0QMAIKkCAADRAwAgqgIAANEDACCrAgAA0QMAIAAAAAABuAIAAACgAgIFKAAAvAYAICkAAMAGACC1AgAAvQYAILYCAAC_BgAguwIAACYAIAsoAACfBQAwKQAAowUAMLUCAACgBQAwtgIAAKEFADC3AgAAogUAILgCAADzAwAwuQIAAPMDADC6AgAA8wMAMLsCAADzAwAwvAIAAKQFADC9AgAA9gMAMBIGAACXBAAgDgAAnAQAIBUAAJ4EACAWAACYBAAgFwAAmQQAIBgAAJoEACDnAQEAAAAB7wEAAACQAgLzAUAAAAAB9AFAAAAAAfUBQAAAAAGIAgEAAAABiQIBAAAAAYsCAQAAAAGMAgEAAAABjQIBAAAAAY4CAQAAAAGRAgAAAJECAgIAAAAVACAoAACnBQAgAwAAABUAICgAAKcFACApAACmBQAgASEAAL4GADACAAAAFQAgIQAApgUAIAIAAAD3AwAgIQAApQUAIAznAQEA1QMAIe8BAAD5A5ACIvMBQADaAwAh9AFAANsDACH1AUAA2wMAIYgCAQDXAwAhiQIBANUDACGLAgEA1wMAIYwCAQDXAwAhjQIBANcDACGOAgEA1QMAIZECAAD6A5ECIhIGAAD8AwAgDgAAgQQAIBUAAP0DACAWAAD-AwAgFwAA_wMAIBgAAJUEACDnAQEA1QMAIe8BAAD5A5ACIvMBQADaAwAh9AFAANsDACH1AUAA2wMAIYgCAQDXAwAhiQIBANUDACGLAgEA1wMAIYwCAQDXAwAhjQIBANcDACGOAgEA1QMAIZECAAD6A5ECIhIGAACXBAAgDgAAnAQAIBUAAJ4EACAWAACYBAAgFwAAmQQAIBgAAJoEACDnAQEAAAAB7wEAAACQAgLzAUAAAAAB9AFAAAAAAfUBQAAAAAGIAgEAAAABiQIBAAAAAYsCAQAAAAGMAgEAAAABjQIBAAAAAY4CAQAAAAGRAgAAAJECAgMoAAC8BgAgtQIAAL0GACC7AgAAJgAgBCgAAJ8FADC1AgAAoAUAMLcCAACiBQAguwIAAPMDADAAAAAFKAAAtwYAICkAALoGACC1AgAAuAYAILYCAAC5BgAguwIAACIAIAMoAAC3BgAgtQIAALgGACC7AgAAIgAgAAAABSgAAK8GACApAAC1BgAgtQIAALAGACC2AgAAtAYAILsCAABeACALKAAAyAUAMCkAAM0FADC1AgAAyQUAMLYCAADKBQAwtwIAAMsFACC4AgAAzAUAMLkCAADMBQAwugIAAMwFADC7AgAAzAUAMLwCAADOBQAwvQIAAM8FADALKAAAvwUAMCkAAMMFADC1AgAAwAUAMLYCAADBBQAwtwIAAMIFACC4AgAA3gQAMLkCAADeBAAwugIAAN4EADC7AgAA3gQAMLwCAADEBQAwvQIAAOEEADALKAAAtgUAMCkAALoFADC1AgAAtwUAMLYCAAC4BQAwtwIAALkFACC4AgAA8wMAMLkCAADzAwAwugIAAPMDADC7AgAA8wMAMLwCAAC7BQAwvQIAAPYDADASDgAAnAQAIBUAAJ4EACAWAACYBAAgFwAAmQQAIBgAAJoEACAZAACbBAAg5wEBAAAAAe8BAAAAkAIC8wFAAAAAAfQBQAAAAAH1AUAAAAABiAIBAAAAAYoCAQAAAAGLAgEAAAABjAIBAAAAAY0CAQAAAAGOAgEAAAABkQIAAACRAgICAAAAFQAgKAAAvgUAIAMAAAAVACAoAAC-BQAgKQAAvQUAIAEhAACzBgAwAgAAABUAICEAAL0FACACAAAA9wMAICEAALwFACAM5wEBANUDACHvAQAA-QOQAiLzAUAA2gMAIfQBQADbAwAh9QFAANsDACGIAgEA1wMAIYoCAQDXAwAhiwIBANcDACGMAgEA1wMAIY0CAQDXAwAhjgIBANUDACGRAgAA-gORAiISDgAAgQQAIBUAAP0DACAWAAD-AwAgFwAA_wMAIBgAAJUEACAZAACABAAg5wEBANUDACHvAQAA-QOQAiLzAUAA2gMAIfQBQADbAwAh9QFAANsDACGIAgEA1wMAIYoCAQDXAwAhiwIBANcDACGMAgEA1wMAIY0CAQDXAwAhjgIBANUDACGRAgAA-gORAiISDgAAnAQAIBUAAJ4EACAWAACYBAAgFwAAmQQAIBgAAJoEACAZAACbBAAg5wEBAAAAAe8BAAAAkAIC8wFAAAAAAfQBQAAAAAH1AUAAAAABiAIBAAAAAYoCAQAAAAGLAgEAAAABjAIBAAAAAY0CAQAAAAGOAgEAAAABkQIAAACRAgIDBwAArgUAIIQCAQAAAAGiAkAAAAABAgAAAA8AICgAAMcFACADAAAADwAgKAAAxwUAICkAAMYFACABIQAAsgYAMAIAAAAPACAhAADGBQAgAgAAAOIEACAhAADFBQAgAoQCAQDVAwAhogJAANsDACEDBwAArQUAIIQCAQDVAwAhogJAANsDACEDBwAArgUAIIQCAQAAAAGiAkAAAAABChMAAKkFACDnAQEAAAAB7wEAAACgAgLzAUAAAAAB9AFAAAAAAfUBQAAAAAGHAgEAAAABngIBAAAAAaACQAAAAAGhAkAAAAABAgAAADcAICgAANMFACADAAAANwAgKAAA0wUAICkAANIFACABIQAAsQYAMA8GAAC2AwAgEwAAgwMAIOQBAAC0AwAw5QEAADUAEOYBAAC0AwAw5wEBAAAAAe8BAAC1A6ACIvMBQAD_AgAh9AFAAIADACH1AUAAgAMAIYcCAQD8AgAhiQIBAPwCACGeAgEA-wIAIaACQAD_AgAhoQJAAP8CACECAAAANwAgIQAA0gUAIAIAAADQBQAgIQAA0QUAIA3kAQAAzwUAMOUBAADQBQAQ5gEAAM8FADDnAQEA_AIAIe8BAAC1A6ACIvMBQAD_AgAh9AFAAIADACH1AUAAgAMAIYcCAQD8AgAhiQIBAPwCACGeAgEA-wIAIaACQAD_AgAhoQJAAP8CACEN5AEAAM8FADDlAQAA0AUAEOYBAADPBQAw5wEBAPwCACHvAQAAtQOgAiLzAUAA_wIAIfQBQACAAwAh9QFAAIADACGHAgEA_AIAIYkCAQD8AgAhngIBAPsCACGgAkAA_wIAIaECQAD_AgAhCecBAQDVAwAh7wEAAJwFoAIi8wFAANoDACH0AUAA2wMAIfUBQADbAwAhhwIBANUDACGeAgEA1wMAIaACQADaAwAhoQJAANoDACEKEwAAngUAIOcBAQDVAwAh7wEAAJwFoAIi8wFAANoDACH0AUAA2wMAIfUBQADbAwAhhwIBANUDACGeAgEA1wMAIaACQADaAwAhoQJAANoDACEKEwAAqQUAIOcBAQAAAAHvAQAAAKACAvMBQAAAAAH0AUAAAAAB9QFAAAAAAYcCAQAAAAGeAgEAAAABoAJAAAAAAaECQAAAAAEDKAAArwYAILUCAACwBgAguwIAAF4AIAQoAADIBQAwtQIAAMkFADC3AgAAywUAILsCAADMBQAwBCgAAL8FADC1AgAAwAUAMLcCAADCBQAguwIAAN4EADAEKAAAtgUAMLUCAAC3BQAwtwIAALkFACC7AgAA8wMAMAAAAAUoAACqBgAgKQAArQYAILUCAACrBgAgtgIAAKwGACC7AgAAyQIAIAMoAACqBgAgtQIAAKsGACC7AgAAyQIAIAAAAAsoAACLBgAwKQAAjwYAMLUCAACMBgAwtgIAAI0GADC3AgAAjgYAILgCAAC6BAAwuQIAALoEADC6AgAAugQAMLsCAAC6BAAwvAIAAJAGADC9AgAAvQQAMAsoAAD_BQAwKQAAhAYAMLUCAACABgAwtgIAAIEGADC3AgAAggYAILgCAACDBgAwuQIAAIMGADC6AgAAgwYAMLsCAACDBgAwvAIAAIUGADC9AgAAhgYAMAsoAADzBQAwKQAA-AUAMLUCAAD0BQAwtgIAAPUFADC3AgAA9gUAILgCAAD3BQAwuQIAAPcFADC6AgAA9wUAMLsCAAD3BQAwvAIAAPkFADC9AgAA-gUAMAcoAADuBQAgKQAA8QUAILUCAADvBQAgtgIAAPAFACC5AgAAKAAgugIAACgAILsCAADPAQAgCygAAOUFADApAADpBQAwtQIAAOYFADC2AgAA5wUAMLcCAADoBQAguAIAAI0FADC5AgAAjQUAMLoCAACNBQAwuwIAAI0FADC8AgAA6gUAML0CAACQBQAwCxAAAIIFACDnAQEAAAAB7wEAAACZAgL0AUAAAAAB9QFAAAAAAZICAQAAAAGUAgAAAJQCApUCAQAAAAGWAhAAAAABlwIBAAAAAZkCAQAAAAECAAAALAAgKAAA7QUAIAMAAAAsACAoAADtBQAgKQAA7AUAIAEhAACpBgAwAgAAACwAICEAAOwFACACAAAAkQUAICEAAOsFACAK5wEBANUDACHvAQAA_gSZAiL0AUAA2wMAIfUBQADbAwAhkgIBANcDACGUAgAA_ASUAiKVAgEA1QMAIZYCEAD9BAAhlwIBANUDACGZAgEA1wMAIQsQAACABQAg5wEBANUDACHvAQAA_gSZAiL0AUAA2wMAIfUBQADbAwAhkgIBANcDACGUAgAA_ASUAiKVAgEA1QMAIZYCEAD9BAAhlwIBANUDACGZAgEA1wMAIQsQAACCBQAg5wEBAAAAAe8BAAAAmQIC9AFAAAAAAfUBQAAAAAGSAgEAAAABlAIAAACUAgKVAgEAAAABlgIQAAAAAZcCAQAAAAGZAgEAAAABChEAAJYFACDnAQEAAAAB7wEAAACcAgL0AUAAAAAB9QFAAAAAAZICAQAAAAGUAgAAAJQCApoCAQAAAAGcAkAAAAABnQJAAAAAAQIAAADPAQAgKAAA7gUAIAMAAAAoACAoAADuBQAgKQAA8gUAIAwAAAAoACARAACIBQAgIQAA8gUAIOcBAQDVAwAh7wEAAIYFnAIi9AFAANsDACH1AUAA2wMAIZICAQDXAwAhlAIAAPwElAIimgIBANUDACGcAkAA2gMAIZ0CQADaAwAhChEAAIgFACDnAQEA1QMAIe8BAACGBZwCIvQBQADbAwAh9QFAANsDACGSAgEA1wMAIZQCAAD8BJQCIpoCAQDVAwAhnAJAANoDACGdAkAA2gMAIQwPAADWBQAgEwAA1wUAIBQAANUFACDnAQEAAAAB7wEBAAAAAfMBQAAAAAH0AUAAAAAB9QFAAAAAAYcCAQAAAAGIAgEAAAABowIBAAAAAaQCAQAAAAECAAAAJgAgKAAA_gUAIAMAAAAmACAoAAD-BQAgKQAA_QUAIAEhAACoBgAwEQMAAJ8DACAPAAC8AwAgEwAAgwMAIBQAALsDACDkAQAAugMAMOUBAAAkABDmAQAAugMAMOcBAQAAAAHvAQEA_AIAIfMBQAD_AgAh9AFAAIADACH1AUAAgAMAIYYCAQD8AgAhhwIBAPwCACGIAgEA-wIAIaMCAQD7AgAhpAIBAPsCACECAAAAJgAgIQAA_QUAIAIAAAD7BQAgIQAA_AUAIA3kAQAA-gUAMOUBAAD7BQAQ5gEAAPoFADDnAQEA_AIAIe8BAQD8AgAh8wFAAP8CACH0AUAAgAMAIfUBQACAAwAhhgIBAPwCACGHAgEA_AIAIYgCAQD7AgAhowIBAPsCACGkAgEA-wIAIQ3kAQAA-gUAMOUBAAD7BQAQ5gEAAPoFADDnAQEA_AIAIe8BAQD8AgAh8wFAAP8CACH0AUAAgAMAIfUBQACAAwAhhgIBAPwCACGHAgEA_AIAIYgCAQD7AgAhowIBAPsCACGkAgEA-wIAIQnnAQEA1QMAIe8BAQDVAwAh8wFAANoDACH0AUAA2wMAIfUBQADbAwAhhwIBANUDACGIAgEA1wMAIaMCAQDXAwAhpAIBANcDACEMDwAAtAUAIBMAALUFACAUAACzBQAg5wEBANUDACHvAQEA1QMAIfMBQADaAwAh9AFAANsDACH1AUAA2wMAIYcCAQDVAwAhiAIBANcDACGjAgEA1wMAIaQCAQDXAwAhDA8AANYFACATAADXBQAgFAAA1QUAIOcBAQAAAAHvAQEAAAAB8wFAAAAAAfQBQAAAAAH1AUAAAAABhwIBAAAAAYgCAQAAAAGjAgEAAAABpAIBAAAAAQgFAADyBAAgCAAA8wQAIOcBAQAAAAHzAUAAAAAB9AFAAAAAAfUBQAAAAAGHAgEAAAABiAIBAAAAAQIAAAAiACAoAACKBgAgAwAAACIAICgAAIoGACApAACJBgAgASEAAKcGADAOAwAAnwMAIAUAAIIDACAIAAC8AwAg5AEAAL4DADDlAQAAIAAQ5gEAAL4DADDnAQEAAAAB8wFAAP8CACH0AUAAgAMAIfUBQACAAwAhhgIBAPwCACGHAgEA_AIAIYgCAQD7AgAhrwIAAL0DACACAAAAIgAgIQAAiQYAIAIAAACHBgAgIQAAiAYAIArkAQAAhgYAMOUBAACHBgAQ5gEAAIYGADDnAQEA_AIAIfMBQAD_AgAh9AFAAIADACH1AUAAgAMAIYYCAQD8AgAhhwIBAPwCACGIAgEA-wIAIQrkAQAAhgYAMOUBAACHBgAQ5gEAAIYGADDnAQEA_AIAIfMBQAD_AgAh9AFAAIADACH1AUAAgAMAIYYCAQD8AgAhhwIBAPwCACGIAgEA-wIAIQbnAQEA1QMAIfMBQADaAwAh9AFAANsDACH1AUAA2wMAIYcCAQDVAwAhiAIBANcDACEIBQAA2AQAIAgAANkEACDnAQEA1QMAIfMBQADaAwAh9AFAANsDACH1AUAA2wMAIYcCAQDVAwAhiAIBANcDACEIBQAA8gQAIAgAAPMEACDnAQEAAAAB8wFAAAAAAfQBQAAAAAH1AUAAAAABhwIBAAAAAYgCAQAAAAEHCgAA3AUAIOcBAQAAAAHvAQAAAKgCAvQBQAAAAAH1AUAAAAABhQIBAAAAAaYCAAAApgICAgAAAAUAICgAAJMGACADAAAABQAgKAAAkwYAICkAAJIGACABIQAApgYAMAIAAAAFACAhAACSBgAgAgAAAL4EACAhAACRBgAgBucBAQDVAwAh7wEAAMEEqAIi9AFAANsDACH1AUAA2wMAIYUCAQDVAwAhpgIAAMAEpgIiBwoAANsFACDnAQEA1QMAIe8BAADBBKgCIvQBQADbAwAh9QFAANsDACGFAgEA1QMAIaYCAADABKYCIgcKAADcBQAg5wEBAAAAAe8BAAAAqAIC9AFAAAAAAfUBQAAAAAGFAgEAAAABpgIAAACmAgIEKAAAiwYAMLUCAACMBgAwtwIAAI4GACC7AgAAugQAMAQoAAD_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_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-AYAIAMAAABCACAoAAD0BgAgKQAA_AYAIBMAAABCACAEAADcAwAgCwAA3QMAIAwAAN4DACAOAADgAwAgIQAA_AYAIOcBAQDVAwAh6AEBANUDACHpASAA1gMAIeoBAQDXAwAh6wEBANUDACHsAQEA1wMAIe0BAQDXAwAh7wEAANgD7wEi8QEAANkD8QEi8gEBANcDACHzAUAA2gMAIfQBQADbAwAh9QFAANsDACERBAAA3AMAIAsAAN0DACAMAADeAwAgDgAA4AMAIOcBAQDVAwAh6AEBANUDACHpASAA1gMAIeoBAQDXAwAh6wEBANUDACHsAQEA1wMAIe0BAQDXAwAh7wEAANgD7wEi8QEAANkD8QEi8gEBANcDACHzAUAA2gMAIfQBQADbAwAh9QFAANsDACEM5wEBAAAAAe8BAAAAkAIC8wFAAAAAAfQBQAAAAAH1AUAAAAABiAIBAAAAAYkCAQAAAAGKAgEAAAABjAIBAAAAAY0CAQAAAAGOAgEAAAABkQIAAACRAgIRBAAAxgQAIAsAAMcEACAMAADIBAAgDQAAyQQAIOcBAQAAAAHoAQEAAAAB6QEgAAAAAeoBAQAAAAHrAQEAAAAB7AEBAAAAAe0BAQAAAAHvAQAAAO8BAvEBAAAA8QEC8gEBAAAAAfMBQAAAAAH0AUAAAAAB9QFAAAAAAQIAAADJAgAgKAAA_gYAIAMAAABCACAoAAD-BgAgKQAAggcAIBMAAABCACAEAADcAwAgCwAA3QMAIAwAAN4DACANAADfAwAgIQAAggcAIOcBAQDVAwAh6AEBANUDACHpASAA1gMAIeoBAQDXAwAh6wEBANUDACHsAQEA1wMAIe0BAQDXAwAh7wEAANgD7wEi8QEAANkD8QEi8gEBANcDACHzAUAA2gMAIfQBQADbAwAh9QFAANsDACERBAAA3AMAIAsAAN0DACAMAADeAwAgDQAA3wMAIOcBAQDVAwAh6AEBANUDACHpASAA1gMAIeoBAQDXAwAh6wEBANUDACHsAQEA1wMAIe0BAQDXAwAh7wEAANgD7wEi8QEAANkD8QEi8gEBANcDACHzAUAA2gMAIfQBQADbAwAh9QFAANsDACEG5wEBAAAAAfMBQAAAAAH0AUAAAAAB9QFAAAAAAa0CAQAAAAGuAgEAAAABAwAAADUAICgAAPIGACApAACGBwAgDQAAADUAIAYAAJ0FACAhAACGBwAg5wEBANUDACHvAQAAnAWgAiLzAUAA2gMAIfQBQADbAwAh9QFAANsDACGHAgEA1QMAIYkCAQDVAwAhngIBANcDACGgAkAA2gMAIaECQADaAwAhCwYAAJ0FACDnAQEA1QMAIe8BAACcBaACIvMBQADaAwAh9AFAANsDACH1AUAA2wMAIYcCAQDVAwAhiQIBANUDACGeAgEA1wMAIaACQADaAwAhoQJAANoDACEDAAAAQgAgKAAA9gYAICkAAIkHACATAAAAQgAgBAAA3AMAIAsAAN0DACANAADfAwAgDgAA4AMAICEAAIkHACDnAQEA1QMAIegBAQDVAwAh6QEgANYDACHqAQEA1wMAIesBAQDVAwAh7AEBANcDACHtAQEA1wMAIe8BAADYA-8BIvEBAADZA_EBIvIBAQDXAwAh8wFAANoDACH0AUAA2wMAIfUBQADbAwAhEQQAANwDACALAADdAwAgDQAA3wMAIA4AAOADACDnAQEA1QMAIegBAQDVAwAh6QEgANYDACHqAQEA1wMAIesBAQDVAwAh7AEBANcDACHtAQEA1wMAIe8BAADYA-8BIvEBAADZA_EBIvIBAQDXAwAh8wFAANoDACH0AUAA2wMAIfUBQADbAwAhAwAAABMAICgAAPAGACApAACMBwAgFQAAABMAIAYAAPwDACAOAACBBAAgFQAA_QMAIBcAAP8DACAYAACVBAAgGQAAgAQAICEAAIwHACDnAQEA1QMAIe8BAAD5A5ACIvMBQADaAwAh9AFAANsDACH1AUAA2wMAIYgCAQDXAwAhiQIBANUDACGKAgEA1wMAIYsCAQDXAwAhjAIBANcDACGNAgEA1wMAIY4CAQDVAwAhkQIAAPoDkQIiEwYAAPwDACAOAACBBAAgFQAA_QMAIBcAAP8DACAYAACVBAAgGQAAgAQAIOcBAQDVAwAh7wEAAPkDkAIi8wFAANoDACH0AUAA2wMAIfUBQADbAwAhiAIBANcDACGJAgEA1QMAIYoCAQDXAwAhiwIBANcDACGMAgEA1wMAIY0CAQDXAwAhjgIBANUDACGRAgAA-gORAiIDAAAAJAAgKAAA-AYAICkAAI8HACAPAAAAJAAgAwAAsgUAIA8AALQFACAUAACzBQAgIQAAjwcAIOcBAQDVAwAh7wEBANUDACHzAUAA2gMAIfQBQADbAwAh9QFAANsDACGGAgEA1QMAIYcCAQDVAwAhiAIBANcDACGjAgEA1wMAIaQCAQDXAwAhDQMAALIFACAPAAC0BQAgFAAAswUAIOcBAQDVAwAh7wEBANUDACHzAUAA2gMAIfQBQADbAwAh9QFAANsDACGGAgEA1QMAIYcCAQDVAwAhiAIBANcDACGjAgEA1wMAIaQCAQDXAwAhDOcBAQAAAAHvAQAAAJACAvMBQAAAAAH0AUAAAAAB9QFAAAAAAYgCAQAAAAGJAgEAAAABigIBAAAAAYsCAQAAAAGMAgEAAAABjgIBAAAAAZECAAAAkQICEwYAAJcEACAVAACeBAAgFgAAmAQAIBcAAJkEACAYAACaBAAgGQAAmwQAIOcBAQAAAAHvAQAAAJACAvMBQAAAAAH0AUAAAAAB9QFAAAAAAYgCAQAAAAGJAgEAAAABigIBAAAAAYsCAQAAAAGMAgEAAAABjQIBAAAAAY4CAQAAAAGRAgAAAJECAgIAAAAVACAoAACRBwAgAwAAABMAICgAAJEHACApAACVBwAgFQAAABMAIAYAAPwDACAVAAD9AwAgFgAA_gMAIBcAAP8DACAYAACVBAAgGQAAgAQAICEAAJUHACDnAQEA1QMAIe8BAAD5A5ACIvMBQADaAwAh9AFAANsDACH1AUAA2wMAIYgCAQDXAwAhiQIBANUDACGKAgEA1wMAIYsCAQDXAwAhjAIBANcDACGNAgEA1wMAIY4CAQDVAwAhkQIAAPoDkQIiEwYAAPwDACAVAAD9AwAgFgAA_gMAIBcAAP8DACAYAACVBAAgGQAAgAQAIOcBAQDVAwAh7wEAAPkDkAIi8wFAANoDACH0AUAA2wMAIfUBQADbAwAhiAIBANcDACGJAgEA1QMAIYoCAQDXAwAhiwIBANcDACGMAgEA1wMAIY0CAQDXAwAhjgIBANUDACGRAgAA-gORAiIG5wEBAAAAAfMBQAAAAAH0AUAAAAAB9QFAAAAAAawCAQAAAAGuAgEAAAABAhoAAhsABggGAAMJABMORgEVQAIWQQIXQwYYRAYZRRAFAwAECQASDzsJEzwCFDgQBgQGBQgnAwkADw8jCBEwDRIpDAIDAAQKAAYGBAcFCQALCwsHDBYCDRcCDhoBAgcACAoABgQDAAQFDAcIEAkJAAoCBgADBwAIAgURAAgSAAUEGwALHAAMHQANHgAOHwADAwAECQAOES0NAgMABBAuDAERLwAEBDEACDMADzIAETQAAwYAAwkAERM5AgETOgADDz4AEz8AFD0AAg5IABZHAAACGgACGwAGAhoAAhsABgMJABguABkvABoAAAADCQAYLgAZLwAaAAADCQAfLgAgLwAhAAAAAwkAHy4AIC8AIQIDAAQKAAYCAwAECgAGAwkAJi4AJy8AKAAAAAMJACYuACcvACgBAwAEAQMABAMJAC0uAC4vAC8AAAADCQAtLgAuLwAvAgYAAwcACAIGAAMHAAgDCQA0LgA1LwA2AAAAAwkANC4ANS8ANgEGAAMBBgADAwkAOy4APC8APQAAAAMJADsuADwvAD0BAwAEAQMABAMJAEIuAEMvAEQAAAADCQBCLgBDLwBEAgMABBDxAQwCAwAEEPcBDAUJAEkuAEwvAE2gAQBKoQEASwAAAAAABQkASS4ATC8ATaABAEqhAQBLBQYAAxWJAgIXigIGGIsCBhmMAhAFBgADFZICAheTAgYYlAIGGZUCEAMJAFIuAFMvAFQAAAADCQBSLgBTLwBUAQMABAEDAAQDCQBZLgBaLwBbAAAAAwkAWS4AWi8AWwIHAAgKAAYCBwAICgAGAwkAYC4AYS8AYgAAAAMJAGAuAGEvAGIAAAMJAGcuAGgvAGkAAAADCQBnLgBoLwBpHAIBHUkBHkoBH0sBIEwBIk4BI1AUJFEVJVMBJlUUJ1YWKlcBK1gBLFkUMFwXMV0bMl8EM2AENGMENWQENmUEN2cEOGkUOWocOmwEO24UPG8dPXAEPnEEP3IUQHUeQXYiQncFQ3gFRHkFRXoFRnsFR30FSH8USYABI0qCAQVLhAEUTIUBJE2GAQVOhwEFT4gBFFCLASVRjAEpUo0BA1OOAQNUjwEDVZABA1aRAQNXkwEDWJUBFFmWASpamAEDW5oBFFybAStdnAEDXp0BA1-eARRgoQEsYaIBMGKjAQljpAEJZKUBCWWmAQlmpwEJZ6kBCWirARRprAExaq4BCWuwARRssQEybbIBCW6zAQlvtAEUcLcBM3G4ATdyuQEQc7oBEHS7ARB1vAEQdr0BEHe_ARB4wQEUecIBOHrEARB7xgEUfMcBOX3IARB-yQEQf8oBFIABzQE6gQHOAT6CAdABDIMB0QEMhAHTAQyFAdQBDIYB1QEMhwHXAQyIAdkBFIkB2gE_igHcAQyLAd4BFIwB3wFAjQHgAQyOAeEBDI8B4gEUkAHlAUGRAeYBRZIB5wENkwHoAQ2UAekBDZUB6gENlgHrAQ2XAe0BDZgB7wEUmQHwAUaaAfMBDZsB9QEUnAH2AUedAfgBDZ4B-QENnwH6ARSiAf0BSKMB_gFOpAH_AQKlAYACAqYBgQICpwGCAgKoAYMCAqkBhQICqgGHAhSrAYgCT6wBjgICrQGQAhSuAZECUK8BlgICsAGXAgKxAZgCFLIBmwJRswGcAlW0AZ0CCLUBngIItgGfAgi3AaACCLgBoQIIuQGjAgi6AaUCFLsBpgJWvAGoAgi9AaoCFL4BqwJXvwGsAgjAAa0CCMEBrgIUwgGxAljDAbICXMQBswIHxQG0AgfGAbUCB8cBtgIHyAG3AgfJAbkCB8oBuwIUywG8Al3MAb4CB80BwAIUzgHBAl7PAcICB9ABwwIH0QHEAhTSAccCX9MByAJj1AHKAgbVAcsCBtYBzQIG1wHOAgbYAc8CBtkB0QIG2gHTAhTbAdQCZNwB1gIG3QHYAhTeAdkCZd8B2gIG4AHbAgbhAdwCFOIB3wJm4wHgAmo"
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
  logoUrl: "logoUrl",
  logoPublicId: "logoPublicId",
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
  documentUrl: "documentUrl",
  documentPublicId: "documentPublicId",
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
  profileImageUrl: "profileImageUrl",
  profileImagePublicId: "profileImagePublicId",
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
var OrganizationMembershipStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  SUSPENDED: "SUSPENDED"
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
  orbrin_base_one_month_plan_id: process.env.ORBRIN_BASE_ONE_MONTH_PLAN_ID,
  demo_email: process.env.DEMO_EMAIL,
  demo_slug: process.env.DEMO_SLUG,
  demo_password: process.env.DEMO_PASSWORD,
  smtp_user: process.env.SMTP_USER,
  smtp_password: process.env.SMTP_PASSWORD,
  smtp_email_sender: process.env.SMTP_EMAIL_SENDER,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET
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

// src/app/lib/redis.ts
import { Redis } from "@upstash/redis";
var redis = new Redis({
  url: config_default.upstash_redis_rest_url,
  token: config_default.upstash_redis_rest_token
});

// src/app/middleware/rate-limiter.ts
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
        where: {
          status: "ACTIVE",
          organization: {
            deletedAt: null
          }
        },
        include: {
          organization: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          }
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
    meta: data?.meta,
    pagination: data?.pagination
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
var validateQuery = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed for query parameters",
        errors: result.error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message
        }))
      });
      return;
    }
    req.validatedQuery = result.data;
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

// src/app/utils/query.ts
var getPagination = (page, limit) => ({
  skip: (page - 1) * limit,
  take: limit
});
var createPaginationMeta = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1
  };
};

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
  if (existingTeam?.deletedAt) {
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
var getAllTeams = async (organizationId, query) => {
  const { page, limit, search, sortBy, sortOrder } = query;
  const where = {
    organizationId,
    deletedAt: null,
    ...search ? {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } }
      ]
    } : {}
  };
  const [teams, total] = await prisma.$transaction([
    prisma.team.findMany({
      where,
      ...getPagination(page, limit),
      orderBy: { [sortBy]: sortOrder },
      include: { teamMembers: true }
    }),
    prisma.team.count({ where })
  ]);
  return { data: teams, pagination: createPaginationMeta(page, limit, total) };
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
    const query = req.validatedQuery;
    const result = await teamService.getAllTeams(organizationId, query);
    sendSuccessResponse(res, {
      statusCode: StatusCodes3.OK,
      message: "Teams retrieved successfully",
      data: result.data,
      pagination: result.pagination
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
import { z as z3 } from "zod";

// src/app/utils/query-schema.ts
import { z as z2 } from "zod";
var paginationQuerySchema = z2.object({
  page: z2.coerce.number().int().min(1).default(1),
  limit: z2.coerce.number().int().min(1).max(100).default(10)
});
var sortOrderSchema = z2.enum(["asc", "desc"]);

// src/app/module/team/team.schema.ts
var createTeamSchema = z3.object({
  body: z3.object({
    name: z3.string({ error: "Team name is required" }).trim().min(1, { error: "Team name cannot be empty" }),
    description: z3.string().optional()
  })
});
var updateTeamSchema = z3.object({
  body: z3.object({
    name: z3.string().trim().min(1, { error: "Team name cannot be empty" }).optional(),
    description: z3.string().optional()
  }).refine((body) => Object.keys(body).length > 0, {
    error: "At least one team field is required to update"
  })
});
var teamQuerySchema = paginationQuerySchema.extend({
  search: z3.string().trim().min(1).optional(),
  sortBy: z3.enum(["name", "createdAt", "updatedAt"]).default("createdAt"),
  sortOrder: sortOrderSchema.default("desc")
});
var teamValidation = {
  createTeamSchema,
  updateTeamSchema,
  teamQuerySchema
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
  validateQuery(teamValidation.teamQuerySchema),
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

// src/app/services/cloudinary/index.ts
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: config_default.cloudinary_cloud_name,
  api_key: config_default.cloudinary_api_key,
  api_secret: config_default.cloudinary_api_secret
});
var uploadBuffer = async (buffer, options) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder,
        resource_type: options.resourceType ?? "image",
        ...options.publicId && {
          public_id: options.publicId
        },
        ...options.format && {
          format: options.format
        }
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        if (!result) {
          reject(new Error("Cloudinary upload failed."));
          return;
        }
        resolve({
          secureUrl: result.secure_url,
          publicId: result.public_id,
          resourceType: result.resource_type,
          format: result.format,
          bytes: result.bytes
        });
      }
    );
    uploadStream.end(buffer);
  });
};
var deleteAsset = async (publicId, resourceType = "image") => {
  return cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
    invalidate: true
  });
};
var cloudinaryService = {
  uploadBuffer,
  deleteAsset
};

// src/app/module/project/project.service.ts
var createProject = async (organizationId, payload, file) => {
  if (!file) {
    throw new Error("Project document is required.");
  }
  if (file.mimetype !== "application/pdf") {
    throw new Error("Only PDF files are allowed.");
  }
  const uploadedDocument = await cloudinaryService.uploadBuffer(file.buffer, {
    folder: `orbrin/organizations/${organizationId}/projects`,
    resourceType: "image",
    publicId: crypto.randomUUID()
  });
  try {
    const project = await prisma.project.create({
      data: {
        name: payload.name,
        description: payload.description,
        organizationId,
        documentUrl: uploadedDocument.secureUrl,
        documentPublicId: uploadedDocument.publicId
      }
    });
    return project;
  } catch (error) {
    try {
      await cloudinaryService.deleteAsset(uploadedDocument.publicId, "raw");
    } catch (cleanupError) {
      console.error(
        "Failed to clean up uploaded project document:",
        cleanupError
      );
    }
    throw error;
  }
};
var getAllProjects = async (organizationId, query) => {
  const { page, limit, search, sortBy, sortOrder, status, teamId } = query;
  const where = {
    organizationId,
    deletedAt: null,
    ...status ? { status } : {},
    ...teamId ? { teams: { some: { teamId } } } : {},
    ...search ? {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } }
      ]
    } : {}
  };
  const [projects, total] = await prisma.$transaction([
    prisma.project.findMany({
      where,
      ...getPagination(page, limit),
      orderBy: { [sortBy]: sortOrder },
      include: {
        teams: true,
        tasks: true
      }
    }),
    prisma.project.count({ where })
  ]);
  return {
    data: projects,
    pagination: createPaginationMeta(page, limit, total)
  };
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
    throw new Error("Project not found.");
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
    throw new Error("Project not found.");
  }
  const updatedProject = await prisma.project.update({
    where: {
      id: projectId
    },
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
    throw new Error("Project not found.");
  }
  const updatedProject = await prisma.project.update({
    where: {
      id: projectId
    },
    data: {
      deletedAt: /* @__PURE__ */ new Date()
    }
  });
  return updatedProject;
};
var assignTeamToProject = async (organizationId, projectId, teamId) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organizationId,
      deletedAt: null
    }
  });
  if (!project) {
    throw new Error("Project not found.");
  }
  const team = await prisma.team.findFirst({
    where: {
      id: teamId,
      organizationId,
      deletedAt: null
    }
  });
  if (!team) {
    throw new Error("Team not found.");
  }
  const existingAssignment = await prisma.projectTeam.findFirst({
    where: {
      projectId,
      teamId
    }
  });
  if (existingAssignment) {
    throw new Error("Team is already assigned to this project.");
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
    where: {
      id: projectId,
      organizationId,
      deletedAt: null
    }
  });
  if (!project) {
    throw new Error("Project not found.");
  }
  const team = await prisma.team.findFirst({
    where: {
      id: teamId,
      organizationId,
      deletedAt: null
    }
  });
  if (!team) {
    throw new Error("Team not found.");
  }
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
var uploadProjectDocument = async (organizationId, projectId, file) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organizationId,
      deletedAt: null
    },
    select: {
      id: true,
      documentUrl: true,
      documentPublicId: true
    }
  });
  if (!project) {
    throw new Error("Project not found.");
  }
  if (!file) {
    throw new Error("Project document is required.");
  }
  if (file.mimetype !== "application/pdf") {
    throw new Error("Only PDF files are allowed.");
  }
  const uploadedDocument = await cloudinaryService.uploadBuffer(file.buffer, {
    folder: `orbrin/organizations/${organizationId}/projects`,
    resourceType: "image",
    publicId: crypto.randomUUID()
  });
  try {
    const updatedProject = await prisma.project.update({
      where: {
        id: projectId
      },
      data: {
        documentUrl: uploadedDocument.secureUrl,
        documentPublicId: uploadedDocument.publicId
      },
      select: {
        id: true,
        name: true,
        description: true,
        documentUrl: true,
        documentPublicId: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });
    if (project.documentPublicId) {
      try {
        await cloudinaryService.deleteAsset(project.documentPublicId, "image");
      } catch (error) {
        console.error(
          "Failed to delete old project document from Cloudinary:",
          error
        );
      }
    }
    return updatedProject;
  } catch (error) {
    try {
      await cloudinaryService.deleteAsset(uploadedDocument.publicId, "image");
    } catch (cleanupError) {
      console.error(
        "Failed to clean up newly uploaded project document:",
        cleanupError
      );
    }
    throw error;
  }
};
var deleteProjectDocument = async (organizationId, projectId) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organizationId,
      deletedAt: null
    },
    select: {
      id: true,
      documentPublicId: true
    }
  });
  if (!project) {
    throw new Error("Project not found.");
  }
  if (!project.documentPublicId) {
    throw new Error("Project document not found.");
  }
  await cloudinaryService.deleteAsset(project.documentPublicId, "image");
  const updatedProject = await prisma.project.update({
    where: {
      id: projectId
    },
    data: {
      documentUrl: null,
      documentPublicId: null
    },
    select: {
      id: true,
      name: true,
      documentUrl: true,
      documentPublicId: true
    }
  });
  return updatedProject;
};
var projectService = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  assignTeamToProject,
  removeTeamFromProject,
  uploadProjectDocument,
  deleteProjectDocument
};

// src/app/module/project/project.controller.ts
import { StatusCodes as StatusCodes4 } from "http-status-codes";
var createProject2 = catch_async_default(async (req, res) => {
  if (!req.user?.organizationId) {
    throw new Error("Organization ID is missing.");
  }
  if (!req.file) {
    throw new Error("Project PDF document is required.");
  }
  const result = await projectService.createProject(
    req.user.organizationId,
    req.body,
    req.file
  );
  sendSuccessResponse(res, {
    statusCode: StatusCodes4.CREATED,
    message: "Project created successfully.",
    data: result
  });
});
var getAllProjects2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    const query = req.validatedQuery;
    const result = await projectService.getAllProjects(organizationId, query);
    sendSuccessResponse(res, {
      statusCode: StatusCodes4.OK,
      message: "Projects retrieved successfully",
      data: result.data,
      pagination: result.pagination
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
var uploadProjectDocument2 = catch_async_default(async (req, res) => {
  if (!req.user?.organizationId) {
    throw new Error("Organization ID is missing.");
  }
  if (!req.file) {
    throw new Error("PDF document is required.");
  }
  if (!req.params.projectId) {
    throw new Error("Project ID is required.");
  }
  const result = await projectService.uploadProjectDocument(
    req.user.organizationId,
    req.params.projectId,
    req.file
  );
  sendSuccessResponse(res, {
    statusCode: StatusCodes4.OK,
    message: "Project document uploaded successfully.",
    data: result
  });
});
var deleteProjectDocument2 = catch_async_default(
  async (req, res) => {
    const organizationId = req.user?.organizationId;
    const { projectId } = req.params;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    if (!projectId) {
      throw new Error("Project ID is required.");
    }
    await projectService.deleteProjectDocument(
      organizationId,
      projectId
    );
    sendSuccessResponse(res, {
      statusCode: StatusCodes4.OK,
      message: "Project document deleted successfully",
      data: null
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
  removeTeamFromProject: removeTeamFromProject2,
  uploadProjectDocument: uploadProjectDocument2,
  deleteProjectDocument: deleteProjectDocument2
};

// src/app/module/project/project.schema.ts
import { z as z4 } from "zod";
var createProjectSchema = z4.object({
  body: z4.object({
    name: z4.string({ error: "Project name is required" }).trim().min(1, { error: "Project name cannot be empty" }),
    description: z4.string().optional()
  })
});
var updateProjectSchema = z4.object({
  body: z4.object({
    name: z4.string().trim().min(1, { error: "Project name cannot be empty" }).optional(),
    description: z4.string().optional(),
    status: z4.string().optional()
  })
});
var assignTeamSchema = z4.object({
  body: z4.object({
    teamId: z4.string({ error: "Team ID is required" }).trim().min(1, { error: "Team ID cannot be empty" })
  })
});
var projectQuerySchema = paginationQuerySchema.extend({
  search: z4.string().trim().min(1).optional(),
  sortBy: z4.enum(["name", "createdAt", "updatedAt"]).default("createdAt"),
  sortOrder: sortOrderSchema.default("desc"),
  status: z4.string().trim().min(1).optional(),
  teamId: z4.uuid().optional()
});
var projectValidation = {
  createProjectSchema,
  updateProjectSchema,
  assignTeamSchema,
  projectQuerySchema
};

// src/app/middleware/multer.ts
import multer from "multer";
var storage = multer.memoryStorage();
var imageFileFilter = (_req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp"
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
    return;
  }
  cb(
    new Error(
      "Only JPEG, PNG, and WebP images are allowed."
    )
  );
};
var pdfFileFilter = (_req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
    return;
  }
  cb(new Error("Only PDF files are allowed."));
};
var uploadImage = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: imageFileFilter
});
var uploadPdf = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter: pdfFileFilter
});

// src/app/module/project/project.route.ts
var router3 = Router3();
router3.post(
  "/",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  uploadPdf.single("document"),
  validate(projectValidation.createProjectSchema),
  projectController.createProject
);
router3.get(
  "/",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  validateQuery(projectValidation.projectQuerySchema),
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
router3.patch(
  "/:projectId/document",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  uploadPdf.single("document"),
  projectController.uploadProjectDocument
);
router3.delete(
  "/:projectId/document",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  projectController.deleteProjectDocument
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
var getTasksByProject = async (organizationId, projectId, query) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, organizationId, deletedAt: null }
  });
  if (!project) {
    throw new Error("Project not found");
  }
  const {
    page,
    limit,
    search,
    sortBy,
    sortOrder,
    status,
    priority,
    assigneeId,
    sprintId
  } = query;
  const where = {
    projectId,
    deletedAt: null,
    ...status ? { status } : {},
    ...priority ? { priority } : {},
    ...assigneeId ? { assigneeId } : {},
    ...sprintId ? { sprintId } : {},
    ...search ? {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } }
      ]
    } : {}
  };
  const [tasks, total] = await prisma.$transaction([
    prisma.task.findMany({
      where,
      ...getPagination(page, limit),
      orderBy: { [sortBy]: sortOrder }
    }),
    prisma.task.count({ where })
  ]);
  return { data: tasks, pagination: createPaginationMeta(page, limit, total) };
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
    const query = req.validatedQuery;
    const result = await taskService.getTasksByProject(
      organizationId,
      projectId,
      query
    );
    sendSuccessResponse(res, {
      statusCode: StatusCodes5.OK,
      message: "Tasks retrieved successfully",
      data: result.data,
      pagination: result.pagination
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
import { z as z5 } from "zod";
var createTaskSchema = z5.object({
  body: z5.object({
    title: z5.string({ error: "Task title is required" }).trim().min(1, { error: "Task title cannot be empty" }),
    description: z5.string().optional(),
    status: z5.enum([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE]).optional(),
    priority: z5.enum([
      TaskPriority.HIGH,
      TaskPriority.MEDIUM,
      TaskPriority.LOW,
      TaskPriority.URGENT
    ]).optional(),
    dueDate: z5.coerce.date({ message: "Due date must be a valid date" }).optional(),
    assigneeId: z5.uuid({ error: "Assignee ID must be a valid UUID" }).optional(),
    sprintId: z5.uuid({ error: "Sprint ID must be a valid UUID" }).optional(),
    parentTaskId: z5.uuid({ error: "Parent task ID must be a valid UUID" }).optional()
  })
});
var updateTaskSchema = z5.object({
  body: z5.object({
    title: z5.string().trim().min(1, { error: "Task title cannot be empty" }).optional(),
    description: z5.string().optional(),
    status: z5.enum([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE]).optional(),
    priority: z5.enum([
      TaskPriority.HIGH,
      TaskPriority.MEDIUM,
      TaskPriority.LOW,
      TaskPriority.URGENT
    ]).optional(),
    dueDate: z5.coerce.date({ message: "Due date must be a valid date" }).optional(),
    assigneeId: z5.uuid({ error: "Assignee ID must be a valid UUID" }).optional(),
    sprintId: z5.uuid({ error: "Sprint ID must be a valid UUID" }).optional(),
    parentTaskId: z5.uuid({ error: "Parent task ID must be a valid UUID" }).optional()
  })
});
var taskQuerySchema = paginationQuerySchema.extend({
  search: z5.string().trim().min(1).optional(),
  sortBy: z5.enum(["title", "createdAt", "updatedAt"]).default("createdAt"),
  sortOrder: sortOrderSchema.default("desc"),
  status: z5.enum([
    TaskStatus.TODO,
    TaskStatus.IN_PROGRESS,
    TaskStatus.REVIEW,
    TaskStatus.DONE
  ]).optional(),
  priority: z5.enum([
    TaskPriority.HIGH,
    TaskPriority.MEDIUM,
    TaskPriority.LOW,
    TaskPriority.URGENT
  ]).optional(),
  assigneeId: z5.uuid().optional(),
  sprintId: z5.uuid().optional()
});
var taskValidation = {
  createTaskSchema,
  updateTaskSchema,
  taskQuerySchema
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
  validateQuery(taskValidation.taskQuerySchema),
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
var getSprintsByProject = async (organizationId, projectId, query) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, organizationId, deletedAt: null }
  });
  if (!project) {
    throw new Error("Project not found");
  }
  const { page, limit, search, sortBy, sortOrder, status } = query;
  const where = {
    projectId,
    deletedAt: null,
    ...status ? { status } : {},
    ...search ? {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { goal: { contains: search, mode: "insensitive" } }
      ]
    } : {}
  };
  const [sprints, total] = await prisma.$transaction([
    prisma.sprint.findMany({
      where,
      ...getPagination(page, limit),
      orderBy: { [sortBy]: sortOrder },
      include: { tasks: true }
    }),
    prisma.sprint.count({ where })
  ]);
  return {
    data: sprints,
    pagination: createPaginationMeta(page, limit, total)
  };
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
    const query = req.validatedQuery;
    const result = await sprintService.getSprintsByProject(
      organizationId,
      projectId,
      query
    );
    sendSuccessResponse(res, {
      statusCode: StatusCodes6.OK,
      message: "Sprints retrieved successfully",
      data: result.data,
      pagination: result.pagination
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
import { z as z6 } from "zod";
var createSprintSchema = z6.object({
  body: z6.object({
    name: z6.string({ error: "Sprint name is required" }).trim().min(1, { error: "Sprint name cannot be empty" }),
    goal: z6.string().optional(),
    status: z6.enum([
      SprintStatus.ACTIVE,
      SprintStatus.COMPLETED,
      SprintStatus.PLANNING
    ]).optional(),
    startDate: z6.coerce.date({ message: "Start date must be a valid date" }).optional(),
    endDate: z6.coerce.date({ message: "End date must be a valid date" }).optional()
  })
});
var updateSprintSchema = z6.object({
  body: z6.object({
    name: z6.string().trim().min(1, { error: "Sprint name cannot be empty" }).optional(),
    goal: z6.string().optional(),
    status: z6.enum([
      SprintStatus.ACTIVE,
      SprintStatus.COMPLETED,
      SprintStatus.PLANNING
    ]).optional(),
    startDate: z6.coerce.date({ message: "Start date must be a valid date" }).optional(),
    endDate: z6.coerce.date({ message: "End date must be a valid date" }).optional()
  })
});
var sprintQuerySchema = paginationQuerySchema.extend({
  search: z6.string().trim().min(1).optional(),
  sortBy: z6.enum(["name", "createdAt", "updatedAt"]).default("createdAt"),
  sortOrder: sortOrderSchema.default("desc"),
  status: z6.enum([SprintStatus.PLANNING, SprintStatus.ACTIVE, SprintStatus.COMPLETED]).optional()
});
var sprintValidation = {
  createSprintSchema,
  updateSprintSchema,
  sprintQuerySchema
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
  validateQuery(sprintValidation.sprintQuerySchema),
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
var getCommentsByTask = async (organizationId, taskId, query) => {
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
  const { page, limit, search, sortBy, sortOrder } = query;
  const where = {
    taskId,
    deletedAt: null,
    ...search ? { content: { contains: search, mode: "insensitive" } } : {}
  };
  const [comments, total] = await prisma.$transaction([
    prisma.comment.findMany({
      where,
      ...getPagination(page, limit),
      include: {
        author: { select: { id: true, fullName: true, email: true } }
      },
      orderBy: { [sortBy]: sortOrder }
    }),
    prisma.comment.count({ where })
  ]);
  return {
    data: comments,
    pagination: createPaginationMeta(page, limit, total)
  };
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
    const query = req.validatedQuery;
    const result = await commentService.getCommentsByTask(
      organizationId,
      taskId,
      query
    );
    sendSuccessResponse(res, {
      statusCode: StatusCodes7.OK,
      message: "Comments retrieved successfully",
      data: result.data,
      pagination: result.pagination
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
import { z as z7 } from "zod";
var createCommentSchema = z7.object({
  body: z7.object({
    content: z7.string({ error: "Comment content is required" }).trim().min(1, { error: "Comment content cannot be empty" })
  })
});
var updateCommentSchema = z7.object({
  body: z7.object({
    content: z7.string({ error: "Comment content is required" }).trim().min(1, { error: "Comment content cannot be empty" })
  })
});
var commentQuerySchema = paginationQuerySchema.extend({
  search: z7.string().trim().min(1).optional(),
  sortBy: z7.enum(["createdAt", "updatedAt"]).default("createdAt"),
  sortOrder: sortOrderSchema.default("desc")
});
var commentValidation = {
  createCommentSchema,
  updateCommentSchema,
  commentQuerySchema
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
  validateQuery(commentValidation.commentQuerySchema),
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
var getOrganizationSubscriptionHistory = async (organizationId, query) => {
  const subscription = await prisma.subscription.findUnique({
    where: { organizationId }
  });
  if (!subscription) {
    throw new Error("No subscription history found for the organization");
  }
  const { page, limit, search, sortBy, sortOrder, status } = query;
  const paymentWhere = {
    organizationId,
    ...status ? { status } : {},
    ...search ? { transactionId: { contains: search, mode: "insensitive" } } : {}
  };
  const [payments, total] = await prisma.$transaction([
    prisma.payment.findMany({
      where: paymentWhere,
      ...getPagination(page, limit),
      orderBy: { [sortBy]: sortOrder }
    }),
    prisma.payment.count({ where: paymentWhere })
  ]);
  return {
    data: { ...subscription, payments },
    pagination: createPaginationMeta(page, limit, total)
  };
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
      organizationId,
      req.validatedQuery
    );
    sendSuccessResponse(res, {
      statusCode: StatusCodes8.OK,
      message: "Subscription and billing history retrieved successfully",
      data: result.data,
      pagination: result.pagination
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

// src/app/module/subscription/subscripton.schema.ts
import { z as z8 } from "zod";
var subscriptionHistoryQuerySchema = paginationQuerySchema.extend({
  search: z8.string().trim().min(1).optional(),
  sortBy: z8.enum(["createdAt", "updatedAt"]).default("createdAt"),
  sortOrder: sortOrderSchema.default("desc"),
  status: z8.enum([
    PaymentStatus.PENDING,
    PaymentStatus.COMPLETED,
    PaymentStatus.FAILED,
    PaymentStatus.REFUNDED
  ]).optional()
});

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
  validateQuery(subscriptionHistoryQuerySchema),
  subscriptionController.getSubscriptionHistory
);
var subscriptionRoutes = router7;

// src/app/module/user/user.route.ts
import { Router as Router8 } from "express";

// src/app/module/user/user.controller.ts
import { StatusCodes as StatusCodes9 } from "http-status-codes";

// src/app/module/user/user.service.ts
import bcrypt2 from "bcrypt";
import crypto2 from "crypto";

// src/app/services/mail/index.ts
import ejs from "ejs";
import path3 from "path";
import nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config_default.smtp_user,
    pass: config_default.smtp_password
  }
});
var renderTemplate = async (templateName, data) => {
  const templatePath = path3.join(
    process.cwd(),
    "src",
    "app",
    "services",
    "mail",
    "templates",
    templateName
  );
  return ejs.renderFile(templatePath, data);
};
var sendEmail = async ({
  to,
  subject,
  html
}) => {
  await transporter.sendMail({
    from: `"Orbrin" <${config_default.smtp_user}>`,
    to,
    subject,
    html
  });
};
var sendPasswordResetEmail = async ({
  to,
  fullName,
  resetUrl
}) => {
  const html = await renderTemplate("reset-password.ejs", {
    fullName,
    resetUrl
  });
  await sendEmail({
    to,
    subject: "Reset your Orbrin password",
    html
  });
};
var sendPasswordResetOtpEmail = async ({
  to,
  fullName,
  otp
}) => {
  const html = await renderTemplate("reset-password.ejs", {
    fullName,
    otp
  });
  await sendEmail({
    to,
    subject: "Your Orbrin password reset code",
    html
  });
};
var mailService = {
  sendEmail,
  sendPasswordResetEmail,
  sendPasswordResetOtpEmail
};

// src/app/module/user/user.service.ts
var getMyProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
      deletedAt: null
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      emailVerified: true,
      status: true,
      authProvider: true,
      createdAt: true,
      updatedAt: true,
      memberships: {
        where: {
          status: "ACTIVE",
          organization: {
            deletedAt: null
          }
        },
        select: {
          id: true,
          role: true,
          organization: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          }
        }
      }
    }
  });
  if (!user) {
    throw new Error("User not found.");
  }
  return user;
};
var updateMyProfile = async (userId, payload) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
      deletedAt: null
    }
  });
  if (!user) {
    throw new Error("User not found.");
  }
  return prisma.user.update({
    where: {
      id: userId
    },
    data: {
      fullName: payload.fullName
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      emailVerified: true,
      status: true,
      authProvider: true,
      createdAt: true,
      updatedAt: true
    }
  });
};
var changePassword = async (userId, payload) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
      deletedAt: null
    }
  });
  if (!user) {
    throw new Error("User not found.");
  }
  if (user.authProvider !== "LOCAL") {
    throw new Error("Password change is only available for local accounts.");
  }
  if (!user.passwordHash) {
    throw new Error("Password is not available for this account.");
  }
  const passwordMatches = await bcrypt2.compare(
    payload.currentPassword,
    user.passwordHash
  );
  if (!passwordMatches) {
    throw new Error("Current password is incorrect.");
  }
  const hashedPassword = await bcrypt2.hash(
    payload.newPassword,
    Number(config_default.bcrypt_salt_rounds)
  );
  await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      passwordHash: hashedPassword
    }
  });
};
var forgotPassword = async (payload) => {
  const email = payload.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!user || user.deletedAt || user.authProvider !== "LOCAL") {
    return;
  }
  const otp = crypto2.randomInt(1e5, 1e6).toString();
  const hashedOtp = crypto2.createHash("sha256").update(otp).digest("hex");
  const RESET_OTP_EXPIRY = 60 * 5;
  const redisKey = `orbrin:password-reset-otp:${user.id}`;
  await redis.set(redisKey, hashedOtp, {
    ex: RESET_OTP_EXPIRY
  });
  await mailService.sendPasswordResetOtpEmail({
    to: user.email,
    fullName: user.fullName,
    otp
  });
};
var resetPassword = async (payload) => {
  const email = payload.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: {
      email,
      deletedAt: null
    }
  });
  if (!user) {
    throw new Error("Invalid email or OTP.");
  }
  if (user.authProvider !== "LOCAL") {
    throw new Error("Password reset is only available for local accounts.");
  }
  const hashedOtp = crypto2.createHash("sha256").update(payload.otp).digest("hex");
  const redisKey = `orbrin:password-reset-otp:${user.id}`;
  const storedOtp = await redis.get(redisKey);
  if (!storedOtp || storedOtp !== hashedOtp) {
    throw new Error("Invalid or expired OTP.");
  }
  const hashedPassword = await bcrypt2.hash(
    payload.newPassword,
    Number(config_default.bcrypt_salt_rounds)
  );
  await prisma.user.update({
    where: {
      id: user.id
    },
    data: {
      passwordHash: hashedPassword
    }
  });
  await redis.del(redisKey);
};
var updateUserStatus = async (userId, adminOrganizationId, payload) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      deletedAt: null,
      memberships: {
        some: {
          organizationId: adminOrganizationId
        }
      }
    }
  });
  if (user?.status === payload.status) {
    throw new Error(`User is already ${payload.status}.`);
  }
  if (!user) {
    throw new Error("User not found.");
  }
  return prisma.user.update({
    where: {
      id: userId
    },
    data: {
      status: payload.status
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      emailVerified: true,
      status: true,
      authProvider: true,
      createdAt: true,
      updatedAt: true
    }
  });
};
var deleteMyAccount = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
      deletedAt: null
    },
    include: {
      memberships: true
    }
  });
  if (!user) {
    throw new Error("User not found.");
  }
  if (user.status === "INACTIVE") {
    throw new Error("User account is already inactive.");
  }
  if (user.memberships[0].role === "ADMIN") {
    throw new Error("Owner cannot delete their account.");
  }
  await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      deletedAt: /* @__PURE__ */ new Date(),
      status: "INACTIVE"
    }
  });
};
var updateProfileImage = async (userId, file) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
      deletedAt: null
    },
    select: {
      id: true,
      profileImagePublicId: true
    }
  });
  if (!user) {
    throw new Error("User not found.");
  }
  const uploadedImage = await cloudinaryService.uploadBuffer(
    file.buffer,
    {
      folder: "orbrin/users/profile-images",
      resourceType: "image"
    }
  );
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        profileImageUrl: uploadedImage.secureUrl,
        profileImagePublicId: uploadedImage.publicId
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        profileImageUrl: true,
        emailVerified: true,
        status: true,
        authProvider: true,
        createdAt: true,
        updatedAt: true
      }
    });
    if (user.profileImagePublicId) {
      await cloudinaryService.deleteAsset(
        user.profileImagePublicId,
        "image"
      );
    }
    return updatedUser;
  } catch (error) {
    await cloudinaryService.deleteAsset(
      uploadedImage.publicId,
      "image"
    );
    throw error;
  }
};
var deleteProfileImage = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
      deletedAt: null
    },
    select: {
      id: true,
      profileImagePublicId: true
    }
  });
  if (!user) {
    throw new Error("User not found.");
  }
  if (!user.profileImagePublicId) {
    throw new Error("Profile picture not found.");
  }
  await cloudinaryService.deleteAsset(
    user.profileImagePublicId,
    "image"
  );
  const updatedUser = await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      profileImageUrl: null,
      profileImagePublicId: null
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      profileImageUrl: true
    }
  });
  return updatedUser;
};
var userService = {
  getMyProfile,
  updateMyProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  updateUserStatus,
  deleteMyAccount,
  updateProfileImage,
  deleteProfileImage
};

// src/app/module/user/user.controller.ts
var getMyProfile2 = catch_async_default(
  async (req, res, next) => {
    if (!req.user?.id) {
      throw new Error("User ID is missing in the request context.");
    }
    const result = await userService.getMyProfile(req.user.id);
    sendSuccessResponse(res, {
      statusCode: StatusCodes9.OK,
      message: "Profile retrieved successfully",
      data: result
    });
  }
);
var updateMyProfile2 = catch_async_default(
  async (req, res, next) => {
    if (!req.user?.id) {
      throw new Error("User ID is missing in the request context.");
    }
    const result = await userService.updateMyProfile(req.user.id, req.body);
    sendSuccessResponse(res, {
      statusCode: StatusCodes9.OK,
      message: "Profile updated successfully",
      data: result
    });
  }
);
var changePassword2 = catch_async_default(
  async (req, res, next) => {
    if (!req.user?.id) {
      throw new Error("User ID is missing in the request context.");
    }
    await userService.changePassword(req.user.id, req.body);
    sendSuccessResponse(res, {
      statusCode: StatusCodes9.OK,
      message: "Password changed successfully",
      data: null
    });
  }
);
var forgotPassword2 = catch_async_default(
  async (req, res, next) => {
    await userService.forgotPassword(req.body);
    sendSuccessResponse(res, {
      statusCode: StatusCodes9.OK,
      message: "If an account with this email exists, a password reset link has been sent.",
      data: null
    });
  }
);
var resetPassword2 = catch_async_default(
  async (req, res, next) => {
    await userService.resetPassword(req.body);
    sendSuccessResponse(res, {
      statusCode: StatusCodes9.OK,
      message: "Password reset successfully",
      data: null
    });
  }
);
var updateUserStatus2 = catch_async_default(
  async (req, res, next) => {
    const admin = req.user;
    const adminOrganizationId = admin?.organizationId;
    if (!adminOrganizationId) {
      throw new Error(
        "Admin organization ID is missing in the request context."
      );
    }
    const { userId } = req.params;
    if (!userId) {
      throw new Error("User ID is required to update user status.");
    }
    const result = await userService.updateUserStatus(
      userId,
      adminOrganizationId,
      req.body
    );
    sendSuccessResponse(res, {
      statusCode: StatusCodes9.OK,
      message: "User status updated successfully",
      data: result
    });
  }
);
var deleteMyAccount2 = catch_async_default(
  async (req, res, next) => {
    if (!req.user?.id) {
      throw new Error("User ID is missing in the request context.");
    }
    await userService.deleteMyAccount(req.user.id);
    sendSuccessResponse(res, {
      statusCode: StatusCodes9.OK,
      message: "Account deleted successfully",
      data: null
    });
  }
);
var updateProfileImage2 = catch_async_default(
  async (req, res) => {
    if (!req.user?.id) {
      throw new Error(
        "User ID is missing in the request context."
      );
    }
    if (!req.file) {
      throw new Error("Profile picture is required.");
    }
    const result = await userService.updateProfileImage(
      req.user.id,
      req.file
    );
    sendSuccessResponse(res, {
      statusCode: StatusCodes9.OK,
      message: "Profile picture updated successfully",
      data: result
    });
  }
);
var deleteProfileImage2 = catch_async_default(
  async (req, res) => {
    if (!req.user?.id) {
      throw new Error(
        "User ID is missing in the request context."
      );
    }
    const result = await userService.deleteProfileImage(
      req.user.id
    );
    sendSuccessResponse(res, {
      statusCode: StatusCodes9.OK,
      message: "Profile picture deleted successfully",
      data: result
    });
  }
);
var userController = {
  getMyProfile: getMyProfile2,
  updateMyProfile: updateMyProfile2,
  changePassword: changePassword2,
  forgotPassword: forgotPassword2,
  resetPassword: resetPassword2,
  updateUserStatus: updateUserStatus2,
  deleteMyAccount: deleteMyAccount2,
  updateProfileImage: updateProfileImage2,
  deleteProfileImage: deleteProfileImage2
};

// src/app/module/user/user.schema.ts
import { z as z9 } from "zod";
var updateUserProfileValidationSchema = z9.object({
  body: z9.object({
    fullName: z9.string().trim().min(2, "Full name must be at least 2 characters").max(100, "Full name cannot exceed 100 characters")
  })
});
var changePasswordValidationSchema = z9.object({
  body: z9.object({
    currentPassword: z9.string().min(1, "Current password is required"),
    newPassword: z9.string().min(8, "Password must be at least 8 characters").max(100, "Password cannot exceed 100 characters")
  }).refine(
    (data) => data.currentPassword !== data.newPassword,
    {
      message: "New password must be different from current password",
      path: ["newPassword"]
    }
  )
});
var forgotPasswordValidationSchema = z9.object({
  body: z9.object({
    email: z9.string().email("Invalid email address").toLowerCase().trim()
  })
});
var resetPasswordValidationSchema = z9.object({
  body: z9.object({
    email: z9.email(),
    otp: z9.string().regex(/^\d{6}$/, "OTP must be 6 digits."),
    newPassword: z9.string().min(8)
  })
});
var updateUserStatusValidationSchema = z9.object({
  body: z9.object({
    status: z9.enum([
      "ACTIVE",
      "INACTIVE",
      "SUSPENDED"
    ])
  })
});

// src/app/module/user/user.route.ts
var router8 = Router8();
router8.post(
  "/forgot-password",
  validate(forgotPasswordValidationSchema),
  userController.forgotPassword
);
router8.post(
  "/reset-password",
  validate(resetPasswordValidationSchema),
  userController.resetPassword
);
router8.get(
  "/me",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  userController.getMyProfile
);
router8.patch(
  "/me",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  validate(updateUserProfileValidationSchema),
  userController.updateMyProfile
);
router8.patch(
  "/me/password",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  validate(changePasswordValidationSchema),
  userController.changePassword
);
router8.delete(
  "/me",
  authMiddleware.auth(Role.MANAGER, Role.MEMBER),
  userController.deleteMyAccount
);
router8.patch(
  "/:userId/status",
  authMiddleware.auth(Role.ADMIN),
  validate(updateUserStatusValidationSchema),
  userController.updateUserStatus
);
router8.patch(
  "/me/profile-picture",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  uploadImage.single("image"),
  userController.updateProfileImage
);
router8.delete(
  "/me/profile-picture",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  userController.deleteProfileImage
);
var userRoutes = router8;

// src/app/module/organization/organization.route.ts
import { Router as Router9 } from "express";

// src/app/module/organization/organization.controller.ts
import { StatusCodes as StatusCodes10 } from "http-status-codes";

// src/app/module/organization/organization.service.ts
var getMyOrganization = async (organizationId) => {
  const organization = await prisma.organization.findUnique({
    where: {
      id: organizationId,
      deletedAt: null
    },
    select: {
      id: true,
      name: true,
      slug: true,
      createdAt: true,
      updatedAt: true,
      memberships: {
        where: {
          status: "ACTIVE",
          user: {
            deletedAt: null
          }
        },
        select: {
          id: true,
          role: true,
          status: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
              emailVerified: true,
              status: true
            }
          }
        }
      },
      _count: {
        select: {
          memberships: true,
          teams: true,
          projects: true
        }
      }
    }
  });
  if (!organization) {
    throw new Error("Organization not found.");
  }
  return organization;
};
var updateOrganization = async (organizationId, payload) => {
  const organization = await prisma.organization.findUnique({
    where: {
      id: organizationId,
      deletedAt: null
    }
  });
  if (!organization) {
    throw new Error("Organization not found.");
  }
  if (payload.slug && payload.slug !== organization.slug) {
    const existingOrganization = await prisma.organization.findUnique({
      where: {
        slug: payload.slug
      }
    });
    if (existingOrganization) {
      throw new Error("An organization with this slug already exists.");
    }
  }
  return prisma.organization.update({
    where: {
      id: organizationId
    },
    data: {
      ...payload.name !== void 0 && {
        name: payload.name
      },
      ...payload.slug !== void 0 && {
        slug: payload.slug
      }
    },
    select: {
      id: true,
      name: true,
      slug: true,
      createdAt: true,
      updatedAt: true
    }
  });
};
var deleteOrganization = async (organizationId) => {
  const organization = await prisma.organization.findUnique({
    where: {
      id: organizationId,
      deletedAt: null
    }
  });
  if (!organization) {
    throw new Error("Organization not found.");
  }
  await prisma.organization.update({
    where: {
      id: organizationId
    },
    data: {
      deletedAt: /* @__PURE__ */ new Date()
    }
  });
};
var getOrganizationMembers = async (organizationId, query) => {
  const { page, limit, search, sortBy, sortOrder, role, status } = query;
  const where = {
    organizationId,
    status,
    ...role ? { role } : {},
    user: {
      deletedAt: null,
      ...search ? {
        OR: [
          { fullName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } }
        ]
      } : {}
    }
  };
  const orderBy = sortBy === "role" ? { role: sortOrder } : { [sortBy]: sortOrder };
  const [members, total] = await prisma.$transaction([
    prisma.organizationMembership.findMany({
      where,
      ...getPagination(page, limit),
      select: {
        id: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            emailVerified: true,
            status: true
          }
        }
      },
      orderBy
    }),
    prisma.organizationMembership.count({ where })
  ]);
  return {
    data: members,
    pagination: createPaginationMeta(page, limit, total)
  };
};
var getOrganizationMemberById = async (organizationId, memberId) => {
  const membership = await prisma.organizationMembership.findFirst({
    where: {
      id: memberId,
      organizationId,
      user: {
        deletedAt: null
      }
    },
    select: {
      id: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          email: true,
          fullName: true,
          emailVerified: true,
          status: true
        }
      }
    }
  });
  if (!membership) {
    throw new Error("Organization member not found.");
  }
  return membership;
};
var updateMemberRole = async (organizationId, memberId, payload) => {
  const membership = await prisma.organizationMembership.findFirst({
    where: {
      id: memberId,
      organizationId
    }
  });
  if (!membership) {
    throw new Error("Organization member not found.");
  }
  if (membership.role === "ADMIN") {
    throw new Error("Cannot update the role of an ADMIN member.");
  }
  if (payload.role === "ADMIN") {
    throw new Error("Cannot assign ADMIN role to a member.");
  }
  return prisma.organizationMembership.update({
    where: {
      id: membership.id
    },
    data: {
      role: payload.role
    },
    select: {
      id: true,
      role: true,
      status: true,
      user: {
        select: {
          id: true,
          email: true,
          fullName: true
        }
      }
    }
  });
};
var updateMemberStatus = async (organizationId, memberId, payload) => {
  const membership = await prisma.organizationMembership.findFirst({
    where: {
      id: memberId,
      organizationId
    }
  });
  if (!membership) {
    throw new Error("Organization member not found.");
  }
  if (membership?.role === "ADMIN" && payload.status !== "ACTIVE") {
    throw new Error("Cannot change the status of an Admin.");
  }
  return prisma.organizationMembership.update({
    where: {
      id: membership.id
    },
    data: {
      status: payload.status
    },
    select: {
      id: true,
      role: true,
      status: true,
      user: {
        select: {
          id: true,
          email: true,
          fullName: true
        }
      }
    }
  });
};
var removeMember = async (organizationId, memberId) => {
  const membership = await prisma.organizationMembership.findFirst({
    where: {
      id: memberId,
      organizationId
    }
  });
  if (!membership) {
    throw new Error("Organization member not found.");
  }
  if (membership.role === "ADMIN") {
    throw new Error("Organization admin cannot be removed directly.");
  }
  await prisma.organizationMembership.delete({
    where: {
      id: membership.id
    }
  });
};
var leaveOrganization = async (organizationId, userId) => {
  const membership = await prisma.organizationMembership.findUnique({
    where: {
      organizationId_userId: {
        organizationId,
        userId
      }
    }
  });
  if (!membership) {
    throw new Error("You are not a member of this organization.");
  }
  if (membership.role === "ADMIN") {
    throw new Error("Organization admin cannot leave the organization.");
  }
  await prisma.organizationMembership.delete({
    where: {
      id: membership.id
    }
  });
};
var updateOrganizationLogo = async (organizationId, file) => {
  const organization = await prisma.organization.findFirst({
    where: {
      id: organizationId,
      deletedAt: null
    },
    select: {
      id: true,
      logoPublicId: true
    }
  });
  if (!organization) {
    throw new Error("Organization not found.");
  }
  const uploadedLogo = await cloudinaryService.uploadBuffer(file.buffer, {
    folder: `orbrin/organizations/${organizationId}/logo`,
    resourceType: "image"
  });
  try {
    const updatedOrganization = await prisma.organization.update({
      where: {
        id: organizationId
      },
      data: {
        logoUrl: uploadedLogo.secureUrl,
        logoPublicId: uploadedLogo.publicId
      },
      select: {
        id: true,
        name: true,
        slug: true,
        logoUrl: true,
        createdAt: true,
        updatedAt: true
      }
    });
    if (organization.logoPublicId) {
      try {
        await cloudinaryService.deleteAsset(organization.logoPublicId, "image");
      } catch (error) {
        console.error("Failed to delete old organization logo:", error);
      }
    }
    return updatedOrganization;
  } catch (error) {
    try {
      await cloudinaryService.deleteAsset(uploadedLogo.publicId, "image");
    } catch (cleanupError) {
      console.error("Failed to cleanup uploaded logo:", cleanupError);
    }
    throw error;
  }
};
var deleteOrganizationLogo = async (organizationId) => {
  const organization = await prisma.organization.findFirst({
    where: {
      id: organizationId,
      deletedAt: null
    },
    select: {
      id: true,
      logoPublicId: true
    }
  });
  if (!organization) {
    throw new Error("Organization not found.");
  }
  if (!organization.logoPublicId) {
    throw new Error("Organization logo not found.");
  }
  await cloudinaryService.deleteAsset(organization.logoPublicId, "image");
  return prisma.organization.update({
    where: {
      id: organizationId
    },
    data: {
      logoUrl: null,
      logoPublicId: null
    },
    select: {
      id: true,
      name: true,
      slug: true,
      logoUrl: true
    }
  });
};
var organizationService = {
  getMyOrganization,
  updateOrganization,
  deleteOrganization,
  getOrganizationMembers,
  getOrganizationMemberById,
  updateMemberRole,
  updateMemberStatus,
  removeMember,
  leaveOrganization,
  updateOrganizationLogo,
  deleteOrganizationLogo
};

// src/app/module/organization/organization.controller.ts
var getMyOrganization2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    console.log("organizationId", req.user);
    if (!organizationId) {
      throw new Error("Organization ID is missing ");
    }
    const result = await organizationService.getMyOrganization(organizationId);
    sendSuccessResponse(res, {
      statusCode: StatusCodes10.OK,
      message: "Organization retrieved successfully",
      data: result
    });
  }
);
var updateOrganization2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    const result = await organizationService.updateOrganization(
      organizationId,
      req.body
    );
    sendSuccessResponse(res, {
      statusCode: StatusCodes10.OK,
      message: "Organization updated successfully",
      data: result
    });
  }
);
var deleteOrganization2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    await organizationService.deleteOrganization(organizationId);
    sendSuccessResponse(res, {
      statusCode: StatusCodes10.OK,
      message: "Organization deleted successfully",
      data: null
    });
  }
);
var getOrganizationMembers2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    const query = req.validatedQuery;
    const result = await organizationService.getOrganizationMembers(
      organizationId,
      query
    );
    sendSuccessResponse(res, {
      statusCode: StatusCodes10.OK,
      message: "Organization members retrieved successfully",
      data: result.data,
      pagination: result.pagination
    });
  }
);
var getOrganizationMemberById2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    const { memberId } = req.params;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    if (!memberId) {
      throw new Error("Member ID is required.");
    }
    const result = await organizationService.getOrganizationMemberById(
      organizationId,
      memberId
    );
    sendSuccessResponse(res, {
      statusCode: StatusCodes10.OK,
      message: "Organization member retrieved successfully",
      data: result
    });
  }
);
var updateMemberRole2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    const { memberId } = req.params;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    if (!memberId) {
      throw new Error("Member ID is required.");
    }
    const result = await organizationService.updateMemberRole(
      organizationId,
      memberId,
      req.body
    );
    sendSuccessResponse(res, {
      statusCode: StatusCodes10.OK,
      message: "Member role updated successfully",
      data: result
    });
  }
);
var updateMemberStatus2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    const { memberId } = req.params;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    if (!memberId) {
      throw new Error("Member ID is required.");
    }
    const result = await organizationService.updateMemberStatus(
      organizationId,
      memberId,
      req.body
    );
    sendSuccessResponse(res, {
      statusCode: StatusCodes10.OK,
      message: "Member status updated successfully",
      data: result
    });
  }
);
var removeMember2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    const { memberId } = req.params;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    if (!memberId) {
      throw new Error("Member ID is required.");
    }
    await organizationService.removeMember(organizationId, memberId);
    sendSuccessResponse(res, {
      statusCode: StatusCodes10.OK,
      message: "Member removed successfully",
      data: null
    });
  }
);
var leaveOrganization2 = catch_async_default(
  async (req, res, next) => {
    const organizationId = req.user?.organizationId;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    if (!req.user?.id) {
      throw new Error("User ID is missing in the request context.");
    }
    await organizationService.leaveOrganization(organizationId, req.user.id);
    sendSuccessResponse(res, {
      statusCode: StatusCodes10.OK,
      message: "You left the organization successfully",
      data: null
    });
  }
);
var updateOrganizationLogo2 = catch_async_default(
  async (req, res) => {
    const organizationId = req.user?.organizationId;
    console.log("organizationId", req.user);
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    if (!req.file) {
      throw new Error("Organization logo is required.");
    }
    const result = await organizationService.updateOrganizationLogo(
      organizationId,
      req.file
    );
    sendSuccessResponse(res, {
      statusCode: StatusCodes10.OK,
      message: "Organization logo updated successfully",
      data: result
    });
  }
);
var deleteOrganizationLogo2 = catch_async_default(
  async (req, res) => {
    const organizationId = req.user?.organizationId;
    if (!organizationId) {
      throw new Error("Organization ID is missing in the request context.");
    }
    const result = await organizationService.deleteOrganizationLogo(organizationId);
    sendSuccessResponse(res, {
      statusCode: StatusCodes10.OK,
      message: "Organization logo deleted successfully",
      data: result
    });
  }
);
var organizationController = {
  getMyOrganization: getMyOrganization2,
  updateOrganization: updateOrganization2,
  deleteOrganization: deleteOrganization2,
  getOrganizationMembers: getOrganizationMembers2,
  getOrganizationMemberById: getOrganizationMemberById2,
  updateMemberRole: updateMemberRole2,
  updateMemberStatus: updateMemberStatus2,
  removeMember: removeMember2,
  leaveOrganization: leaveOrganization2,
  updateOrganizationLogo: updateOrganizationLogo2,
  deleteOrganizationLogo: deleteOrganizationLogo2
};

// src/app/module/organization/organization.schema.ts
import { z as z10 } from "zod";
var updateOrganizationValidationSchema = z10.object({
  body: z10.object({
    name: z10.string().trim().min(2, "Organization name must be at least 2 characters").max(100, "Organization name cannot exceed 100 characters").optional(),
    slug: z10.string().trim().toLowerCase().min(2, "Organization slug must be at least 2 characters").max(100, "Organization slug cannot exceed 100 characters").regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    ).optional()
  })
});
var updateMemberRoleValidationSchema = z10.object({
  body: z10.object({
    role: z10.enum([Role.MEMBER, Role.MANAGER])
  })
});
var updateMemberStatusValidationSchema = z10.object({
  body: z10.object({
    status: z10.enum([
      OrganizationMembershipStatus.ACTIVE,
      OrganizationMembershipStatus.INACTIVE,
      OrganizationMembershipStatus.SUSPENDED
    ])
  })
});
var organizationMemberQuerySchema = paginationQuerySchema.extend({
  search: z10.string().trim().min(1).optional(),
  sortBy: z10.enum(["createdAt", "updatedAt", "role"]).default("createdAt"),
  sortOrder: sortOrderSchema.default("desc"),
  role: z10.enum([Role.ADMIN, Role.MANAGER, Role.MEMBER]).optional(),
  status: z10.enum([
    OrganizationMembershipStatus.ACTIVE,
    OrganizationMembershipStatus.INACTIVE,
    OrganizationMembershipStatus.SUSPENDED
  ]).default(OrganizationMembershipStatus.ACTIVE)
});

// src/app/module/organization/organization.route.ts
var router9 = Router9();
router9.get(
  "/me",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  organizationController.getMyOrganization
);
router9.patch(
  "/me",
  authMiddleware.auth(Role.ADMIN),
  validate(updateOrganizationValidationSchema),
  organizationController.updateOrganization
);
router9.delete(
  "/me",
  authMiddleware.auth(Role.ADMIN),
  organizationController.deleteOrganization
);
router9.get(
  "/members",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  validateQuery(organizationMemberQuerySchema),
  organizationController.getOrganizationMembers
);
router9.get(
  "/members/:memberId",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER, Role.MEMBER),
  organizationController.getOrganizationMemberById
);
router9.patch(
  "/members/:memberId/role",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  validate(updateMemberRoleValidationSchema),
  organizationController.updateMemberRole
);
router9.patch(
  "/members/:memberId/status",
  authMiddleware.auth(Role.ADMIN, Role.MANAGER),
  validate(updateMemberStatusValidationSchema),
  organizationController.updateMemberStatus
);
router9.delete(
  "/members/:memberId",
  authMiddleware.auth(Role.ADMIN),
  organizationController.removeMember
);
router9.post(
  "/leave",
  authMiddleware.auth(Role.ADMIN),
  organizationController.leaveOrganization
);
router9.patch(
  "/me/logo",
  authMiddleware.auth(Role.ADMIN),
  uploadImage.single("image"),
  organizationController.updateOrganizationLogo
);
router9.delete(
  "/me/logo",
  authMiddleware.auth(Role.ADMIN),
  organizationController.deleteOrganizationLogo
);
var organizationRoutes = router9;

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
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/organizations", organizationRoutes);
app.use("/api/v1/teams", teamRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/sprints", sprintRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/subscriptions", subscriptionRoutes);
app.use(not_found_default);
app.use(global_error_default);
var app_default = app;

// src/app/utils/seed.ts
import bcrypt3 from "bcrypt";
var seedDatabase = async () => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: config_default.demo_email
      }
    });
    if (existingUser) {
      console.log("\u{1F331} Demo user already exists. Skipping seed.");
      return;
    }
    const hashedPassword = await bcrypt3.hash(
      config_default.demo_password,
      Number(config_default.bcrypt_salt_rounds)
    );
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          fullName: "Orbrin Demo Owner",
          email: config_default.demo_email,
          passwordHash: hashedPassword,
          emailVerified: true
        }
      });
      const organization = await tx.organization.create({
        data: {
          name: "Orbrin Demo Organization",
          slug: config_default.demo_slug
        }
      });
      await tx.organizationMembership.create({
        data: {
          userId: user.id,
          organizationId: organization.id,
          role: "ADMIN",
          status: "ACTIVE"
        }
      });
      console.log("Org seeded");
    });
  } catch (error) {
    console.error("Database seed failed:", error);
  }
};
var seed_default = seedDatabase;

// src/server.ts
var port = config_default.port;
async function main() {
  try {
    await prisma.$connect();
    await seed_default();
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