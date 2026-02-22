import { RegisterRequest } from "../model/types/authApi";
import { ApplicationSubmissionRequest, AvailabilityPeriod } from "../model/types/applicationApi";

/**
 * Utility class containing static methods for validating various input parameters.
 */
export class Validator {

    /**
     * Checks if a value is a string and optionally validates its length.
     * @param {any} val The value to check.
     * @param {number} [minLength=0] The minimum required length.
     * @param {number} [maxLength] The maximum allowed length.
     * @returns {boolean} True if valid, false otherwise.
     */
    static isString(val: any, minLength: number = 0, maxLength?: number): boolean {
        if (typeof val !== 'string') return false;
        if (val.length < minLength) return false;
        if (maxLength !== undefined && val.length > maxLength) return false;
        return true;
    }

    /**
     * Checks if a value is an integer and optionally validates its range.
     * @param {any} val The value to check.
     * @param {number} [min] The minimum allowed value.
     * @param {number} [max] The maximum allowed value.
     * @returns {boolean} True if valid, false otherwise.
     */
    static isInt(val: any, min?: number, max?: number): boolean {
        if (!Number.isInteger(val)) return false;
        if (min !== undefined && val < min) return false;
        if (max !== undefined && val > max) return false;
        return true;
    }

    /**
     * Checks if a string is a valid email address using a simple regex.
     * @param {string} email The email address to validate.
     * @returns {boolean} True if valid, false otherwise.
     */
    static isEmail(email: string): boolean {
        if (!Validator.isString(email)) return false;
        return /^\S+@\S+\.\S+$/.test(email);
    }

    /**
     * Checks if a string meets password requirements:
     * - Min length 6
     * - At least one uppercase letter
     * - At least one lowercase letter
     * - At least one number
     * - At least one special character
     * @param {string} password The password to validate.
     * @returns {boolean} True if valid, false otherwise.
     */
    static isPassword(password: string): boolean {
        if (!Validator.isString(password)) return false;
        if (password.length < 6) return false;
        if (!/[A-Z]/.test(password)) return false;
        if (!/[a-z]/.test(password)) return false;
        if (!/\d/.test(password)) return false;
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;
        return true;
    }

    /**
     * Checks if a string meets username requirements:
     * - Length between 6 and 30 characters
     * - Only contains a-zA-Z0-9.,_-
     * @param {string} username The username to validate.
     * @returns {boolean} True if valid, false otherwise.
     */
    static isUsername(username: string): boolean {
        if (!Validator.isString(username)) return false;
        const usernameRegex = /^[a-zA-Z0-9.,_-]{6,30}$/;
        return usernameRegex.test(username);
    }

    /**
     * Checks if a string is a valid Swedish personal identity number in format YYYYMMDD-XXXX.
     * @param {string} pnr The personal identity number to validate.
     * @returns {boolean} True if valid, false otherwise.
     */
    static isPnr(pnr: string): boolean {
        if (!Validator.isString(pnr)) return false;
        const pnrRegex = /^\d{8}-\d{4}$/;
        return pnrRegex.test(pnr);
    }

    /**
     * Checks if a string is a valid ISO8601 date (YYYY-MM-DD).
     * @param {string} date The date string to validate.
     * @returns {boolean} True if valid, false otherwise.
     */
    static isISO8601(date: string): boolean {
        if (!Validator.isString(date)) return false;
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(date)) return false;

        const d = new Date(date);
        return d instanceof Date && !isNaN(d.getTime()) && d.toISOString().startsWith(date);
    }

    /**
     * Checks if an availability period is valid.
     * Both dates must be in ISO8601 format and from_date must be earlier than to_date.
     * @param {AvailabilityPeriod} period The availability period object to validate.
     * @returns {boolean} True if valid, false otherwise.
     */
    static isValidAvailability(period: AvailabilityPeriod): boolean {
        if (!period) return false;
        if (!Validator.isISO8601(period.from_date) || !Validator.isISO8601(period.to_date)) {
            return false;
        }

        const fromDate = new Date(period.from_date);
        const toDate = new Date(period.to_date);

        return fromDate < toDate;
    }

    /**
     * Checks if a value is a valid years of experience representation between 0 and 99.99.
     * @param {any} yoe The years of experience to validate.
     * @returns {boolean} True if valid, false otherwise.
     */
    static isYearsOfExperience(yoe: any): boolean {
        if (yoe === undefined || yoe === null) return false;
        const str = String(yoe);
        const regex = /^\d{1,2}(\.\d{1,2})?$/;
        return regex.test(str);
    }

    /**
     * Checks if a competence object is valid.
     * @param {any} comp The competence object to validate.
     * @returns {boolean} True if valid, false otherwise.
     */
    static isValidCompetence(comp: any): boolean {
        if (!comp) return false;
        if (!Validator.isInt(comp.competence_id, 1)) return false;
        if (!Validator.isYearsOfExperience(comp.years_of_experience)) return false;
        return true;
    }

    /**
     * Validates an entire register request body.
     * @param {RegisterRequest} body The registration request body.
     * @throws {Error} If any of the parameters in the body are invalid.
     */
    static validateRegisterRequest(body: RegisterRequest): void {
        if (!body) throw new Error("Missing request body");

        if (!Validator.isString(body.firstName, 1)) throw new Error("Invalid firstName");
        if (!Validator.isString(body.lastName, 1)) throw new Error("Invalid lastName");
        if (!Validator.isEmail(body.email)) throw new Error("Invalid email format");
        if (!Validator.isPnr(body.personNumber)) throw new Error("Invalid person number format. Expected format: YYYYMMDD-XXXX");
        if (!Validator.isUsername(body.username)) throw new Error("Invalid username format");
        if (!Validator.isPassword(body.password)) throw new Error("Password does not meet requirements");
    }

    /**
     * Validates an application submission request body.
     * @param {ApplicationSubmissionRequest} body The application submission request body.
     * @throws {Error} If any of the parameters in the body are invalid.
     */
    static validateApplicationSubmission(body: ApplicationSubmissionRequest): void {
        if (!body) throw new Error("Missing request body");
        if (!Validator.isInt(body.userId, 1)) throw new Error("Invalid userId");

        if (!Array.isArray(body.competences)) throw new Error("competences must be an array");
        for (const comp of body.competences) {
            if (!Validator.isValidCompetence(comp)) {
                throw new Error("Invalid competence format");
            }
        }

        if (!Array.isArray(body.availability)) throw new Error("availability must be an array");
        for (const ava of body.availability) {
            if (!Validator.isValidAvailability(ava)) {
                throw new Error("Invalid availability period");
            }
        }
    }

    /**
     * Validates a username parameter.
     * @param {string} username The username string.
     * @throws {Error} If the username string is not valid.
     */
    static validateUsernameParam(username: string): void {
        if (!Validator.isUsername(username)) {
            throw new Error("Invalid username parameter format");
        }
    }

    /**
     * Validates an email parameter.
     * @param {string} email The email string.
     * @throws {Error} If the email string is not valid.
     */
    static validateEmailParam(email: string): void {
        if (!Validator.isEmail(email)) {
            throw new Error("Invalid email parameter format");
        }
    }

    /**
     * Validates an applicationId parameter.
     * @param {number} applicationId The application identifier.
     * @throws {Error} If the id parameter is not valid.
     */
    static validateApplicationIdParam(applicationId: number): void {
        if (!Validator.isInt(applicationId, 1)) {
            throw new Error("Invalid applicationId parameter format");
        }
    }
}
