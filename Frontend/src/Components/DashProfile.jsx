import { Alert, Button, Modal, Select, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import { Link } from "react-router-dom";
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signOut, updateUserFailure, updateUserStart, updateUserSuccess } from "../redux/user/userSlice";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function DashProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, loading } = useSelector(state => state.user);
  const [image, setImage] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(null);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModel, setShowModel] = useState(false);
  const filePickerRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
 
  const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", 
    "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", 
    "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", 
    "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", 
    "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", 
    "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", 
    "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia", 
    "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", 
    "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", 
    "Eswatini (fmr. Swaziland)", "Ethiopia", "Fiji", "Finland", "France", "Gabon", 
    "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", 
    "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", 
    "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", 
    "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", 
    "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", 
    "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", 
    "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", 
    "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", 
    "Mozambique", "Myanmar (formerly Burma)", "Namibia", "Nauru", "Nepal", "Netherlands", 
    "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", 
    "Norway", "Oman", "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", 
    "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", 
    "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", 
    "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", 
    "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", 
    "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", 
    "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", 
    "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", 
    "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", 
    "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", 
    "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", 
    "Yemen", "Zambia", "Zimbabwe"
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (image) {
      uploadImage();
    }
  }, [image])

  const uploadImage = async () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
  
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(progress.toFixed(0));
      },
      (error) => {
        setImageError("Image size should be less than 5mb");
        console.error("Upload error:", error);
        setImagePercent(null);
        setImage(null);
        setImageFileUrl(null);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
        } catch (error) {
          console.error("Error getting download URL:", error);
          setImageError("Error uploading image");
          setImagePercent(null);
          setImage(null);
          setImageFileUrl(null);
        }
      }
    );
  };
  
  const handleChange = (e) => {
    setFormData({...formData,[e.target.id]:e.target.value});
   
  };
  const handleSubmit = async(e)=>{
    e.preventDefault();
   
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method: 'PUT',
        headers: {
          'Content-Type':'application/json',
        },
        credentials: "include",
        body:JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(updateUserFailure(data.message));
        setUpdateUserError(data.message);
        setUpdateSuccess(null);
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess("User profile updated successfully");
      setUpdateUserError(null);
    } catch (error) {
      dispatch(updateUserFailure(error));
      setUpdateUserError(error.message);
      setUpdateSuccess(null);
      
    }

  }
  const handleDeleteUser = async ()=>{
    try {
      dispatch (deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method : "DELETE",
        credentials: "include",
      });
      const data  = await res.json();
      if(data.success === false){
        dispatch(deleteUserFailure());
        return;
      }
      dispatch(deleteUserSuccess());
      navigate('/sign-in');
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  }
  const handleSignOut = async () => {
    try {
      await fetch('/api/user/signout');
      dispatch(signOut());
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
};


  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-lg mx-auto p-4 w-full"
    >
      <motion.h1 
        className="my-7 text-center font-bold text-3xl bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-transparent bg-clip-text"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
      >
        Profile Settings
      </motion.h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Profile Picture Upload */}
        <div className="flex flex-col items-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={filePickerRef}
            hidden
          />
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
            onClick={() => filePickerRef.current.click()}
          >
            {imagePercent > 0 && imagePercent < 100 && (
              <CircularProgressbar
                value={imagePercent}
                text={`${imagePercent}%`}
                strokeWidth={5}
                styles={{
                  root: {
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                  },
                  path: {
                    stroke: `rgba(62, 152, 199, ${imagePercent / 100})`,
                  },
                }}
              />
            )}
            <img
              src={imageFileUrl || currentUser.profilePicture}
              alt="user"
              className={`rounded-full w-full h-full border-8 border-[lightgray] ${imagePercent && imagePercent < 100 ? 'opacity-60' : ''}`}
            />
          </motion.div>
          <motion.p 
            className="mt-2 text-sm text-gray-500 cursor-pointer hover:underline"
            whileHover={{ scale: 1.05 }}
            onClick={() => filePickerRef.current.click()}
          >
            Change Profile Photo
          </motion.p>
        </div>

        {imageError && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Alert color="failure">{imageError}</Alert>
          </motion.div>
        )}

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Row 1 */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-500 mb-1">Username</label>
            <TextInput
              type="text"
              id="username"
              placeholder="Username"
              defaultValue={currentUser.username}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-500 mb-1">Email</label>
            <TextInput
              type="email"
              id="email"
              placeholder="Email"
              defaultValue={currentUser.email}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          {/* Row 2 */}
          <div >
            <label htmlFor="country" className="block text-sm font-medium text-gray-500 mb-1">Country</label>
            <Select
              id="country"
              placeholder="Select Country"
              value={formData.country || currentUser.country}
              onChange={(e) => handleChange({ target: { id: 'country', value: e.target.value } })}
              className="w-full"
            >
              <option value="">Select Country</option>
              {countries.map((country, index) => (
                <option key={index} value={country}>{country}</option>
              ))}
            </Select>
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-500 mb-1">Address</label>
            <TextInput
              type="text"
              id="address"
              placeholder="Address"
              defaultValue={currentUser.address}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          {/* Row 3 */}
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-500 mb-1">State</label>
            <TextInput
              type="text"
              id="state"
              placeholder="State"
              defaultValue={currentUser.state}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-500 mb-1">City</label>
            <TextInput
              type="text"
              id="city"
              placeholder="City"
              defaultValue={currentUser.city}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          {/* Row 4 */}
          <div>
            <label htmlFor="postalcode" className="block text-sm font-medium text-gray-500 mb-1">Postal Code</label>
            <TextInput
              type="text"
              id="postalcode"
              placeholder="Postal Code"
              defaultValue={currentUser.postalcode}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="mobile" className="block text-sm font-medium text-gray-500 mb-1">Mobile</label>
            <TextInput
              type="text"
              id="mobile"
              placeholder="Mobile"
              defaultValue={currentUser.mobile}
              onChange={handleChange}
              className="w-full"
            />
          </div>

           <div className="md:col-span-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-500 mb-1">Password</label>
            <div className="relative">
              <TextInput 
                type={showPassword ? "text" : "password"} 
                id="password" 
                placeholder="Password" 
                onChange={handleChange}
                className="w-full"
              />
              <button 
                type="button" 
                className="absolute top-2 right-3 focus:outline-none"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Buttons with Gradient */}
        <motion.div className="flex flex-col gap-3">
          <motion.button
            type="submit"
            className="w-full bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-white py-2 px-4 rounded-lg font-medium shadow-md"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Update Account'}
          </motion.button>

          {currentUser.isAdmin && (
            <>
              <Link to="/addmusic">
                <motion.button
                  type="button"
                  className="w-full bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-white py-2 px-4 rounded-lg font-medium shadow-md"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  Add Music
                </motion.button>
              </Link>
              <Link to="/addalbum">
                <motion.button
                  type="button"
                  className="w-full bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-white py-2 px-4 rounded-lg font-medium shadow-md"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  Add New Album
                </motion.button>
              </Link>
            </>
          )}
        </motion.div>
      </form>

      <div className="flex justify-between mt-5">
        <motion.button
          onClick={() => setShowModel(true)}
          className="text-red-500 hover:text-red-700 font-medium"
          whileHover={{ scale: 1.05 }}
        >
          Delete Account
        </motion.button>
        <motion.button
          onClick={handleSignOut}
          className="text-blue-500 hover:text-blue-700 font-medium"
          whileHover={{ scale: 1.05 }}
        >
          Sign Out
        </motion.button>
      </div>

      {updateSuccess && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5"
        >
          <Alert color="success">
            {updateSuccess}
          </Alert>
        </motion.div>
      )}

      {updateUserError && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5"
        >
          <Alert color="failure">
            {updateUserError}
          </Alert>
        </motion.div>
      )}

      <Modal show={showModel} onClose={() => setShowModel(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500">Are you sure you want to delete your account?</h3>
          </div>
          <div className="flex justify-center gap-4">
            <motion.button
              onClick={handleDeleteUser}
              className="bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-white py-2 px-4 rounded-lg font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Yes, I'm sure
            </motion.button>
            <motion.button
              onClick={() => setShowModel(false)}
              className="bg-gray-500 text-white py-2 px-4 rounded-lg font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              No, cancel
            </motion.button>
          </div>
        </Modal.Body>
      </Modal>
    </motion.div>
  );
}