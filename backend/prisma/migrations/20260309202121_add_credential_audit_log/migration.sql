-- CreateEnum
CREATE TYPE "WorkflowStatus" AS ENUM ('active', 'paused', 'deploying');

-- CreateEnum
CREATE TYPE "BookingType" AS ENUM ('automation', 'cowork', 'custom_app', 'implementation');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('draft', 'booked', 'in_review', 'in_progress', 'deployed', 'paused', 'cancelled');

-- CreateEnum
CREATE TYPE "CredentialType" AS ENUM ('api_key', 'webhook', 'software');

-- CreateEnum
CREATE TYPE "CredentialEnvironment" AS ENUM ('production', 'staging', 'development');

-- CreateEnum
CREATE TYPE "OtpPurpose" AS ENUM ('login', 'credential_reveal');

-- CreateEnum
CREATE TYPE "MessageCategory" AS ENUM ('support', 'booking', 'credential');

-- CreateEnum
CREATE TYPE "ThreadStatus" AS ENUM ('open', 'closed');

-- CreateEnum
CREATE TYPE "SenderType" AS ENUM ('client', 'admin');

-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('free', 'pro', 'enterprise');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('active', 'trialing', 'past_due', 'cancelled');

-- CreateEnum
CREATE TYPE "BillingCycle" AS ENUM ('monthly', 'annual');

-- CreateEnum
CREATE TYPE "TeamRole" AS ENUM ('viewer', 'editor', 'admin');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('message', 'booking_update', 'automation_deployed', 'automation_stopped', 'automation_started', 'automation_error', 'order_confirmed');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "company_name" TEXT,
    "phone" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "hourly_rate" DECIMAL(10,2) NOT NULL,
    "account_manager_id" TEXT,
    "notification_preferences" JSONB NOT NULL DEFAULT '{"email": true, "whatsapp": false}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IbaWorkflow" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "n8n_workflow_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "booking_id" TEXT,
    "status" "WorkflowStatus" NOT NULL DEFAULT 'active',
    "time_saving_multiplier" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deployed_at" TIMESTAMP(3),

    CONSTRAINT "IbaWorkflow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "type" "BookingType" NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'draft',
    "title" TEXT,
    "use_case" TEXT NOT NULL,
    "problem" TEXT,
    "outcome" TEXT,
    "tools_list" JSONB,
    "schedule_frequency" TEXT,
    "notifications" JSONB,
    "draft_state" JSONB,
    "timeline_setup_days" INTEGER,
    "deployment_date" TIMESTAMP(3),
    "booked_at" TIMESTAMP(3),
    "deployed_at" TIMESTAMP(3),

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Credential" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "type" "CredentialType" NOT NULL,
    "name" TEXT NOT NULL,
    "service" TEXT,
    "environment" "CredentialEnvironment" NOT NULL DEFAULT 'production',
    "fields_encrypted" JSONB NOT NULL,
    "added_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_used_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Credential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OtpCode" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "code_hash" TEXT NOT NULL,
    "purpose" "OtpPurpose" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),

    CONSTRAINT "OtpCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageThread" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "category" "MessageCategory" NOT NULL,
    "related_entity_id" TEXT,
    "status" "ThreadStatus" NOT NULL DEFAULT 'open',
    "last_message_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageThread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "thread_id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "sender_type" "SenderType" NOT NULL,
    "body" TEXT NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read_at" TIMESTAMP(3),

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "plan" "SubscriptionPlan" NOT NULL DEFAULT 'free',
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'trialing',
    "billing_cycle" "BillingCycle" NOT NULL DEFAULT 'monthly',
    "stripe_subscription_id" TEXT,
    "next_billing_date" TIMESTAMP(3),
    "automations_used" INTEGER NOT NULL DEFAULT 0,
    "automations_limit" INTEGER NOT NULL DEFAULT 1,
    "cancels_at_period_end" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "owner_user_id" TEXT NOT NULL,
    "member_user_id" TEXT NOT NULL,
    "role" "TeamRole" NOT NULL DEFAULT 'viewer',
    "invited_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accepted_at" TIMESTAMP(3),

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credentials_audit_log" (
    "id" TEXT NOT NULL,
    "credential_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "ip_address" TEXT,
    "revealed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credentials_audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "booking_id" TEXT,
    "read_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "IbaWorkflow_n8n_workflow_id_key" ON "IbaWorkflow"("n8n_workflow_id");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_client_id_key" ON "Subscription"("client_id");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_owner_user_id_member_user_id_key" ON "TeamMember"("owner_user_id", "member_user_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_account_manager_id_fkey" FOREIGN KEY ("account_manager_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IbaWorkflow" ADD CONSTRAINT "IbaWorkflow_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IbaWorkflow" ADD CONSTRAINT "IbaWorkflow_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credential" ADD CONSTRAINT "Credential_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OtpCode" ADD CONSTRAINT "OtpCode_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageThread" ADD CONSTRAINT "MessageThread_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "MessageThread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_member_user_id_fkey" FOREIGN KEY ("member_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credentials_audit_log" ADD CONSTRAINT "credentials_audit_log_credential_id_fkey" FOREIGN KEY ("credential_id") REFERENCES "Credential"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
