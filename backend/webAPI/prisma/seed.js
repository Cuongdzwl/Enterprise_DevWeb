const { PrismaClient } = require('@prisma/client');
const bcrypt = require ('bcrypt')
const prisma = new PrismaClient()

class Utils {
  constructor() {
    this.saltRounds = 10;
  }

  generateSalt(saltRounds = this.saltRounds) {
    return bcrypt.genSaltSync(saltRounds);
  }

  hashedPassword(password, salt) {
    return bcrypt.hashSync(password, salt);
  }

  generatePassword() {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }
    return password;
  }

  generateOTP() {
    const characters = '0123456789';
    let otp = '';
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      otp += characters[randomIndex];
    }
    return otp;
  }
}

const utils = new Utils();

const generateRandomDate = (year) => {
  const start = new Date(`${year}-01-01`);
  const end = new Date(`${year}-12-31`);
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};
async function main() {
    // Seed Roles
  const roles = [
    { Name: 'Admin', Description: 'Administrator role' },
    { Name: 'Student', Description: 'Student role' },
    { Name: 'Marketing Manager', Description: 'Marketing Manager role' },
    { Name: 'Marketing Coordinator', Description: 'Marketing Coordinator role' },
  ];

  const seededRoles = await Promise.all(
    roles.map(role =>
      prisma.roles.create({
        data: role,
      }),
    ),
  );

  // Seed Faculties
  const facultyNames = ['Faculty of Science', 'Faculty of Arts', 'Faculty of Engineering'];
  const seededFaculties = await Promise.all(
    facultyNames.map(name =>
      prisma.faculties.create({
        data: {
          Name: name,
          Description: `Description for ${name}`,
          IsEnabledGuest: false,
        },
      }),
    ),
  );
  const eventNames = ['Spring Symposium', 'Fall Conference', 'Winter Workshop'];
  const seededEvents = [];

  for (const eventName of eventNames) {
    for (const faculty of seededFaculties) {
      const currentDate = new Date();
      const finalDate = new Date(currentDate); 
      finalDate.setMonth(currentDate.getMonth() + 2);
      const event = await prisma.events.create({
        data: {
          Name: eventName,
          Description: `${eventName} for ${faculty.Name}`,
          ClosureDate: new Date(),
          FinalDate: finalDate,
          CreatedAt: new Date(2023, 0, 0),
          UpdatedAt: new Date(),
          FacultyID: faculty.ID,
        },
      });
      seededEvents.push(event);
    }
  }
  // Seed Users
  // Admin - 1 user
  
  var password = "adminpassword123";
  var salt = utils.generateSalt();
  var hashedPassword = utils.hashedPassword(password, salt);
  await prisma.users.create({
    data: {
      Name: 'Admin User',
      Password: hashedPassword,
      Salt: 'adminsalt',
      Email: 'admin@example.com',
      Phone : "+999",
      Address: "Ha Noi",
      RoleID: seededRoles.find(role => role.Name === 'admin').ID,
    },
  });
  // Marketing Manager - 1 user
  password = "marketingmanagerpassword123";
  hashedPassword = utils.hashedPassword(password, salt);
  await prisma.users.create({
    data: {
      Name: 'Marketing Manager User',
      Password: hashedPassword,
      Salt: 'marketingmanagersalt',
      Email: 'marketingmanager@example.com',
      Phone : "+999",
      Address: "Ha Noi",
      RoleID: seededRoles.find(role => role.Name === 'Marketing Manager').ID,
    },
  });
  let studentCount = 0;
  for (const seededFaculty of seededFaculties) {
    // Marketing Coordinator for each faculty
    password = "marketingmanagerpassword123";
    hashedPassword = utils.hashedPassword(password, salt);
    await prisma.users.create({
      data: {
        Name: `Marketing Coordinator for ${seededFaculty.Name}`,
        Password: hashedPassword,
        Salt: 'marketingcoordinatorsalt',
        Email: `marketingcoordinator${seededFaculty.Name.toLowerCase().replace(/ /g, '')}@example.com`,
        RoleID: seededRoles.find(role => role.Name === 'Marketing Coordinator').ID,
        Phone : "+999",
        Address: "Ha Noi",
        FacultyID: seededFaculty.ID
      },
    });
    let contributionCount = 0;
    // Adding some students for each faculty
    for (let i = 1; i <= 2; i++) { // Assuming 2 students per faculty for example
      password = "studentpassword123";
      hashedPassword = utils.hashedPassword(password, salt);
      const student = await prisma.users.create({
        data: {
          Name: `Student for ${seededFaculty.Name}`,
          Password: hashedPassword,
          Salt: `studentsalt${i}`,
          Email: `student${i}${seededFaculty.Name.toLowerCase().replace(/ /g, '')}@example.com`,
          RoleID: seededRoles.find(role => role.Name === 'Student').ID,
          Phone : "+999",
          Address: "Ha Noi",
          FacultyID: seededFaculty.ID
        },
      });
      studentCount++;
      let facultyCount = 0;
      for (let year = 2023; year <= 2024; year++) {
        for (let faculties = facultyCount; facultyCount < faculties+3; facultyCount++) {
        for (let studentID = 1; studentID <= 2; studentID++) {
          const contribution = await prisma.contributions.create({
            data: {
              Name: `Contribution for ${seededFaculty.Name} ${year}`,
              Content: `Content for ${seededFaculty.Name} in ${year}`,
              IsPublic: year % 2 === 0,
              IsApproved: year % 2 === 0,
              CreatedAt: generateRandomDate(year),
              EventID: seededEvents[facultyCount].ID,
              UserID: student.ID, 
              StatusID: 1, 
            },
          });
          contributionCount++;
          await prisma.files.createMany({
            data: [
              {
                Url: `https://cuongndcdn.blob.core.windows.net/public/1712688025219-de%202.jpg`,
                ContributionID: contribution.ID,
              },
              {
                Url: `https://cuongndcdn.blob.core.windows.net/public/1712687937031-10.pdf`,
                ContributionID: contribution.ID,
              },
            ],
          });
        }
      }
      }
    }
    
  }
  // Seed Contributions linked to events
  // for (const event of seededEvents) {


  //   // Add more contributions for 2024
  //   while (contributionCount < 50) {
  //     const createdAt = generateRandomDate(2024);
  //     for (let studentID = 1; studentID <= 5; studentID++) {
  //       await prisma.contributions.create({
  //         data: {
  //           Name: `Contribution for ${event.Name} 2024`,
  //           Content: `Content for ${event.Name} in 2024`,
  //           IsPublic: true,
  //           IsApproved: true,
  //           CreatedAt: createdAt,
  //           EventID: event.ID,
  //           UserID: studentID, // Assigning the current student's ID
  //           StatusID: 1, // Adjust based on actual status IDs
  //         },
  //       });
  //       contributionCount++;
  //       await prisma.files.createMany({
  //         data: [
  //           {
  //             Url: `https://example.com/public/${faculty.Name.toLowerCase().replace(/ /g, '')}contribution${i}doc.pdf`,
  //             ContributionID: contribution.ID,
  //           },
  //           {
  //             Url: `https://example.com/public/${faculty.Name.toLowerCase().replace(/ /g, '')}contribution${i}image.jpg`,
  //             ContributionID: contribution.ID,
  //           },
  //         ],
  //       });
  //     }
  //   }

  //  }

  console.log('Data seeding completed successfully.');
}
main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })