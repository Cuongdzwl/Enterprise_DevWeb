/*
  Warnings:

  - You are about to drop the `notifications` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[notifications] DROP CONSTRAINT [notifications_NotificationSentTypeID_fkey];

-- DropTable
DROP TABLE [dbo].[notifications];

-- CreateTable
CREATE TABLE [dbo].[scheduledNotifications] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [NotificationSentTypeID] INT NOT NULL,
    [EventID] INT NOT NULL,
    [SentTo] INT NOT NULL,
    [SentAt] DATETIME2 NOT NULL,
    [TransactionID] NVARCHAR(1000),
    [Acknowledged] BIT,
    [Status] NVARCHAR(1000),
    [IsCancelled] BIT NOT NULL CONSTRAINT [scheduledNotifications_IsCancelled_df] DEFAULT 0,
    CONSTRAINT [scheduledNotifications_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- AddForeignKey
ALTER TABLE [dbo].[scheduledNotifications] ADD CONSTRAINT [scheduledNotifications_NotificationSentTypeID_fkey] FOREIGN KEY ([NotificationSentTypeID]) REFERENCES [dbo].[notificationSentTypes]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[scheduledNotifications] ADD CONSTRAINT [scheduledNotifications_EventID_fkey] FOREIGN KEY ([EventID]) REFERENCES [dbo].[events]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
