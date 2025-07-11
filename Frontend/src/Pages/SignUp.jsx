import { useState } from "react";
import {
  Alert,
  Button,
  Label,
  TextInput,
  Spinner,
  Select,
} from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import OAuthenticate from "../Components/OAuthenticate";
import logo from "../assets/Logo/newlogo.png";
import video from "../assets/Logo/design.mp4";
import { motion } from "framer-motion";

const countryList = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo (Congo-Brazzaville)",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czechia",
  "Democratic Republic of the Congo",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini (fmr. Swaziland)",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar (formerly Burma)",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine State",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States of America",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.mobile ||
      !formData.address ||
      !formData.country ||
      !formData.state ||
      !formData.postalcode ||
      !formData.city
    ) {
      return setError("Please fill all fields");
    }

    try {
      setLoading(true);
      setError(false);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
        return;
      }
      navigate("/sign-in");
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-50"
      >
        <source src={video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="relative z-10 mt-10 flex p-6 max-w-6xl mx-auto w-full flex-col md:flex-row md:items-center gap-12">
        {/* Left: Logo and description */}
        <motion.div
          className="flex-1 text-center"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <Link to="/" className="text-5xl font-bold text-white">
            <img
              src={logo}
              alt="MusicBible logo"
              className="h-96 w-auto mx-auto"
            />
          </Link>
          <p className="text-lg font-cinzel text-gray-200 mt-6 max-w-lg mx-auto">
            Music expresses that which cannot be said and on which it is
            impossible to be silent. Music in itself is healing. It's an
            explosive expression of humanity. It's something we are all touched
            by. No matter what culture we're from, everyone loves music.
          </p>
        </motion.div>

        {/* Right: Sign-up form */}
        <div className="flex-1 mt-2">
          <p className="text-center text-2xl font-cinzel font-semibold text-white mb-8">
            Sign Up
          </p>
          <form
            className="w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-6"
            onSubmit={handleSubmit}
          >
            {/* Row 1 */}
            <div className="space-y-2">
              <Label className="text-white" value="Your username" />
              <TextInput
                type="text"
                placeholder="Username"
                id="username"
                onChange={handleChange}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white" value="Your email" />
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                onChange={handleChange}
                className="w-full"
              />
            </div>

            {/* Row 2 */}
            <div className="space-y-2">
              <Label className="text-white" value="Your Country" />
              <Select id="country" onChange={handleChange} className="w-full">
                <option value="">Select your country</option>
                {countryList.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-white" value="Your State" />
              <TextInput
                type="text"
                placeholder="State"
                id="state"
                onChange={handleChange}
                className="w-full"
              />
            </div>

            {/* Row 3 */}
            <div className="space-y-2">
              <Label className="text-white" value="Your City" />
              <TextInput
                type="text"
                placeholder="City"
                id="city"
                onChange={handleChange}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white" value="Your Address" />
              <TextInput
                type="text"
                placeholder="Address"
                id="address"
                onChange={handleChange}
                className="w-full"
              />
            </div>

            {/* Row 4 */}
            <div className="space-y-2">
              <Label className="text-white" value="Postal Code" />
              <TextInput
                type="text"
                placeholder="Postal Code"
                id="postalcode"
                onChange={handleChange}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white" value="Your mobile" />
              <TextInput
                type="tel"
                placeholder="Phone Number"
                id="mobile"
                onChange={handleChange}
                className="w-full"
              />
            </div>

            {/* Row 5 - Full width */}
            <div className="md:col-span-2 space-y-2">
              <Label className="text-white" value="Your password" />
              <div className="relative">
                <TextInput
                  type={showPassword ? "text" : "password"}
                  placeholder="password"
                  id="password"
                  onChange={handleChange}
                  className="w-full"
                />
                <button
                  type="button"
                  className="absolute top-2 right-3 focus:outline-none"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.5c5.185 0 9.448 4.014 9.95 9.048a.944.944 0 0 1 0 .904C21.448 16.486 17.185 20.5 12 20.5S2.552 16.486 2.05 13.452a.944.944 0 0 1 0-.904C2.552 8.514 6.815 4.5 12 4.5zM12 6a9 9 0 0 0-8.72 6.752.944.944 0 0 1 0 .496A9 9 0 0 0 12 18a9 9 0 0 0 8.72-4.752.944.944 0 0 1 0-.496A9 9 0 0 0 12 6z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 12.75a2.25 2.25 0 1 1 0-4.5 2.25 2.25 0 0 1 0 4.5z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 15a7 7 0 01-7-7M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2">
               <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] rounded-lg w-fit h-8 flex items-center justify-center mx-auto
                px-2 py-1 text-sm text-white transition duration-300 ease-in-out"
              >
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="pl-2">Loading</span>
                  </>
                ) : (
                  <span className="w-full text-center">Sign Up</span>
                )}
              </Button>
            </div>

            {/* Divider */}
            <div className="md:col-span-2 flex items-center w-full my-2">
              <div className="flex-grow h-px bg-gray-300"></div>
              <span className="px-4 text-gray-400 text-sm">or </span>
              <div className="flex-grow h-px bg-gray-300"></div>
            </div>

            {/* OAuth */}
           <div className="md:col-span-2 mx-auto w-full flex items-center justify-center">
  <OAuthenticate />
</div>
          </form>

          {/* Sign In Link */}
          <div className="flex gap-2 text-sm justify-center mt-6 text-white">
            <span>Already have an account?</span>
            <Link
              to="/sign-in"
              className="font-medium text-blue-500 hover:underline"
            >
              Sign In
            </Link>
          </div>

          {/* Error Message */}
          {error && (
            <Alert color="failure" className="mt-4">
              <span>{error}</span>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
