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
