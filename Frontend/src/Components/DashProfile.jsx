import { Alert, Button,  Modal, Select, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import { Link } from "react-router-dom";
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signOut, updateUserFailure, updateUserStart, updateUserSuccess } from "../redux/user/userSlice";
import  { HiOutlineExclamationCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

export default function DashProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser , loading } = useSelector(state => state.user);
  const [image, setImage] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(null);
  const [formData, setFormData] = useState({});
  const [updateSuccess , setUpdateSuccess] = useState(null);
  const [updateUserError , setUpdateUserError]=useState(null);
  const [showModel , setShowModel] = useState(false);
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
      const res = await fetch(`https://amusicbible.com/api/user/update/${currentUser._id}`,{
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
      const res = await fetch(`https://amusicbible.com/api/user/delete/${currentUser._id}`,{
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
      await fetch('https://amusicbible.com/api/user/signout');
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
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='file'
          accept='image/*'
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
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
              aria-label='Uploading Image'
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt='user'
            className={`rounded-full w-full h-full border-8 border-[lightgray] ${imagePercent && imagePercent < 100 ? 'opacity-60' : ''}`}
            aria-label='User Profile Image'
          />
        </div>
        {imageError && (
          <Alert color='failure'>{imageError}</Alert>
        )}

        <div className='grid grid-cols-2 gap-4'>
          <TextInput
            type='text'
            id='username'
            placeholder='Username'
            defaultValue={currentUser.username}
            onChange={handleChange}
          />
          <TextInput
            type='email'
            id='email'
            placeholder='Email'
            defaultValue={currentUser.email}
            onChange={handleChange}
          />
          <Select
            id='country'
            placeholder='Select Country'
            value={formData.country || currentUser.country}
            onChange={(e) => handleChange({ target: { id: 'country', value: e.target.value } })}
          >
            <option value=''>Select Country</option>
            {countries.map((country, index) => (
              <option key={index} value={country}>{country}</option>
            ))}
          </Select>
          <TextInput
            type='text'
            id='state'
            placeholder='State'
            defaultValue={currentUser.state}
            onChange={handleChange}
          />
          <TextInput
            type='text'
            id='city'
            placeholder='City'
            defaultValue={currentUser.city}
            onChange={handleChange}
          />
          <TextInput
            type='text'
            id='postalcode'
            placeholder='Postal Code'
            defaultValue={currentUser.postalcode}
            onChange={handleChange}
          />
          <TextInput
            type='text'
            id='address'
            placeholder='Address'
            defaultValue={currentUser.address}
            onChange={handleChange}
          />
          <TextInput
            type='text'
            id='mobile'
            placeholder='Mobile'
            defaultValue={currentUser.mobile}
            onChange={handleChange}
          />
          <div className='col-span-2'>
            <div className="relative">
              <TextInput type={showPassword ? "text" : "password"} placeholder="Password" id="password" onChange={handleChange} />
              <button type="button" className="absolute top-2 right-3 focus:outline-none" onClick={togglePasswordVisibility}>
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5c5.185 0 9.448 4.014 9.95 9.048a.944.944 0 0 1 0 .904C21.448 16.486 17.185 20.5 12 20.5S2.552 16.486 2.05 13.452a.944.944 0 0 1 0-.904C2.552 8.514 6.815 4.5 12 4.5zM12 6a9 9 0 0 0-8.72 6.752.944.944 0 0 1 0 .496A9 9 0 0 0 12 18a9 9 0 0 0 8.72-4.752.944.944 0 0 1 0-.496A9 9 0 0 0 12 6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12.75a2.25 2.25 0 1 1 0-4.5 2.25 2.25 0 0 1 0 4.5z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15a7 7 0 01-7-7M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        <Button
          type='submit'
          gradientDuoTone='purpleToBlue'
          outline
          className="bg-slate-400 text-black"
          disabled={loading}
        >
          {loading ? 'Loading..' : 'Update Account'}
        </Button>
        {currentUser.isAdmin && (
          <Link to='/addmusic'>
            <Button
              type='button'
               gradientDuoTone='purpleToBlue'
              className='w-full , text-black bg-slate-400 '
              outline
            >
              Add Music
            </Button>
          </Link>
          
          
        )}   
        {currentUser.isAdmin && (
          <Link to='/addalbum'>
            <Button
              type='button'
               gradientDuoTone='purpleToBlue'
              className='w-full , text-black bg-slate-400 '
              outline
            >
              Add New Album
            </Button>
          </Link>
          
          
        )}   
      </form>
      <div className='text-red-500 flex justify-between mt-5'>
        <span onClick={() => setShowModel(true)} className='cursor-pointer'>
          Delete Account
        </span>
        <span onClick={handleSignOut} className='cursor-pointer'>
          Sign Out
        </span>
      </div>
      <div className="text-green-600">
        {updateSuccess && (
          <Alert color='success' className='mt-5'>
            {updateSuccess}
          </Alert>
        )}
      </div>
      <div className="text-red-600">
        {updateUserError && (
          <Alert color='failure' className='mt-5'>
            {updateUserError}
          </Alert>
        )}
      </div>
      <Modal show={showModel} onClose={() => setShowModel(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-200">Are you sure you want to Delete your Account</h3>
          </div>
          <div className='flex justify-center gap-4'>
            <Button color='failure' onClick={handleDeleteUser} className="bg-red-600">
              Yes, I am sure
            </Button>
            <Button color='gray' onClick={() => setShowModel(false)} className="bg-green-600">
              No, cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}