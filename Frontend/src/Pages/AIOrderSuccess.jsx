import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AIOrderSuccess = () => {
  const { userId } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser || currentUser._id !== userId) {
      navigate('/bible/ai');
    }
  }, [currentUser, userId, navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full border border-gray-100 transform transition-all hover:shadow-2xl">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-200 p-4 rounded-full animate-pulse">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-12 w-12 text-green-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-3xl font-bold text-center text-green-500 mb-4">
          Payment Successful!
        </h1>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
          <p className="text-blue-800 text-center">
            Thank you for purchasing the Bible AI API Key. Your API key will be sent to your email within 24 hours.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/bible/ai')}
            className="w-1/2 flex mx-auto justify-center bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-blue-700 hover:to-cyan-500 text-white py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Back to Bible AI
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            Need help? <a href="/contactus" className="text-blue-600 hover:underline">Contact support</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIOrderSuccess;