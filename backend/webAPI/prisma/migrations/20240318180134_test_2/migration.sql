/*
  Warnings:

  - You are about to drop the column `IsPublic` on the `files` table. All the data in the column will be lost.
  - Made the column `ContributionID` on table `files` required. This step will fail if there are existing NULL values in that column.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[files] DROP CONSTRAINT [files_ContributionID_fkey];

-- AlterTable
ALTER TABLE [dbo].[comments] ADD CONSTRAINT [comments_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP FOR [UpdatedAt];

-- AlterTable
ALTER TABLE [dbo].[contributions] ADD CONSTRAINT [contributions_IsApproved_df] DEFAULT 0 FOR [IsApproved], CONSTRAINT [contributions_IsPublic_df] DEFAULT 0 FOR [IsPublic], CONSTRAINT [contributions_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP FOR [UpdatedAt];

-- AlterTable
ALTER TABLE [dbo].[events] ADD CONSTRAINT [events_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP FOR [UpdatedAt];

-- AlterTable
ALTER TABLE [dbo].[faculties] ADD CONSTRAINT [faculties_IsEnabledGuest_df] DEFAULT 0 FOR [IsEnabledGuest], CONSTRAINT [faculties_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP FOR [UpdatedAt];

-- AlterTable
ALTER TABLE [dbo].[files] ALTER COLUMN [CreatedAt] DATETIME2 NULL;
ALTER TABLE [dbo].[files] ALTER COLUMN [UpdatedAt] DATETIME2 NULL;
ALTER TABLE [dbo].[files] ALTER COLUMN [ContributionID] INT NOT NULL;
ALTER TABLE [dbo].[files] DROP COLUMN [IsPublic];
ALTER TABLE [dbo].[files] ADD CONSTRAINT [files_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP FOR [UpdatedAt];

-- AlterTable
ALTER TABLE [dbo].[users] ADD CONSTRAINT [users_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP FOR [UpdatedAt];

-- AddForeignKey
ALTER TABLE [dbo].[files] ADD CONSTRAINT [files_ContributionID_fkey] FOREIGN KEY ([ContributionID]) REFERENCES [dbo].[contributions]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
