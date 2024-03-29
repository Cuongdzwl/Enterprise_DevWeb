/*
  Warnings:

  - A unique constraint covering the columns `[Phone]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[NewPhone]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[users] ADD [NewPhone] NVARCHAR(1000);

-- CreateIndex
ALTER TABLE [dbo].[users] ADD CONSTRAINT [users_Phone_key] UNIQUE NONCLUSTERED ([Phone]);

-- CreateIndex
ALTER TABLE [dbo].[users] ADD CONSTRAINT [users_NewPhone_key] UNIQUE NONCLUSTERED ([NewPhone]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
