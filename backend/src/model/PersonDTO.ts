/**
* DTO for a applicant of the recruitment platform
*/
class PersonDTO {
    /**
    * Creates a new instance.
    * @param {number} personId The database id PK
    * @param {string} name Persons first name
    * @param {string} surname Persons last name
    * @param {string} pnr Persons personal registration number
    * @param {string} email Persons email
    * @param {string} password Persons password
    * @param {number} roleId Persons role id representing if they are a recruiter or applicant
    * @param {string} username Persons username
    * @param {string} role The role of the person is either recruiter or applicant

    * This is a dto = immutable object = use readonly
    */
    constructor(
        public readonly id: number,
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly username: string,
        public readonly email: string,
        public readonly personNumber: string,
        public readonly role: string,
        public readonly password?: string,
    ) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.password = password;
        this.email = email;
        this.personNumber = personNumber;
        this.role = role;
    }
}

export default PersonDTO;