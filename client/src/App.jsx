import React, { useEffect, useState } from "react";
import "/index.css";

const App = () => {
  const [message, setMessage] = useState("");
  const [coupons, setCoupons] = useState([]);

  const baseUrl = "http://localhost:5000"; // Use HTTP, not HTTPS



  useEffect(() => {
    fetch(`${baseUrl}/all-coupon`)
      .then(response => response.json())
      .then(data => setCoupons(data))
      .catch(error => console.error("Error fetching coupons:", error));
  }, []);

  const claimCoupon = async () => {
    try {
      const res = await fetch(`${baseUrl}/claim-coupon`);
      const data = await res.json();
      setMessage(data.message);

      // Update the coupon list after claiming
      setCoupons(prevCoupons =>
        prevCoupons.map(coupon =>
          coupon._id === data.coupon?._id ? { ...coupon, assignedTo: "::1" } : coupon
        )
      );
    } catch (err) {
      setMessage("Error claiming coupon");
    }
  };
  console.log(coupons)
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">
        Round-Robin Coupon Distribution
      </h1>
      <button
        onClick={claimCoupon}
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md transition"
      >
        Claim Coupon
      </button>
      <p className="mt-3 text-lg font-semibold text-gray-700">{message}</p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Available Coupons</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-3xl">
        {/* console.log(); */}

        {coupons?.map(coupon => (
          <div
            key={coupon._id}
            className={`p-4 border rounded-lg shadow-md text-center transition ${coupon.assignedTo
              ? "bg-gray-200 border-gray-500 line-through hover:bg-red-300"
              : "bg-white hover:bg-green-100"
              }`}
          >
            <span className="text-lg font-medium">{coupon.code}</span>
            {coupon.assignedTo ? (
              <div className="text-sm font-semibold text-red-700 mt-1">
                Claimed
              </div>
            ) : (
              <div className="text-sm font-semibold text-green-700 mt-1">
                Available
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
