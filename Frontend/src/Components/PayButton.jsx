import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

const PayButton = ({ music, price }) => {
  const { currentUser } = useSelector((state) => state.user);

  const handleCheckout = async () => {
    if (!currentUser) {
      alert('Please sign in to proceed with the payment.');
      return;
    }

    if (!music || !music._id || !music.image) {
      console.error('Invalid music object or missing _id or image', music);
      return;
    }

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          musicId: music._id,
          title: music.title,
          price: price, // Pass the selected price
          image: music.image,
          userId: currentUser._id,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('No URL returned from Stripe session creation', data);
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      className="mt-4 w-60 rounded-md bg-indigo-600 px-6 py-3 font-medium text-white"
    >
      <FontAwesomeIcon icon={faDownload} className="mr-2" />
      {currentUser ? 'Proceed to Payment' : 'Sign in to Download'}
    </button>
  );
};

export default PayButton;
