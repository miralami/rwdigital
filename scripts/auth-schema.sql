-- Better Auth tables (emailAndPassword + admin plugin), dialek MySQL/MariaDB.
-- Berbasis: npx @better-auth/cli generate --config src/lib/server/auth.ts
-- Terapkan dengan: npm run db:auth  (atau otomatis lewat npm run db:setup)
-- Selaraskan dengan src/lib/server/auth.ts bila plugin berubah.

create table if not exists `user` (
  `id` varchar(36) not null primary key,
  `name` varchar(255) not null,
  `email` varchar(255) not null unique,
  `emailVerified` tinyint(1) not null default 0,
  `image` text,
  `createdAt` datetime(3) not null default current_timestamp(3),
  `updatedAt` datetime(3) not null default current_timestamp(3),
  `role` varchar(255),
  `banned` tinyint(1) default 0,
  `banReason` text,
  `banExpires` datetime(3)
);

create table if not exists `session` (
  `id` varchar(36) not null primary key,
  `expiresAt` datetime(3) not null,
  `token` varchar(255) not null unique,
  `createdAt` datetime(3) not null default current_timestamp(3),
  `updatedAt` datetime(3) not null default current_timestamp(3),
  `ipAddress` text,
  `userAgent` text,
  `userId` varchar(36) not null,
  `impersonatedBy` text,
  constraint `session_userId_fk` foreign key (`userId`) references `user` (`id`) on delete cascade
);

create table if not exists `account` (
  `id` varchar(36) not null primary key,
  `accountId` text not null,
  `providerId` text not null,
  `userId` varchar(36) not null,
  `accessToken` text,
  `refreshToken` text,
  `idToken` text,
  `accessTokenExpiresAt` datetime(3),
  `refreshTokenExpiresAt` datetime(3),
  `scope` text,
  `password` text,
  `createdAt` datetime(3) not null default current_timestamp(3),
  `updatedAt` datetime(3) not null default current_timestamp(3),
  constraint `account_userId_fk` foreign key (`userId`) references `user` (`id`) on delete cascade
);

create table if not exists `verification` (
  `id` varchar(36) not null primary key,
  `identifier` varchar(255) not null,
  `value` text not null,
  `expiresAt` datetime(3) not null,
  `createdAt` datetime(3) not null default current_timestamp(3),
  `updatedAt` datetime(3) not null default current_timestamp(3)
);

-- MySQL tidak punya `create index if not exists`; index dibuat di db-setup.mts
-- (cek information_schema dulu) agar skrip aman dijalankan berulang.
