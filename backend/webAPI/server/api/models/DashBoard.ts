export class DashBoard {
    facultyID: number;
    facultyName: string;
    year: number;
    contributionsOfFaculty: number;
    contributionsException: number;
    contributionsPercentage: number;
    contributorsOfFaculty: number;
    constructor(facultyID: number, facultyName: string, year: number, contributionsOfFaculty: number,contributionsException: number, contributionsPercentage: number, contributorsOfFaculty: number) {
        this.facultyID = facultyID;
        this.facultyName = facultyName;
        this.year = year;
        this.contributionsOfFaculty = contributionsOfFaculty;
        this.contributionsException = contributionsException;
        this.contributionsPercentage = contributionsPercentage;
        this.contributorsOfFaculty =contributorsOfFaculty;
    }
}