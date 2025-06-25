// pages/AIOrderSuccess.js
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h1>
        <p className="text-gray-700 mb-6">
          Thank you for purchasing the Bible AI API Key. Your API key will be sent to your email within 24 hours.
        </p>
        <button
          onClick={() => navigate('/bible/ai')}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Back to Bible AI
        </button>
      </div>
    </div>
  );
};

export default AIOrderSuccess;