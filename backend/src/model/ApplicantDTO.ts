'use strict'

/**
* DTO for a applicant of the recruitment platform 
*/
class ApplicantDTO {
    /**
    * Creates a new instance.
    * @param {number} id The database id PK
    * @param {string} firstName Applicants first name
    * @param {string} lastName Applicants last name
    * @param {string} username Applicants username
    * @param {string} password Applicants password
    * @param {string} email Applicants email
    * @param {string} personNumber Applicants person number

    * This is a dto = immutable object = use readonly
    */
    constructor(
        public readonly id: number,
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly username: string,
        public readonly password: string,
        public readonly email: string,
        public readonly personNumber: string,
    ) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.password = password;
        this.email = email;
        this.personNumber = personNumber;
    }
}

export default ApplicantDTO;