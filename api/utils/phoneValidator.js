// phoneValidator.js
import { countryCodeMapping, phoneNumberFormats } from './countryCodes.js';

// Validate phone number based on country name
export const validatePhoneNumber = (number, countryName) => {
    console.log(`Validating number: ${number} for country: ${countryName}`);

    // Get the country code from the mapping
    const countryCode = countryCodeMapping[countryName];
    if (!countryCode) {
        console.error('Country not found in mapping:', countryName);
        return false;
    }

    // Get phone number formats for the country
    const formats = phoneNumberFormats[countryCode];
    if (!formats) {
        console.error('Phone number formats not found for country code:', countryCode);
        return false;
    }

    // Validate the number against both national and international formats
    const isValidNational = formats.national.test(number);
    const isValidInternational = formats.international.test(number);

    console.log(`Is valid national: ${isValidNational}`);
    console.log(`Is valid international: ${isValidInternational}`);
    
    return isValidNational || isValidInternational;
};
