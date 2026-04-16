-- CreateTable
CREATE TABLE "CmsAppTemplate" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "icon" TEXT,
    "short_description" TEXT,
    "full_description" TEXT,
    "use_case" TEXT NOT NULL,
    "roi_yearly" TEXT,
    "delivery_time" TEXT,
    "difficulty" TEXT,
    "key_features" TEXT,
    "data_sources" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "display_order" INTEGER NOT NULL DEFAULT 10,
    "bookings_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CmsAppTemplate_pkey" PRIMARY KEY ("id")
);
