// // import React, { useState, useEffect, useCallback } from "react";
// // import { X, CreditCard, DollarSign, Loader2, Check } from "lucide-react";

// // export default function PaymentModal({
// //   isOpen,
// //   onClose,
// //   totalAmount = 0,
// //   orderData = {},
// //   onPaymentSuccess,
// // }) {
// //   const [method, setMethod] = useState("online");
// //   const [loading, setLoading] = useState(false);

// //   useEffect(() => {
// //     if (isOpen) {
// //       document.body.style.overflow = 'hidden';
// //     }
// //     return () => {
// //       document.body.style.overflow = 'auto';
// //     };
// //   }, [isOpen]);

// //   // Function to dynamically load the Razorpay script
// //   const loadRazorpayScript = () => {
// //     return new Promise((resolve, reject) => {
// //       // If already loaded, resolve immediately
// //       if (window.Razorpay) {
// //         resolve(true);
// //         return;
// //       }
// //       const script = document.createElement("script");
// //       script.src = "https://checkout.razorpay.com/v1/checkout.js";
// //       script.async = true;
// //       script.onload = () => resolve(true);
// //       script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
// //       document.body.appendChild(script);
// //     });
// //   };

// //   const handlePayment = useCallback(async () => {
// //     setLoading(true);
// //     try {
// //       if (method === "online") {
// //         // 1. Dynamically load the Razorpay SDK
// //         const isLoaded = await loadRazorpayScript();
// //         if (!isLoaded) throw new Error("Razorpay SDK failed to load");

// //         // 2. Setup options (In reality, fetch order ID from backend here)
// //         const options = {
// //           key: "YOUR_RAZORPAY_KEY", // Replace with your actual Test/Live Key
// //           amount: totalAmount * 100, // Amount in paise
// //           currency: "INR",
// //           name: "Varun Store",
// //           description: "Cafe Order Payment",
// //           handler: function (response) {
// //             // Payment successful
// //             onPaymentSuccess?.(method, orderData);
// //           },
// //           prefill: {
// //             name: customerName,
// //           },
// //           theme: {
// //             color: "#6366f1",
// //           },
// //           modal: {
// //             ondismiss: function () {
// //               setLoading(false);
// //             }
// //           }
// //         };

// //         const razorpayInstance = new window.Razorpay(options);
// //         razorpayInstance.on("payment.failed", function (response) {
// //           console.error("Payment failed:", response.error);
// //           setLoading(false);
// //         });
        
// //         razorpayInstance.open();
// //         // Don't set loading false here, let the handler or ondismiss handle it
// //       } else {
// //         // Cash payment simulation
// //         await new Promise(resolve => setTimeout(resolve, 2000));
// //         onPaymentSuccess?.(method, orderData);
// //         setLoading(false);
// //       }
// //     } catch (err) {
// //       console.error('Payment failed:', err);
// //       setLoading(false);
// //     }
// //   }, [method, orderData, onPaymentSuccess, totalAmount, customerName]);

// //   if (!isOpen) return null;

// //   const customerName = orderData?.customerName || orderData?.customerInfo?.name || "Guest";
// //   const tableNumber = orderData?.table || orderData?.customerInfo?.table || null;
// //   const isDineIn = !!tableNumber;

// //   const getPaymentMethodClassName = (currentMethod) => {
// //     return currentMethod === method 
// //       ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/5 shadow-lg ring-2 ring-indigo-500/20" 
// //       : "border-slate-200/50 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 bg-white/80 dark:bg-slate-800/50 hover:shadow-md";
// //   };

// //   const getIconClassName = (currentMethod) => {
// //     return currentMethod === method 
// //       ? "bg-indigo-500 text-white shadow-lg" 
// //       : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600";
// //   };

// //   const getTextClassName = (currentMethod) => {
// //     return currentMethod === method 
// //       ? "text-indigo-900 dark:text-indigo-100 font-bold" 
// //       : "text-slate-900 dark:text-white";
// //   };

// //   const getRadioClassName = (currentMethod) => {
// //     return currentMethod === method 
// //       ? "border-indigo-500 bg-indigo-500 shadow-md" 
// //       : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800";
// //   };

// //   return (
// //     <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 lg:p-8" role="dialog" aria-modal="true">
// //       {/* Deep Blur Backdrop */}
// //       <div
// //         className="absolute inset-0 bg-slate-900/50 backdrop-blur-xl"
// //         onClick={onClose}
// //         aria-label="Close payment modal"
// //       />

// //       {/* Premium Modal Container */}
// //       <div 
// //         className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl w-full max-w-2xl mx-auto rounded-[3rem] shadow-2xl border border-white/50 dark:border-slate-800/50 overflow-hidden transform scale-95 animate-[pop-in_0.4s_cubic-bezier(0.34,1.56,0.64,1)]"
// //         onClick={(e) => e.stopPropagation()}
// //         role="document"
// //       >
// //         {/* Header */}
// //         <div className="px-8 pt-10 pb-8 border-b border-slate-100/50 dark:border-slate-800/50">
// //           <div className="flex items-start justify-between gap-4">
// //             <div className="flex-1">
// //               <h2 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent tracking-tight mb-2">
// //                 Secure Checkout
// //               </h2>
// //               <p className="text-lg font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
// //                 Complete your order of ${totalAmount.toFixed(2)}
// //               </p>
// //             </div>
// //             <button
// //               onClick={onClose}
// //               className="p-3 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 transition-all duration-200 hover:shadow-md active:scale-95 shrink-0"
// //               aria-label="Close payment modal"
// //             >
// //               <X size={24} strokeWidth={2.5} />
// //             </button>
// //           </div>
// //         </div>

// //         {/* Main Content */}
// //         <div className="p-8 pb-12 space-y-8">
          
// //           {/* Order Summary Card */}
// //           <div className="bg-gradient-to-br from-white/70 to-slate-50/70 dark:from-slate-800/70 dark:to-slate-900/70 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-xl border border-slate-100/50 dark:border-slate-700/50 hover:shadow-2xl transition-all duration-300">
// //             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
// //               <div>
// //                 <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Customer</p>
// //                 <div className="flex items-center gap-3 p-4 bg-white/50 dark:bg-slate-700/50 rounded-2xl border border-slate-100/50 dark:border-slate-600/50">
// //                   <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
// //                     <span className="text-white font-bold text-sm">👤</span>
// //                   </div>
// //                   <div>
// //                     <p className="font-bold text-xl text-slate-900 dark:text-white truncate">{customerName}</p>
// //                     <p className="text-sm text-slate-500">{isDineIn ? `Table #${tableNumber}` : 'Takeaway Order'}</p>
// //                   </div>
// //                 </div>
// //               </div>
              
// //               <div className="text-right lg:text-left">
// //                 <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Total Amount</p>
// //                 <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 rounded-3xl shadow-2xl border border-emerald-100/50">
// //                   <span className="text-5xl font-black text-white tracking-[-0.05em] drop-shadow-lg">
// //                     ${totalAmount.toFixed(2)}
// //                   </span>
// //                   <p className="text-emerald-100 text-sm font-medium mt-1">Due Now</p>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Payment Methods */}
// //           <div className="space-y-4">
// //             {/* Card Payment */}
// //             <button
// //               type="button"
// //               onClick={() => setMethod("online")}
// //               disabled={loading}
// //               className={`group relative w-full p-8 flex items-center justify-between rounded-[2.5rem] transition-all duration-500 overflow-hidden hover:shadow-2xl active:scale-[0.98] ${getPaymentMethodClassName("online")}`}
// //             >
// //               <div className="flex items-center gap-5 z-10">
// //                 <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-xl transition-all group-hover:scale-105 ${getIconClassName("online")}`}>
// //                   <CreditCard size={24} strokeWidth={method === "online" ? 3 : 2.5} />
// //                 </div>
// //                 <div>
// //                   <h3 className={`text-xl font-black ${getTextClassName("online")}`}>Card Payment</h3>
// //                   <p className="text-sm font-medium text-slate-500 mt-1">Apple Pay, Google Pay, Cards</p>
// //                   <p className="text-xs text-slate-400 mt-1">Secure & Instant</p>
// //                 </div>
// //               </div>
// //               <div className={`w-8 h-8 rounded-2xl border-3 flex items-center justify-center shadow-md transition-all ${getRadioClassName("online")}`}>
// //                 {method === "online" && <div className="w-3 h-3 bg-white rounded-full shadow-sm"></div>}
// //               </div>
// //             </button>

// //             {/* Cash Payment */}
// //             <button
// //               type="button"
// //               onClick={() => setMethod("cash")}
// //               disabled={loading}
// //               className={`group relative w-full p-8 flex items-center justify-between rounded-[2.5rem] transition-all duration-500 overflow-hidden hover:shadow-2xl active:scale-[0.98] ${getPaymentMethodClassName("cash")}`}
// //             >
// //               <div className="flex items-center gap-5 z-10">
// //                 <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-xl transition-all group-hover:scale-105 ${getIconClassName("cash")}`}>
// //                   <DollarSign size={24} strokeWidth={method === "cash" ? 3 : 2.5} />
// //                 </div>
// //                 <div>
// //                   <h3 className={`text-xl font-black ${getTextClassName("cash")}`}>Cash Payment</h3>
// //                   <p className="text-sm font-medium text-slate-500 mt-1">Pay at counter</p>
// //                   <p className="text-xs text-slate-400 mt-1">Exact change preferred</p>
// //                 </div>
// //               </div>
// //               <div className={`w-8 h-8 rounded-2xl border-3 flex items-center justify-center shadow-md transition-all ${getRadioClassName("cash")}`}>
// //                 {method === "cash" && <div className="w-3 h-3 bg-white rounded-full shadow-sm animate-pulse"></div>}
// //               </div>
// //             </button>
// //           </div>

// //           {/* Pay Button */}
// //           <button
// //             onClick={handlePayment}
// //             disabled={loading}
// //             className="group relative w-full h-20 rounded-[3rem] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-indigo-600 dark:via-purple-500 dark:to-indigo-700 text-white font-black text-xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all duration-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden disabled:shadow-none"
// //           >
// //             <span className="relative z-10 flex items-center justify-center gap-3">
// //               {loading ? (
// //                 <>
// //                   <Loader2 className="w-6 h-6 animate-spin" />
// //                   Processing Payment...
// //                 </>
// //               ) : (
// //                 `Pay $${totalAmount.toFixed(2)}`
// //               )}
// //             </span>
// //             <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-white/30 -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
// //           </button>

// //           {/* Security Badge */}
// //           <div className="text-center pt-8 border-t border-slate-100/50 dark:border-slate-800/50">
// //             <div className="flex items-center justify-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
// //               <Check size={18} className="animate-pulse" />
// //               <span>End-to-End Encrypted</span>
// //               <CreditCard size={16} className="ml-1" />
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// import React, { useState, useEffect, useCallback } from "react";
// import { X, CreditCard, DollarSign, Loader2, Check } from "lucide-react";

// export default function PaymentModal({
//   isOpen,
//   onClose,
//   totalAmount = 0,
//   orderData = {},
//   onPaymentSuccess,
// }) {
//   const [method, setMethod] = useState("online");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (isOpen) {
//       document.body.style.overflow = 'hidden';
//     }
//     return () => {
//       document.body.style.overflow = 'auto';
//     };
//   }, [isOpen]);

//   // Function to dynamically load the Razorpay script
//   const customerName = orderData?.customerName || orderData?.customerInfo?.name || "Guest";
//   const tableNumber = orderData?.table || orderData?.customerInfo?.table || null;
//   const isDineIn = !!tableNumber;
//   const handlePayment = useCallback(async () => {
//     setLoading(true);
//     try {
//       // Simulate payment processing
//       await new Promise(resolve => setTimeout(resolve, 2000));
//       onPaymentSuccess?.(method, orderData);
//     } catch (err) {
//       console.error('Payment failed:', err);
//     } finally {
//       setLoading(false);
//     }
//   }, [method, orderData, onPaymentSuccess]);

//   if (!isOpen) return null;



//   const getPaymentMethodClassName = (currentMethod) => {
//     return currentMethod === method 
//       ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/5 shadow-lg ring-2 ring-indigo-500/20" 
//       : "border-slate-200/50 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 bg-white/80 dark:bg-slate-800/50 hover:shadow-md";
//   };

//   const getIconClassName = (currentMethod) => {
//     return currentMethod === method 
//       ? "bg-indigo-500 text-white shadow-lg" 
//       : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600";
//   };

//   const getTextClassName = (currentMethod) => {
//     return currentMethod === method 
//       ? "text-indigo-900 dark:text-indigo-100 font-bold" 
//       : "text-slate-900 dark:text-white";
//   };

//   const getRadioClassName = (currentMethod) => {
//     return currentMethod === method 
//       ? "border-indigo-500 bg-indigo-500 shadow-md" 
//       : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800";
//   };

//   return (
//     <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 lg:p-8" role="dialog" aria-modal="true">
//       {/* Deep Blur Backdrop */}
//       <div
//         className="absolute inset-0 bg-slate-900/50 backdrop-blur-xl"
//         onClick={onClose}
//         aria-label="Close payment modal"
//       />

//       {/* Premium Modal Container */}
//       <div 
//         className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl w-full max-w-2xl mx-auto rounded-[3rem] shadow-2xl border border-white/50 dark:border-slate-800/50 overflow-hidden transform scale-95 animate-[pop-in_0.4s_cubic-bezier(0.34,1.56,0.64,1)]"
//         onClick={(e) => e.stopPropagation()}
//         role="document"
//       >
//         {/* Header */}
//         <div className="px-8 pt-10 pb-8 border-b border-slate-100/50 dark:border-slate-800/50">
//           <div className="flex items-start justify-between gap-4">
//             <div className="flex-1">
//               <h2 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent tracking-tight mb-2">
//                 Secure Checkout
//               </h2>
//               <p className="text-lg font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
//                 Complete your order of ${totalAmount.toFixed(2)}
//               </p>
//             </div>
//             <button
//               onClick={onClose}
//               className="p-3 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 transition-all duration-200 hover:shadow-md active:scale-95 shrink-0"
//               aria-label="Close payment modal"
//             >
//               <X size={24} strokeWidth={2.5} />
//             </button>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="p-8 pb-12 space-y-8">
          
//           {/* Order Summary Card */}
//           <div className="bg-gradient-to-br from-white/70 to-slate-50/70 dark:from-slate-800/70 dark:to-slate-900/70 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-xl border border-slate-100/50 dark:border-slate-700/50 hover:shadow-2xl transition-all duration-300">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//               <div>
//                 <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Customer</p>
//                 <div className="flex items-center gap-3 p-4 bg-white/50 dark:bg-slate-700/50 rounded-2xl border border-slate-100/50 dark:border-slate-600/50">
//                   <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
//                     <span className="text-white font-bold text-sm">👤</span>
//                   </div>
//                   <div>
//                     <p className="font-bold text-xl text-slate-900 dark:text-white truncate">{customerName}</p>
//                     <p className="text-sm text-slate-500">{isDineIn ? `Table #${tableNumber}` : 'Takeaway Order'}</p>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="text-right lg:text-left">
//                 <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Total Amount</p>
//                 <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 rounded-3xl shadow-2xl border border-emerald-100/50">
//                   <span className="text-5xl font-black text-white tracking-[-0.05em] drop-shadow-lg">
//                     ${totalAmount.toFixed(2)}
//                   </span>
//                   <p className="text-emerald-100 text-sm font-medium mt-1">Due Now</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Payment Methods */}
//           <div className="space-y-4">
//             {/* Card Payment */}
//             <button
//               type="button"
//               onClick={() => setMethod("online")}
//               disabled={loading}
//               className={`group relative w-full p-8 flex items-center justify-between rounded-[2.5rem] transition-all duration-500 overflow-hidden hover:shadow-2xl active:scale-[0.98] ${getPaymentMethodClassName("online")}`}
//             >
//               <div className="flex items-center gap-5 z-10">
//                 <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-xl transition-all group-hover:scale-105 ${getIconClassName("online")}`}>
//                   <CreditCard size={24} strokeWidth={method === "online" ? 3 : 2.5} />
//                 </div>
//                 <div>
//                   <h3 className={`text-xl font-black ${getTextClassName("online")}`}>Card Payment</h3>
//                   <p className="text-sm font-medium text-slate-500 mt-1">Apple Pay, Google Pay, Cards</p>
//                   <p className="text-xs text-slate-400 mt-1">Secure & Instant</p>
//                 </div>
//               </div>
//               <div className={`w-8 h-8 rounded-2xl border-3 flex items-center justify-center shadow-md transition-all ${getRadioClassName("online")}`}>
//                 {method === "online" && <div className="w-3 h-3 bg-white rounded-full shadow-sm"></div>}
//               </div>
//             </button>

//             {/* Cash Payment */}
//             <button
//               type="button"
//               onClick={() => setMethod("cash")}
//               disabled={loading}
//               className={`group relative w-full p-8 flex items-center justify-between rounded-[2.5rem] transition-all duration-500 overflow-hidden hover:shadow-2xl active:scale-[0.98] ${getPaymentMethodClassName("cash")}`}
//             >
//               <div className="flex items-center gap-5 z-10">
//                 <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-xl transition-all group-hover:scale-105 ${getIconClassName("cash")}`}>
//                   <DollarSign size={24} strokeWidth={method === "cash" ? 3 : 2.5} />
//                 </div>
//                 <div>
//                   <h3 className={`text-xl font-black ${getTextClassName("cash")}`}>Cash Payment</h3>
//                   <p className="text-sm font-medium text-slate-500 mt-1">Pay at counter</p>
//                   <p className="text-xs text-slate-400 mt-1">Exact change preferred</p>
//                 </div>
//               </div>
//               <div className={`w-8 h-8 rounded-2xl border-3 flex items-center justify-center shadow-md transition-all ${getRadioClassName("cash")}`}>
//                 {method === "cash" && <div className="w-3 h-3 bg-white rounded-full shadow-sm animate-pulse"></div>}
//               </div>
//             </button>
//           </div>

//           {/* Pay Button */}
//           <button
//             onClick={handlePayment}
//             disabled={loading}
//             className="group relative w-full h-20 rounded-[3rem] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-indigo-600 dark:via-purple-500 dark:to-indigo-700 text-white font-black text-xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all duration-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden disabled:shadow-none"
//           >
//             <span className="relative z-10 flex items-center justify-center gap-3">
//               {loading ? (
//                 <>
//                   <Loader2 className="w-6 h-6 animate-spin" />
//                   Processing Payment...
//                 </>
//               ) : (
//                 `Pay $${totalAmount.toFixed(2)}`
//               )}
//             </span>
//             <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-white/30 -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
//           </button>

//           {/* Security Badge */}
//           <div className="text-center pt-8 border-t border-slate-100/50 dark:border-slate-800/50">
//             <div className="flex items-center justify-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
//               <Check size={18} className="animate-pulse" />
//               <span>End-to-End Encrypted</span>
//               <CreditCard size={16} className="ml-1" />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect, useCallback } from "react";
import { X, CreditCard, DollarSign, Loader2, Check } from "lucide-react";

export default function PaymentModal({
  isOpen,
  onClose,
  totalAmount = 0,
  orderData = {},
  onPaymentSuccess,
}) {
  const [method, setMethod] = useState("online");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Function to dynamically load the Razorpay script
  const customerName = orderData?.customerName || orderData?.customerInfo?.name || "Guest";
  const tableNumber = orderData?.table || orderData?.customerInfo?.table || null;
  const isDineIn = !!tableNumber;
  const handlePayment = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      onPaymentSuccess?.(method, orderData);
    } catch (err) {
      console.error('Payment failed:', err);
    } finally {
      setLoading(false);
    }
  }, [method, orderData, onPaymentSuccess]);

  if (!isOpen) return null;



  const getPaymentMethodClassName = (currentMethod) => {
    return currentMethod === method 
      ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/5 shadow-lg ring-2 ring-indigo-500/20" 
      : "border-slate-200/50 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 bg-white/80 dark:bg-slate-800/50 hover:shadow-md";
  };

  const getIconClassName = (currentMethod) => {
    return currentMethod === method 
      ? "bg-indigo-500 text-white shadow-lg" 
      : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600";
  };

  const getTextClassName = (currentMethod) => {
    return currentMethod === method 
      ? "text-indigo-900 dark:text-indigo-100 font-bold" 
      : "text-slate-900 dark:text-white";
  };

  const getRadioClassName = (currentMethod) => {
    return currentMethod === method 
      ? "border-indigo-500 bg-indigo-500 shadow-md" 
      : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800";
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 lg:p-8" role="dialog" aria-modal="true">
      {/* Deep Blur Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xl"
        onClick={onClose}
        aria-label="Close payment modal"
      />

      {/* Premium Modal Container */}
      <div 
        className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl w-full max-w-2xl mx-auto rounded-[3rem] shadow-2xl border border-white/50 dark:border-slate-800/50 overflow-hidden transform scale-95 animate-[pop-in_0.4s_cubic-bezier(0.34,1.56,0.64,1)]"
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        {/* Header */}
        <div className="px-8 pt-10 pb-8 border-b border-slate-100/50 dark:border-slate-800/50">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent tracking-tight mb-2">
                Secure Checkout
              </h2>
              <p className="text-lg font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                Complete your order of ${totalAmount.toFixed(2)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-3 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 transition-all duration-200 hover:shadow-md active:scale-95 shrink-0"
              aria-label="Close payment modal"
            >
              <X size={24} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8 pb-12 space-y-8">
          
          {/* Order Summary Card */}
          <div className="bg-gradient-to-br from-white/70 to-slate-50/70 dark:from-slate-800/70 dark:to-slate-900/70 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-xl border border-slate-100/50 dark:border-slate-700/50 hover:shadow-2xl transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Customer</p>
                <div className="flex items-center gap-3 p-4 bg-white/50 dark:bg-slate-700/50 rounded-2xl border border-slate-100/50 dark:border-slate-600/50">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">👤</span>
                  </div>
                  <div>
                    <p className="font-bold text-xl text-slate-900 dark:text-white truncate">{customerName}</p>
                    <p className="text-sm text-slate-500">{isDineIn ? `Table #${tableNumber}` : 'Takeaway Order'}</p>
                  </div>
                </div>
              </div>
              
              <div className="text-right lg:text-left">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Total Amount</p>
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 rounded-3xl shadow-2xl border border-emerald-100/50">
                  <span className="text-5xl font-black text-white tracking-[-0.05em] drop-shadow-lg">
                    ${totalAmount.toFixed(2)}
                  </span>
                  <p className="text-emerald-100 text-sm font-medium mt-1">Due Now</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4">
            {/* Card Payment */}
            <button
              type="button"
              onClick={() => setMethod("online")}
              disabled={loading}
              className={`group relative w-full p-8 flex items-center justify-between rounded-[2.5rem] transition-all duration-500 overflow-hidden hover:shadow-2xl active:scale-[0.98] ${getPaymentMethodClassName("online")}`}
            >
              <div className="flex items-center gap-5 z-10">
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-xl transition-all group-hover:scale-105 ${getIconClassName("online")}`}>
                  <CreditCard size={24} strokeWidth={method === "online" ? 3 : 2.5} />
                </div>
                <div>
                  <h3 className={`text-xl font-black ${getTextClassName("online")}`}>Card Payment</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">Apple Pay, Google Pay, Cards</p>
                  <p className="text-xs text-slate-400 mt-1">Secure & Instant</p>
                </div>
              </div>
              <div className={`w-8 h-8 rounded-2xl border-3 flex items-center justify-center shadow-md transition-all ${getRadioClassName("online")}`}>
                {method === "online" && <div className="w-3 h-3 bg-white rounded-full shadow-sm"></div>}
              </div>
            </button>

            {/* Cash Payment */}
            <button
              type="button"
              onClick={() => setMethod("cash")}
              disabled={loading}
              className={`group relative w-full p-8 flex items-center justify-between rounded-[2.5rem] transition-all duration-500 overflow-hidden hover:shadow-2xl active:scale-[0.98] ${getPaymentMethodClassName("cash")}`}
            >
              <div className="flex items-center gap-5 z-10">
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-xl transition-all group-hover:scale-105 ${getIconClassName("cash")}`}>
                  <DollarSign size={24} strokeWidth={method === "cash" ? 3 : 2.5} />
                </div>
                <div>
                  <h3 className={`text-xl font-black ${getTextClassName("cash")}`}>Cash Payment</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">Pay at counter</p>
                  <p className="text-xs text-slate-400 mt-1">Exact change preferred</p>
                </div>
              </div>
              <div className={`w-8 h-8 rounded-2xl border-3 flex items-center justify-center shadow-md transition-all ${getRadioClassName("cash")}`}>
                {method === "cash" && <div className="w-3 h-3 bg-white rounded-full shadow-sm animate-pulse"></div>}
              </div>
            </button>
          </div>

          {/* Pay Button */}
          <button
            onClick={handlePayment}
            disabled={loading}
            className="group relative w-full h-20 rounded-[3rem] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-indigo-600 dark:via-purple-500 dark:to-indigo-700 text-white font-black text-xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all duration-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden disabled:shadow-none"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                `Pay $${totalAmount.toFixed(2)}`
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-white/30 -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </button>

          {/* Security Badge */}
          <div className="text-center pt-8 border-t border-slate-100/50 dark:border-slate-800/50">
            <div className="flex items-center justify-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              <Check size={18} className="animate-pulse" />
              <span>End-to-End Encrypted</span>
              <CreditCard size={16} className="ml-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}