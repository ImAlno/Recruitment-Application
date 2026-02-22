/**
 * Formats a raw string into a Swedish personal identity number format (YYYYMMDD-XXXX).
 * Filters out non-digits and caps the length to 12 digits.
 * 
 * @param {string} value - The raw input value.
 * @returns {string} The formatted personal number.
 */
export const formatPersonNumber = (value: string): string => {
    // Remove all non-digits
    const raw = value.replace(/\D/g, '');
    // Limit to 12 digits (8 for date, 4 for number)
    const digits = raw.slice(0, 12);

    // Format as YYYYMMDD-XXXX
    if (digits.length > 8) {
        return `${digits.slice(0, 8)}-${digits.slice(8)}`;
    }
    return digits;
};
