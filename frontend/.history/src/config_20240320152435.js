const crud = {
    create: 'Create',
    update: 'Update',
    delete: 'Delete',
    detail: 'Detail',
    list: 'List'
};

const title = {
    account: 'Account',
    dashboard: 'Dashboard',
    event: 'Event',
    faculty: 'Faculty',
    homepage: 'Home page'
};

const button = {
    create: 'Create',
    public: 'Public Contribution'
};

const contentType = {
    default: 'row-2',
    list: 'row-2 list',
};

// Admin Account
const accountTitle = `${crud.list} ${title.account}`;
const accountCreateTitle = `${crud.create} ${title.account}`;
const accountUpdateTitle = `${crud.update} ${title.account}`;
const accountDetailTitle = `${crud.detail} ${title.account}`;

export { accountTitle, accountCreateTitle, accountUpdateTitle, accountDetailTitle };

// ContentType
const defaultContentType = contentType.default;
const listContentType = contentType.list;

export { defaultContentType, listContentType };
    
//Button Create or Public
const createAccountButton = button.create;
const publicContributionButton = button.public;

export { createAccountButton, publicContributionButton };


const dashboardTitle = `${crud.list} ${title.dashboard}`;
const eventTitle = `${crud.list} ${title.event}`;
const facultyTitle = `${crud.list} ${title.faculty}`;
const homepageTitle = `${crud.list} ${title.homepage}`;
