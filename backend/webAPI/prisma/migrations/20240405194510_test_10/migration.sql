BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[files] DROP CONSTRAINT [files_ContributionID_fkey];

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
