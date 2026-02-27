/**
 * Data Transfer Object (DTO) for a user or applicant of the recruitment platform.
 * Represents an immutable snapshot of person data.
 */
class PersonDTO {
    /**
     * Initializes a new PersonDTO instance.
     * @param id The database primary key ID.
     * @param firstName The person's first name.
     * @param lastName The person's last name.
     * @param username The person's chosen username.
     * @param email The person's email address.
     * @param personNumber The person's personal identity number.
     * @param role The role of the person (recruiter or applicant).
     * @param password The person's hashed password (optional).
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