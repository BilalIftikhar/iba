-- AlterEnum
ALTER TYPE "BookingStatus" ADD VALUE 'submitted';

-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'system';

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "admin_notes" TEXT;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "attachment_name" TEXT,
ADD COLUMN     "attachment_url" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "admin_notes" TEXT;

-- CreateTable
CREATE TABLE "CustomerSegment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "icon" TEXT,
    "rule_plan" TEXT,
    "rule_status" TEXT,
    "rule_bookings_min" INTEGER,
    "rule_joined_days" INTEGER,
    "rule_automation_pct" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerSegment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CmsAutomationTemplate" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "short_description" TEXT,
    "full_description" TEXT,
    "use_case" TEXT NOT NULL,
    "time_saved_weekly" TEXT,
    "time_saved_yearly" TEXT,
    "roi_yearly" TEXT,
    "setup_time" TEXT,
    "difficulty" TEXT,
    "tools" TEXT,
    "run_schedule" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "display_order" INTEGER NOT NULL DEFAULT 10,
    "bookings_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CmsAutomationTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ManualSegmentMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ManualSegmentMembers_AB_unique" ON "_ManualSegmentMembers"("A", "B");

-- CreateIndex
CREATE INDEX "_ManualSegmentMembers_B_index" ON "_ManualSegmentMembers"("B");

-- AddForeignKey
ALTER TABLE "_ManualSegmentMembers" ADD CONSTRAINT "_ManualSegmentMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "CustomerSegment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ManualSegmentMembers" ADD CONSTRAINT "_ManualSegmentMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
