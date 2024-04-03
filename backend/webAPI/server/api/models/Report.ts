export class Report {
    contributionsOfFaculty: number
    contributionsException: number
    contributionsFacultyAndByYear: number
    contributorsByFacultyAndYear: number
    constructor(contributionsOfFaculty: number,contributionsException: number, contributionsFacultyAndByYear: number, contributorsByFacultyAndYear: number) {
        this.contributionsOfFaculty = contributionsOfFaculty;
        this.contributionsException = contributionsException;
        this.contributionsFacultyAndByYear = contributionsFacultyAndByYear;
        this.contributorsByFacultyAndYear =contributorsByFacultyAndYear;
    }
}