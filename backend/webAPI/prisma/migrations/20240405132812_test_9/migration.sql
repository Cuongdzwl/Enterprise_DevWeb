BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[files] DROP CONSTRAINT [files_ContributionID_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[scheduledNotifications] DROP CONSTRAINT [scheduledNotifications_EventID_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[scheduledNotifications] DROP CONSTRAINT [scheduledNotifications_NotificationSentTypeID_fkey];

-- AlterTable
ALTER TABLE [dbo].[scheduledNotifications] ALTER COLUMN [EventID] INT NULL;

-- AddForeignKey
ALTER TABLE [dbo].[files] ADD CONSTRAINT [files_ContributionID_fkey] FOREIGN KEY ([ContributionID]) REFERENCES [dbo].[contributions]([ID]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[scheduledNotifications] ADD CONSTRAINT [scheduledNotifications_NotificationSentTypeID_fkey] FOREIGN KEY ([NotificationSentTypeID]) REFERENCES [dbo].[notificationSentTypes]([ID]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[scheduledNotifications] ADD CONSTRAINT [scheduledNotifications_EventID_fkey] FOREIGN KEY ([EventID]) REFERENCES [dbo].[events]([ID]) ON DELETE CASCADE ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
