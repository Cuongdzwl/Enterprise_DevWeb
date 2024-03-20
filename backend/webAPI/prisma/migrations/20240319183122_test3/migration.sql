BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[roles] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [Name] NVARCHAR(1000) NOT NULL,
    [Description] NVARCHAR(1000),
    CONSTRAINT [roles_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[faculties] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [Name] NVARCHAR(1000) NOT NULL,
    [Description] NVARCHAR(1000) NOT NULL,
    [IsEnabledGuest] BIT NOT NULL CONSTRAINT [faculties_IsEnabledGuest_df] DEFAULT 0,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [faculties_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [faculties_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [faculties_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[users] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [Name] NVARCHAR(1000) NOT NULL,
    [Password] NVARCHAR(1000) NOT NULL,
    [Salt] NVARCHAR(1000) NOT NULL,
    [Email] NVARCHAR(1000) NOT NULL,
    [Phone] NVARCHAR(1000),
    [Address] NVARCHAR(1000),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [users_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [users_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [RoleID] INT NOT NULL,
    [FacultyID] INT NOT NULL,
    CONSTRAINT [users_pkey] PRIMARY KEY CLUSTERED ([ID]),
    CONSTRAINT [users_Email_key] UNIQUE NONCLUSTERED ([Email])
);

-- CreateTable
CREATE TABLE [dbo].[events] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [Name] NVARCHAR(1000) NOT NULL,
    [Description] NVARCHAR(1000) NOT NULL,
    [ClosureDate] DATETIME2 NOT NULL,
    [FinalDate] DATETIME2 NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [events_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [events_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [FacultyID] INT NOT NULL,
    CONSTRAINT [events_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[comments] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [Content] NVARCHAR(1000) NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [comments_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [comments_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [ContributionID] INT NOT NULL,
    [UserID] INT NOT NULL,
    CONSTRAINT [comments_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[files] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [Url] NVARCHAR(1000) NOT NULL,
    [CreatedAt] DATETIME2 CONSTRAINT [files_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedAt] DATETIME2 CONSTRAINT [files_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [ContributionID] INT NOT NULL,
    CONSTRAINT [files_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[contributions] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [Name] NVARCHAR(1000) NOT NULL,
    [Content] NVARCHAR(1000) NOT NULL,
    [IsPublic] BIT NOT NULL CONSTRAINT [contributions_IsPublic_df] DEFAULT 0,
    [IsApproved] BIT NOT NULL CONSTRAINT [contributions_IsApproved_df] DEFAULT 0,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [contributions_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [contributions_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [EventID] INT NOT NULL,
    [UserID] INT NOT NULL,
    [StatusID] INT NOT NULL,
    CONSTRAINT [contributions_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[contributionStatuses] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [Name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [contributionStatuses_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[notificationSentTypes] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [Name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [notificationSentTypes_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- CreateTable
CREATE TABLE [dbo].[notifications] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [Content] NVARCHAR(1000) NOT NULL,
    [NotificationSentTypeID] INT NOT NULL,
    [SentAt] DATETIME2 NOT NULL CONSTRAINT [notifications_SentAt_df] DEFAULT CURRENT_TIMESTAMP,
    [SentTo] INT NOT NULL,
    [FromID] INT NOT NULL,
    [FromTable] NVARCHAR(1000) NOT NULL,
    [IsCancelled] BIT NOT NULL,
    CONSTRAINT [notifications_pkey] PRIMARY KEY CLUSTERED ([ID])
);

-- AddForeignKey
ALTER TABLE [dbo].[users] ADD CONSTRAINT [users_RoleID_fkey] FOREIGN KEY ([RoleID]) REFERENCES [dbo].[roles]([ID]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[users] ADD CONSTRAINT [users_FacultyID_fkey] FOREIGN KEY ([FacultyID]) REFERENCES [dbo].[faculties]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[events] ADD CONSTRAINT [events_FacultyID_fkey] FOREIGN KEY ([FacultyID]) REFERENCES [dbo].[faculties]([ID]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[comments] ADD CONSTRAINT [comments_ContributionID_fkey] FOREIGN KEY ([ContributionID]) REFERENCES [dbo].[contributions]([ID]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[comments] ADD CONSTRAINT [comments_UserID_fkey] FOREIGN KEY ([UserID]) REFERENCES [dbo].[users]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[files] ADD CONSTRAINT [files_ContributionID_fkey] FOREIGN KEY ([ContributionID]) REFERENCES [dbo].[contributions]([ID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[contributions] ADD CONSTRAINT [contributions_EventID_fkey] FOREIGN KEY ([EventID]) REFERENCES [dbo].[events]([ID]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[contributions] ADD CONSTRAINT [contributions_UserID_fkey] FOREIGN KEY ([UserID]) REFERENCES [dbo].[users]([ID]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[contributions] ADD CONSTRAINT [contributions_StatusID_fkey] FOREIGN KEY ([StatusID]) REFERENCES [dbo].[contributionStatuses]([ID]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[notifications] ADD CONSTRAINT [notifications_NotificationSentTypeID_fkey] FOREIGN KEY ([NotificationSentTypeID]) REFERENCES [dbo].[notificationSentTypes]([ID]) ON DELETE CASCADE ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
