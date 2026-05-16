import { relations, sql } from 'drizzle-orm';
import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';
import { randomUUID } from 'node:crypto';

const id = () => text('id').primaryKey().$defaultFn(randomUUID);

const createdAt = () =>
  integer('createdAt', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`)
    .$defaultFn(() => new Date());

const updatedAt = () =>
  integer('updatedAt', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`)
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date());

export const user = sqliteTable('user', {
  id: id(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('emailVerified', { mode: 'boolean' })
    .notNull()
    .default(false),
  image: text('image'),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const application = sqliteTable('application', {
  id: id(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  audience: text('audience').notNull().unique(),
  clientId: text('clientId').notNull().unique().$defaultFn(randomUUID),
  clientSecretHash: text('clientSecretHash'),
  type: text('type', { enum: ['web', 'native', 'service'] })
    .notNull()
    .default('web'),
  description: text('description'),
  homepageUrl: text('homepageUrl'),
  logoUrl: text('logoUrl'),
  isActive: integer('isActive', { mode: 'boolean' }).notNull().default(true),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const session = sqliteTable(
  'session',
  {
    id: id(),
    expiresAt: integer('expiresAt', { mode: 'timestamp' }).notNull(),
    token: text('token').notNull().unique(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    ipAddress: text('ipAddress'),
    userAgent: text('userAgent'),
    userId: text('userId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    applicationId: text('applicationId').references(() => application.id, {
      onDelete: 'set null',
    }),
    audience: text('audience'),
  },
  (table) => [
    index('session_userId_idx').on(table.userId),
    index('session_applicationId_idx').on(table.applicationId),
  ],
);

export const account = sqliteTable(
  'account',
  {
    id: id(),
    accountId: text('accountId').notNull(),
    providerId: text('providerId').notNull(),
    userId: text('userId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('accessToken'),
    refreshToken: text('refreshToken'),
    idToken: text('idToken'),
    accessTokenExpiresAt: integer('accessTokenExpiresAt', {
      mode: 'timestamp',
    }),
    refreshTokenExpiresAt: integer('refreshTokenExpiresAt', {
      mode: 'timestamp',
    }),
    scope: text('scope'),
    password: text('password'),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    index('account_userId_idx').on(table.userId),
    uniqueIndex('account_provider_account_unique').on(
      table.providerId,
      table.accountId,
    ),
  ],
);

export const verification = sqliteTable(
  'verification',
  {
    id: id(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: integer('expiresAt', { mode: 'timestamp' }).notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [index('verification_identifier_idx').on(table.identifier)],
);

export const jwks = sqliteTable('jwks', {
  id: id(),
  publicKey: text('publicKey').notNull(),
  privateKey: text('privateKey').notNull(),
  createdAt: createdAt(),
  expiresAt: integer('expiresAt', { mode: 'timestamp' }).notNull(),
});

export const applicationRedirectUri = sqliteTable(
  'applicationRedirectUri',
  {
    id: id(),
    applicationId: text('applicationId')
      .notNull()
      .references(() => application.id, { onDelete: 'cascade' }),
    uri: text('uri').notNull(),
    createdAt: createdAt(),
  },
  (table) => [
    index('applicationRedirectUri_applicationId_idx').on(table.applicationId),
    uniqueIndex('applicationRedirectUri_application_uri_unique').on(
      table.applicationId,
      table.uri,
    ),
  ],
);

export const applicationOrigin = sqliteTable(
  'applicationOrigin',
  {
    id: id(),
    applicationId: text('applicationId')
      .notNull()
      .references(() => application.id, { onDelete: 'cascade' }),
    origin: text('origin').notNull(),
    createdAt: createdAt(),
  },
  (table) => [
    index('applicationOrigin_applicationId_idx').on(table.applicationId),
    uniqueIndex('applicationOrigin_application_origin_unique').on(
      table.applicationId,
      table.origin,
    ),
  ],
);

export const applicationScope = sqliteTable(
  'applicationScope',
  {
    id: id(),
    applicationId: text('applicationId')
      .notNull()
      .references(() => application.id, { onDelete: 'cascade' }),
    scope: text('scope').notNull(),
    description: text('description'),
    createdAt: createdAt(),
  },
  (table) => [
    index('applicationScope_applicationId_idx').on(table.applicationId),
    uniqueIndex('applicationScope_application_scope_unique').on(
      table.applicationId,
      table.scope,
    ),
  ],
);

export const applicationUser = sqliteTable(
  'applicationUser',
  {
    id: id(),
    applicationId: text('applicationId')
      .notNull()
      .references(() => application.id, { onDelete: 'cascade' }),
    userId: text('userId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    role: text('role').notNull().default('user'),
    scopes: text('scopes').notNull().default('[]'),
    isActive: integer('isActive', { mode: 'boolean' }).notNull().default(true),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    lastLoginAt: integer('lastLoginAt', { mode: 'timestamp' }),
  },
  (table) => [
    index('applicationUser_applicationId_idx').on(table.applicationId),
    index('applicationUser_userId_idx').on(table.userId),
    uniqueIndex('applicationUser_application_user_unique').on(
      table.applicationId,
      table.userId,
    ),
  ],
);

export const userRelations = relations(user, ({ many }) => ({
  accounts: many(account),
  sessions: many(session),
  applications: many(applicationUser),
}));

export const applicationRelations = relations(application, ({ many }) => ({
  redirectUris: many(applicationRedirectUri),
  origins: many(applicationOrigin),
  scopes: many(applicationScope),
  members: many(applicationUser),
  sessions: many(session),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
  application: one(application, {
    fields: [session.applicationId],
    references: [application.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const applicationRedirectUriRelations = relations(
  applicationRedirectUri,
  ({ one }) => ({
    application: one(application, {
      fields: [applicationRedirectUri.applicationId],
      references: [application.id],
    }),
  }),
);

export const applicationOriginRelations = relations(
  applicationOrigin,
  ({ one }) => ({
    application: one(application, {
      fields: [applicationOrigin.applicationId],
      references: [application.id],
    }),
  }),
);

export const applicationScopeRelations = relations(
  applicationScope,
  ({ one }) => ({
    application: one(application, {
      fields: [applicationScope.applicationId],
      references: [application.id],
    }),
  }),
);

export const applicationUserRelations = relations(
  applicationUser,
  ({ one }) => ({
    application: one(application, {
      fields: [applicationUser.applicationId],
      references: [application.id],
    }),
    user: one(user, {
      fields: [applicationUser.userId],
      references: [user.id],
    }),
  }),
);
