// Mapping of country names to their country codes
export const countryCodeMapping = {
    'Sri Lanka': 'LK',
    'United States': 'US',
    'India': 'IN',
    'Canada': 'CA',
    'United Kingdom': 'GB',
    'Australia': 'AU',
    'Germany': 'DE',
    'France': 'FR',
    // Add more countries as needed
};

// Phone number formats for different countries
export const phoneNumberFormats = {
    LK: {
        national: /^(071|077|078|070|074|075|076|072)\d{7}$/,
        international: /^\+947\d{9}$/
    },
    US: {
        national: /^\d{10}$/,
        international: /^\+1\d{10}$/
    },
    IN: {
        national: /^\d{10}$/,
        international: /^\+91\d{10}$/
    },
    CA: {
        national: /^\d{10}$/,
        international: /^\+1\d{10}$/
    },
    GB: {
        national: /^0\d{10}$/,
        international: /^\+44\d{10}$/
    },
    AU: {
        national: /^0\d{9}$/,
        international: /^\+61\d{9}$/
    },
    DE: {
        national: /^\d{10}$/,
        international: /^\+49\d{10}$/
    },
    FR: {
        national: /^\d{10}$/,
        international: /^\+33\d{9}$/
    }
    // Add more countries and their formats as needed
};
