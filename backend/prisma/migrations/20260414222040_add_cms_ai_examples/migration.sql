-- CreateTable
CREATE TABLE "CmsAiExample" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon_url" TEXT,
    "icon_emoji" TEXT,
    "display_order" INTEGER NOT NULL DEFAULT 10,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "enquiry_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CmsAiExample_pkey" PRIMARY KEY ("id")
);
