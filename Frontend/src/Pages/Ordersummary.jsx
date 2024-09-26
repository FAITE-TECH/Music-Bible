import { useLocation, useNavigate } from 'react-router-dom';
import PayButton from '../Components/PayButton';

export default function OrderSummary() {
  const location = useLocation();
  const navigate = useNavigate();
  const musicItem = location.state?.musicItem; 
  const defaultPrice = 500; 

  const totalCost = defaultPrice; 

  return (
    <>
      <div className="flex justify-center py-4 bg-white sm:px-10 lg:px-20 xl:px-32">
        <h2 className="text-2xl font-bold text-gray-800">Order Summary</h2>
      </div>
      <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
        <div className="px-4 pt-8">
          <div className="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">
            <div className="flex flex-col rounded-lg bg-white sm:flex-row">
              <img
                className="m-2 h-24 w-28 rounded-md border object-cover object-center"
                src={musicItem.image}
                alt={musicItem.title}
              />
              <div className="flex w-full flex-col px-4 py-4">
                <span className="font-semibold">{musicItem.title}</span>
                <span className="float-right text-gray-400">Qty: 1</span>
                <p className="text-lg font-bold">₹{defaultPrice}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
          <h2 className="text-xl font-medium text-gray-800">Order Details</h2>
          <div className="mt-6 space-y-6">
            <div className="flex justify-between">
              <span>Music cost</span>
              <span>₹{defaultPrice}</span>
            </div>
          </div>
          <div className="mt-6 border-t border-b py-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-800">Total Cost</span>
              <span className="text-2xl font-semibold text-gray-800">₹{totalCost}</span>
            </div>
          </div>
          {/* Pass the musicItem to PayButton */}
          <PayButton music={musicItem} />
        </div>
      </div>
    </>
  );
}
