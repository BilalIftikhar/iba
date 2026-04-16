-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('superadmin', 'admin', 'user');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'user';
