export class Report {
    year: number
    contributionsOfFaculty: number
    contributionsException: number
    contributionsFacultyAndByYear: { [facultyId: number]: number };
    contributorsByFacultyAndYear: number
    constructor(year: number, contributionsOfFaculty: number,contributionsException: number, contributionsFacultyAndByYear: { [facultyId: number]: number }, contributorsByFacultyAndYear: number) {
        this.year = year;
        this.contributionsOfFaculty = contributionsOfFaculty;
        this.contributionsException = contributionsException;
        this.contributionsFacultyAndByYear = contributionsFacultyAndByYear;
        this.contributorsByFacultyAndYear =contributorsByFacultyAndYear;
    }
}