// // import { useState, useEffect, useMemo, useCallback, useRef } from "react";
// // import { itemsAPI, categoriesAPI, tablesAPI, ordersAPI } from "../services/api";
// // import { toast } from "react-hot-toast";
// // import React from "react";
// // import Header from "../components/home/Header";
// // import CategoryFilter from "../components/home/CategoryFilter";
// // import ItemCard from "../components/home/ItemCard";
// // const PaymentModal = React.lazy(() => import("../components/home/PaymentModal"));
// // import OrderSuccess from "../components/home/OrderSuccess";
// // import CafeStatus from "../components/CafeStatus/CafeStatus";
// // import CartDrawer from "../components/home/CartDrawer";

// // // ✅ FIX 1: Move styles OUTSIDE component so they never re-create on render
// // const globalStyles = `
// //   @keyframes fade-in-up {
// //     from { opacity: 0; transform: translateY(20px); }
// //     to { opacity: 1; transform: translateY(0); }
// //   }
// //   @keyframes shimmer {
// //     0% { transform: translateX(-150%) skewX(-12deg); }
// //     100% { transform: translateX(200%) skewX(-12deg); }
// //   }
// //   .scrollbar-hide::-webkit-scrollbar { display: none; }
// //   .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
// // `;

// // // ✅ FIX 2: Static style injection — runs ONCE, never re-renders
// // const styleEl = document.createElement("style");
// // styleEl.textContent = globalStyles;
// // if (!document.head.querySelector("#velvet-global-styles")) {
// //   styleEl.id = "velvet-global-styles";
// //   document.head.appendChild(styleEl);
// // }

// // export default function CustomerHome() {
// //   // 🎯 Core Data States
// //   const [items, setItems] = useState([]);
// //   const [categories, setCategories] = useState([]);
// //   const [tables, setTables] = useState([]);
// //   const [cart, setCart] = useState([]);

// //   // 🎨 UI Control States
// //   const [activeCat, setActiveCat] = useState("All");
// //   const [search, setSearch] = useState("");
// //   const [typeFilter, setTypeFilter] = useState("");
// //   const [isCartOpen, setIsCartOpen] = useState(false);

// //   // 🛒 Modal & Loading States
// //   const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [orderStatus, setOrderStatus] = useState("idle");
// //   const [currentOrder, setCurrentOrder] = useState(null);

// //   // 📍 Performance Refs
// //   const mainRef = useRef(null);
// //   const cartSidebarRef = useRef(null);
// //   const isInitialized = useRef(false);
// //   const cartLoaded = useRef(false);

// //   // ✅ FIX 3: fetchInitialData defined BEFORE the useEffect that calls it,
// //   // with empty deps so it never re-creates
// //   const fetchInitialData = useCallback(async () => {
// //     try {
// //       setLoading(true);
// //       setError(null);

// //       const [itemsRes, categoriesRes, tablesRes] = await Promise.allSettled([
// //         itemsAPI.getAll(),
// //         categoriesAPI.getAll(),
// //         tablesAPI.getAll(),
// //       ]);

// //       const newItems =
// //         itemsRes.status === "fulfilled" ? itemsRes.value?.data || [] : [];
// //       const newCategories =
// //         categoriesRes.status === "fulfilled"
// //           ? categoriesRes.value?.data || []
// //           : [];
// //       const newTables =
// //         tablesRes.status === "fulfilled" ? tablesRes.value?.data || [] : [];

// //       setItems(newItems);
// //       setCategories([{ _id: "all", name: "All" }, ...newCategories]);
// //       setTables(newTables.filter((t) => t.status === "available"));
// //     } catch (err) {
// //       console.error("🚨 Fetch failed:", err);
// //       setError("Failed to load menu");
// //       toast.error("Menu temporarily unavailable", {
// //         style: { borderRadius: "16px", background: "#333", color: "#fff" },
// //         id: "fetch-error",
// //       });
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, []); // ✅ empty deps — stable reference forever

// //   // ✅ FIX 4: Single init — strict guard via ref
// //   useEffect(() => {
// //     if (isInitialized.current) return;
// //     isInitialized.current = true;
// //     fetchInitialData();
// //   }, [fetchInitialData]);

// //   // ✅ FIX 5: Cart load — only once after items are ready
// //   useEffect(() => {
// //     if (cartLoaded.current || !items.length) return;
// //     cartLoaded.current = true;

// //     const savedCart = localStorage.getItem("velvetCart");
// //     if (!savedCart) return;

// //     try {
// //       const parsedCart = JSON.parse(savedCart);
// //       const validCart = parsedCart.filter((cartItem) =>
// //         items.some((item) => item._id === cartItem._id)
// //       );
// //       if (validCart.length > 0) setCart(validCart);
// //     } catch {
// //       localStorage.removeItem("velvetCart");
// //     }
// //   }, [items]);

// //   // ✅ FIX 6: Cart save — debounced, only after initial cart load
// //   useEffect(() => {
// //     if (!cartLoaded.current) return;

// //     const id = setTimeout(() => {
// //       if (cart.length > 0) {
// //         localStorage.setItem("velvetCart", JSON.stringify(cart));
// //       } else {
// //         localStorage.removeItem("velvetCart");
// //       }
// //     }, 500);

// //     return () => clearTimeout(id);
// //   }, [cart]);

// //   // ✅ FIX 7: handleRetry resets init ref so fetchInitialData can run again
// //   const handleRetry = useCallback(() => {
// //     isInitialized.current = false;
// //     cartLoaded.current = false;
// //     setError(null);
// //     fetchInitialData().finally(() => {
// //       isInitialized.current = true;
// //     });
// //   }, [fetchInitialData]);

// //   // ⚡ Memoized derivations
// //   const filteredItems = useMemo(() => {
// //     return items.filter((item) => {
// //       const matchesCat =
// //         activeCat === "All" ||
// //         item.category?._id === activeCat ||
// //         item.category?.name === activeCat;
// //       const matchesType = !typeFilter || item.type === typeFilter;
// //       const matchesSearch =
// //         !search ||
// //         item.name?.toLowerCase().includes(search.toLowerCase()) ||
// //         item.description?.toLowerCase().includes(search.toLowerCase());
// //       return matchesCat && matchesType && matchesSearch;
// //     });
// //   }, [items, activeCat, typeFilter, search]);

// //   const cartTotals = useMemo(() => {
// //     const subtotal = cart.reduce(
// //       (acc, item) => acc + Number(item.price || 0) * (item.qty || 0),
// //       0
// //     );
// //     const tax = subtotal * 0.05;
// //     const total = subtotal + tax;
// //     return {
// //       subtotal: Number(subtotal.toFixed(2)),
// //       tax: Number(tax.toFixed(2)),
// //       total: Number(total.toFixed(2)),
// //     };
// //   }, [cart]);

// //   const totalItems = useMemo(
// //     () => cart.reduce((acc, item) => acc + (item.qty || 0), 0),
// //     [cart]
// //   );

// //   // 🛒 Cart operations
// //   const addToCart = useCallback((item) => {
// //     if (!item?._id) return;
// //     setCart((prev) => {
// //       const existing = prev.find((i) => i._id === item._id);
// //       if (existing) {
// //         return prev.map((i) =>
// //           i._id === item._id ? { ...i, qty: (i.qty || 0) + 1 } : i
// //         );
// //       }
// //       return [...prev, { ...item, qty: 1 }];
// //     });
// //     toast.success(`Added: ${item.name}`, {
// //       duration: 2000,
// //       position: "bottom-right",
// //       style: {
// //         borderRadius: "100px",
// //         background: "#0f172a",
// //         color: "#fff",
// //         boxShadow: "0 20px 40px -15px rgba(0,0,0,0.5)",
// //       },
// //       id: `add-${item._id}`,
// //     });
// //   }, []);

// //   const updateQty = useCallback((id, newQty) => {
// //     if (!id || newQty < 1) return;
// //     setCart((prev) =>
// //       prev
// //         .map((item) =>
// //           item._id === id ? { ...item, qty: Math.max(1, newQty) } : item
// //         )
// //         .filter((item) => (item.qty || 0) >= 1)
// //     );
// //   }, []);

// //   const removeFromCart = useCallback((id) => {
// //     if (!id) return;
// //     setCart((prev) => {
// //       toast.success("Item removed", {
// //         duration: 2000,
// //         position: "bottom-right",
// //         id: `remove-${id}`,
// //       });
// //       return prev.filter((item) => item._id !== id);
// //     });
// //   }, []);

// //   // ✅ FIX 8: handleCartCheckout — cartTotals ref to avoid stale closure
// //   const cartTotalsRef = useRef(cartTotals);
// //   useEffect(() => { cartTotalsRef.current = cartTotals; }, [cartTotals]);

// //   const handleCartCheckout = useCallback(
// //     async ({ customerInfo, orderType }) => {
// //       if (cart.length === 0) return;
// //       const totals = cartTotalsRef.current;

// //       try {
// //         const orderData = {
// //           customerName: customerInfo.name?.trim() || "Web Guest",
// //           phone: customerInfo.phone?.trim() || "0000000000",
// //           table: orderType === "dine-in" ? customerInfo.table : null,
// //           orderType: orderType || "takeaway",
// //           items: cart.map((item) => ({
// //             itemId: item._id,
// //             name: item.name || "Unknown Item",
// //             price: Number(item.price || 0).toFixed(2),
// //             quantity: item.qty || 1,
// //           })),
// //           subtotal: Number(totals.subtotal).toFixed(2),
// //           taxAmount: Number(totals.tax).toFixed(2),
// //           totalAmount: Number(totals.total).toFixed(2),
// //           paymentMethod: "cash",
// //           paymentStatus: "pending",
// //           status: "pending",
// //         };

// //         const res = await ordersAPI.create(orderData);
// //         setCurrentOrder(res.data);
// //         setOrderStatus("success");
// //         setCart([]);
// //         setIsCartOpen(false);
// //         localStorage.removeItem("velvetCart");
// //         toast.success("✅ Order placed successfully!", {
// //           duration: 4000,
// //           id: "order-success",
// //         });
// //       } catch (err) {
// //         console.error("❌ Checkout failed:", err);
// //         try {
// //           await ordersAPI.create({
// //             customerName: "Emergency Web Order",
// //             phone: "0000000000",
// //             items: cart.map((item) => ({
// //               name: item.name || "Unknown",
// //               quantity: item.qty || 1,
// //               price: Number(item.price || 0),
// //             })),
// //             totalAmount: Number(cartTotalsRef.current.total),
// //           });
// //           setCart([]);
// //           setIsCartOpen(false);
// //           localStorage.removeItem("velvetCart");
// //           toast.success("✅ Order saved as emergency order!", {
// //             duration: 4000,
// //             id: "fallback-success",
// //           });
// //         } catch {
// //           toast.error("Server busy. Cart saved locally for staff.", {
// //             duration: 5000,
// //             id: "server-busy",
// //           });
// //           setIsCartOpen(false);
// //         }
// //       }
// //     },
// //     [cart] // ✅ only cart in deps; totals accessed via ref
// //   );

// //   // 🎨 Loading screen
// //   if (loading) {
// //     return (
// //       <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
// //         <div className="w-full max-w-sm space-y-10 animate-pulse">
// //           <div className="h-12 bg-slate-200/60 rounded-full w-3/4 mx-auto blur-[1px]" />
// //           <div className="space-y-6">
// //             <div className="h-64 bg-slate-200/40 rounded-[2.5rem] mx-auto shadow-[0_30px_60px_rgba(0,0,0,0.02)]" />
// //             <div className="grid grid-cols-2 gap-6">
// //               <div className="h-32 bg-slate-200/40 rounded-3xl" />
// //               <div className="h-32 bg-slate-200/40 rounded-3xl" />
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // 🚨 Error screen
// //   if (error) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center p-8 bg-[#fafafa]">
// //         <div className="max-w-md w-full space-y-8 text-center p-12 bg-white/70 backdrop-blur-2xl rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.04)] border border-white">
// //           <div className="w-24 h-24 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
// //             <span className="material-symbols-outlined text-5xl">
// //               signal_cellular_nodata
// //             </span>
// //           </div>
// //           <div>
// //             <h2 className="text-2xl font-bold text-slate-800 tracking-tight mb-2">
// //               Connection Lost
// //             </h2>
// //             <p className="text-slate-500 text-sm leading-relaxed">
// //               We're having trouble reaching the kitchen. Please check your
// //               connection and try again.
// //             </p>
// //           </div>
// //           <button
// //             onClick={handleRetry}
// //             className="w-full bg-slate-900 text-white py-4 px-6 rounded-full font-medium shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 active:scale-95 transition-all text-sm"
// //           >
// //             Try Again
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     // ✅ FIX 9: CafeStatus must NOT re-mount on every render.
// //     // If CafeStatus has polling/intervals, ensure it has cleanup.
// //     // Wrap in React.memo if needed (see note below).
// //     <CafeStatus>
// //       <div className="min-h-screen relative bg-[#F8FAFC] text-slate-900 font-sans selection:bg-slate-200 selection:text-black overflow-x-hidden">

// //         {/* Background orbs */}
// //         <div className="fixed top-[-15%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-400/5 blur-[120px] pointer-events-none" />
// //         <div className="fixed bottom-[-15%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-400/5 blur-[120px] pointer-events-none" />
// //         <div className="fixed top-[40%] left-[20%] w-[30vw] h-[30vw] rounded-full bg-teal-400/5 blur-[100px] pointer-events-none" />

// //         {/* Header */}
// //         <div className="relative z-20 mix-blend-multiply">
// //           <Header
// //             search={search}
// //             setSearch={setSearch}
// //             totalItems={totalItems}
// //           />
// //         </div>

// //         {/* Main Layout */}
// //         <main
// //           ref={mainRef}
// //           className="pt-24 pb-32 lg:pb-16 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10 transition-all duration-500"
// //         >
// //           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">

// //             {/* Main Content */}
// //             <section className="lg:col-span-8 xl:col-span-9 order-2 lg:order-1 flex flex-col gap-10 lg:gap-14">

// //               {/* Hero Banner */}
// //               <div className="group relative w-full aspect-[4/3] sm:aspect-video lg:aspect-[21/9] rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)] transition-all duration-700 bg-white border border-white/50">
// //                 <img
// //                   className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 group-hover:rotate-[1deg] transition-all duration-1000 ease-out"
// //                   src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmwAmNiGAkSuDjc9Y4EcQVwHz9atlwLY0vwITnjAA2GVSIkeYRluRILLjajNUytQ_cXeeREL_VE50Aj7IorxwmWNMGVTUTbo6nWvxM1ykkQPadw4oLnU6zAPdREerr82dATYKrMhJ53dobn0DW7S7byRhPTZMMqWLDePDAlGMeqOsGI4cKuCDq5Pi4VJBFHZ0qOjgWzK5ImaFxvSrvexB2wd4mv6YWljDTyMekwKuDxl1APNPyoRvNS1gDwvrcfFdQEpY2J92bIpWA"
// //                   alt="Signature Roast"
// //                   loading="eager"
// //                 />
// //                 <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent flex flex-col justify-center p-8 sm:p-12 md:p-16 lg:p-20">
// //                   <div className="transform translate-y-4 opacity-0 animate-[fade-in-up_0.8s_ease-out_forwards]">
// //                     <span className="inline-flex items-center gap-2 text-white/90 text-xs sm:text-sm font-medium tracking-widest uppercase bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 mb-6 shadow-xl">
// //                       <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
// //                       New Arrivals
// //                     </span>
// //                     <h2 className="font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tighter text-white leading-[1.1] drop-shadow-2xl mb-6 max-w-2xl">
// //                       Signature <br className="hidden sm:block" /> Blend Roast.
// //                     </h2>
// //                     <p className="text-white/70 max-w-md text-sm sm:text-base md:text-lg font-light leading-relaxed mb-8 md:mb-10 hidden md:block">
// //                       Elevate your mornings with our meticulously crafted
// //                       Ethiopian blend, featuring delicate notes of dark cocoa
// //                       and sweet orange zest.
// //                     </p>
// //                     <button
// //                       onClick={() => {
// //                         const signatureItem = items.find(
// //                           (item) =>
// //                             item.name?.toLowerCase().includes("signature") ||
// //                             item.name?.toLowerCase().includes("roast")
// //                         );
// //                         if (signatureItem) addToCart(signatureItem);
// //                         else if (items[0]) addToCart(items[0]);
// //                       }}
// //                       className="group/btn relative overflow-hidden bg-white text-slate-900 px-8 sm:px-10 py-4 sm:py-5 rounded-full font-semibold text-sm sm:text-base shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 flex items-center gap-3 w-fit"
// //                     >
// //                       <span className="relative z-10 flex items-center gap-2">
// //                         Get Started
// //                         <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform">
// //                           arrow_forward
// //                         </span>
// //                       </span>
// //                       <div className="absolute inset-0 -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-slate-100/40 to-transparent skew-x-12" />
// //                     </button>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Filters */}
// //               <div className="relative z-20">
// //                 <CategoryFilter
// //                   categories={categories}
// //                   activeCat={activeCat}
// //                   setActiveCat={setActiveCat}
// //                   typeFilter={typeFilter}
// //                   setTypeFilter={setTypeFilter}
// //                 />
// //               </div>

// //               {/* Items Grid */}
// //               <div className="space-y-10 lg:space-y-12">
// //                 {filteredItems.length === 0 ? (
// //                   <div className="text-center py-20 px-4 bg-white/40 backdrop-blur-xl rounded-[3rem] border border-white shadow-sm">
// //                     <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
// //                       <span className="material-symbols-outlined text-4xl text-slate-400 block animate-pulse">
// //                         search_off
// //                       </span>
// //                     </div>
// //                     <h3 className="text-2xl font-bold text-slate-800 tracking-tight mb-3">
// //                       No matching items
// //                     </h3>
// //                     <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
// //                       We couldn't find anything matching your filters. Try
// //                       adjusting your search query or picking a different
// //                       category.
// //                     </p>
// //                     <button
// //                       onClick={() => {
// //                         setSearch("");
// //                         setActiveCat("All");
// //                         setTypeFilter("");
// //                       }}
// //                       className="mt-6 px-6 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-full shadow hover:bg-slate-800 transition-colors"
// //                     >
// //                       Clear Filters
// //                     </button>
// //                   </div>
// //                 ) : (
// //                   <>
// //                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 auto-rows-max">
// //                       {filteredItems.map((item, i) => (
// //                         <div
// //                           key={item._id}
// //                           className="opacity-0 animate-[fade-in-up_0.5s_ease-out_forwards] h-full"
// //                           style={{
// //                             animationDelay: `${Math.min(i * 0.05, 0.5)}s`,
// //                           }}
// //                         >
// //                           <div className="h-full bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] hover:-translate-y-2 rounded-[2rem] transition-all duration-500 group overflow-hidden">
// //                             <ItemCard item={item} onAdd={() => addToCart(item)} />
// //                           </div>
// //                         </div>
// //                       ))}
// //                     </div>

// //                     {/* Promo Card */}
// //                     <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-8 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.2)] group cursor-pointer hover:shadow-[0_30px_60px_rgba(0,0,0,0.3)] transition-all duration-500">
// //                       <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/30 rounded-full blur-[80px] group-hover:bg-indigo-400/40 transition-colors duration-700 pointer-events-none translate-x-1/2 -translate-y-1/2" />
// //                       <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
// //                         <div className="space-y-6">
// //                           <span className="inline-flex items-center gap-1.5 text-indigo-300 font-semibold text-xs tracking-widest uppercase bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-400/20 backdrop-blur-md">
// //                             <span className="material-symbols-outlined text-[14px]">
// //                               bolt
// //                             </span>
// //                             Spring Special
// //                           </span>
// //                           <h4 className="text-3xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
// //                             The Matcha <br /> Architecture.
// //                           </h4>
// //                           <p className="text-slate-400 text-sm lg:text-base leading-relaxed max-w-md">
// //                             Experience the delicate balance of our ceremonial
// //                             grade matcha, lightly sweetened and poured over oat
// //                             milk.
// //                           </p>
// //                           <button
// //                             onClick={(e) => {
// //                               e.stopPropagation();
// //                               const promoItem = items.find((item) =>
// //                                 item.name?.toLowerCase().includes("matcha")
// //                               );
// //                               if (promoItem) addToCart(promoItem);
// //                             }}
// //                             className="bg-white text-black px-8 py-3.5 rounded-full font-semibold hover:bg-indigo-50 hover:scale-105 active:scale-95 transition-all text-sm flex items-center gap-2 w-fit"
// //                           >
// //                             Add to Cart
// //                           </button>
// //                         </div>
// //                         <div className="w-full h-60 lg:h-72 rounded-[2rem] overflow-hidden shadow-2xl relative border border-white/10">
// //                           <img
// //                             className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-all duration-700"
// //                             src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7gPhXpI-UCM9lzDybVlUNFJcpIZeoKPg2zjFqbTDE0lG3Vq-D4O0Jyo4p64yFkHrGhKLzilMqV3WIJGvZl5dznj41To8UfMF6_k8hOE-NSyo1bbKSbWV92psSq_NDVs5XkHS2SxxDOZ5X69SkcstAsutAV97yNZ5NBR1GiWefH5e8zJLitjZUQlucMCRWH7G7RkhVYlkx0StJvDvHORqb3r0u5uWXsCMU15kV2r82E5GjL5NbNLkqyNlORUobLmGaWR6h5M4TR_yo"
// //                             alt="Matcha Drink"
// //                           />
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </>
// //                 )}
// //               </div>
// //             </section>

// //             {/* Desktop Cart Sidebar */}
// //             <aside
// //               ref={cartSidebarRef}
// //               className="hidden lg:block fixed right-0 lg:col-span-4 xl:col-span-3 order-1 lg:order-2"
// //             >
// //               <div className="sticky top-28 h-[calc(100vh-8.5rem)] flex flex-col bg-white/60 backdrop-blur-2xl border border-white shadow-[0_20px_50px_-10px_rgba(0,0,0,0.05)] rounded-[2.5rem] overflow-hidden transform transition-all duration-500 hover:shadow-[0_25px_60px_-10px_rgba(0,0,0,0.08)]">

// //                 {/* Cart Header */}
// //                 <div className="p-6 md:p-8 shrink-0 bg-white/40 border-b border-slate-100/50 relative z-10">
// //                   <div className="flex items-center justify-between pointer-events-none">
// //                     <div>
// //                       <h3 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">
// //                         Your Order
// //                       </h3>
// //                       <p className="text-slate-500 text-xs mt-1 font-medium">
// //                         {totalItems === 0
// //                           ? "Empty list"
// //                           : `${totalItems} items selected`}
// //                       </p>
// //                     </div>
// //                     <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-white shadow-xl">
// //                       <span className="material-symbols-outlined text-[20px]">
// //                         shopping_bag
// //                       </span>
// //                     </div>
// //                   </div>
// //                 </div>

// //                 {/* Cart Items */}
// //                 <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8 space-y-4 scrollbar-hide select-none bg-gradient-to-b from-transparent to-slate-50/30">
// //                   {cart.length === 0 ? (
// //                     <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
// //                       <div className="w-20 h-20 bg-slate-100 border border-white rounded-3xl flex items-center justify-center shadow-inner mb-5">
// //                         <span className="material-symbols-outlined text-4xl text-slate-300">
// //                           receipt_long
// //                         </span>
// //                       </div>
// //                       <p className="text-sm text-slate-500 font-medium">
// //                         Time to pick something delicious.
// //                       </p>
// //                       <button
// //                         onClick={() =>
// //                           mainRef.current?.scrollIntoView({
// //                             behavior: "smooth",
// //                           })
// //                         }
// //                         className="mt-6 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-black border-b border-slate-300 pb-1 hover:border-black transition-all"
// //                       >
// //                         Explore Menu
// //                       </button>
// //                     </div>
// //                   ) : (
// //                     cart.map((item) => (
// //                       <div
// //                         key={item._id}
// //                         className="group flex gap-4 p-3 bg-white hover:bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-[1.5rem] shadow-sm hover:shadow-md transition-all duration-300"
// //                       >
// //                         <img
// //                           src={item.image || "/api/placeholder/80/80"}
// //                           alt={item.name}
// //                           className="w-14 h-14 object-cover rounded-[1rem] shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform"
// //                           loading="lazy"
// //                         />
// //                         <div className="flex-1 min-w-0 flex flex-col justify-center">
// //                           <h4 className="font-bold text-slate-800 text-sm truncate tracking-tight">
// //                             {item.name}
// //                           </h4>
// //                           <p className="text-slate-500 text-xs mt-0.5 font-medium">
// //                             ${Number(item.price || 0).toFixed(2)}
// //                           </p>
// //                         </div>
// //                         <div className="flex flex-col items-end justify-between pr-1">
// //                           <div className="text-sm font-bold text-slate-900 tracking-tight">
// //                             $
// //                             {(
// //                               Number(item.price || 0) * (item.qty || 0)
// //                             ).toFixed(2)}
// //                           </div>
// //                           <div className="flex items-center gap-1.5 bg-slate-100 rounded-full p-0.5 mt-2 border border-slate-200/50 shadow-inner">
// //                             <button
// //                               onClick={(e) => {
// //                                 e.stopPropagation();
// //                                 updateQty(item._id, (item.qty || 0) - 1);
// //                               }}
// //                               className="w-6 h-6 bg-white shadow-sm rounded-full flex items-center justify-center text-slate-500 hover:text-black hover:bg-slate-50 transition-all active:scale-90"
// //                             >
// //                               <span className="material-symbols-outlined text-[12px]">
// //                                 remove
// //                               </span>
// //                             </button>
// //                             <span className="text-xs font-bold text-slate-800 w-3 text-center pointer-events-none">
// //                               {item.qty || 0}
// //                             </span>
// //                             <button
// //                               onClick={(e) => {
// //                                 e.stopPropagation();
// //                                 updateQty(item._id, (item.qty || 0) + 1);
// //                               }}
// //                               className="w-6 h-6 bg-white shadow-sm rounded-full flex items-center justify-center text-slate-500 hover:text-black hover:bg-slate-50 transition-all active:scale-90"
// //                             >
// //                               <span className="material-symbols-outlined text-[12px]">
// //                                 add
// //                               </span>
// //                             </button>
// //                           </div>
// //                         </div>
// //                       </div>
// //                     ))
// //                   )}
// //                 </div>

// //                 {/* Cart Footer */}
// //                 <div className="p-6 md:p-8 bg-white/80 border-t border-slate-100/80 backdrop-blur-xl shrink-0 z-10 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
// //                   <div className="space-y-3 mb-6">
// //                     <div className="flex justify-between items-center text-sm font-medium text-slate-500">
// //                       <span>Subtotal</span>
// //                       <span className="text-slate-700">
// //                         ${cartTotals.subtotal.toFixed(2)}
// //                       </span>
// //                     </div>
// //                     <div className="flex justify-between items-center text-sm font-medium text-slate-500">
// //                       <span>Tax (5%)</span>
// //                       <span className="text-slate-700">
// //                         ${cartTotals.tax.toFixed(2)}
// //                       </span>
// //                     </div>
// //                     <div className="h-px bg-slate-200/60 my-2" />
// //                     <div className="flex justify-between items-center text-2xl font-extrabold text-slate-900 tracking-tight">
// //                       <span>Total</span>
// //                       <span>${cartTotals.total.toFixed(2)}</span>
// //                     </div>
// //                   </div>
// //                   <button
// //                     onClick={() => setIsCartOpen(true)}
// //                     disabled={cart.length === 0}
// //                     className="group relative w-full bg-slate-900 hover:bg-slate-800 text-white rounded-[1.5rem] py-4 px-6 font-bold text-sm md:text-base flex items-center justify-between shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.2)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 active:scale-[0.98] overflow-hidden"
// //                   >
// //                     <span>Checkout Now</span>
// //                     <span className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform">
// //                       <span className="material-symbols-outlined text-sm">
// //                         arrow_forward
// //                       </span>
// //                     </span>
// //                   </button>
// //                 </div>
// //               </div>
// //             </aside>
// //           </div>
// //         </main>

// //         {/* Mobile Bottom Nav */}
// //         <nav className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-sm z-[100] transition-all duration-300">
// //           <div className="bg-slate-900/90 backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.4)] rounded-[2rem] px-5 py-3 flex items-center justify-between">
// //             <button className="flex flex-col items-center p-2 pt-3 text-white/50 hover:text-white transition-colors active:scale-95">
// //               <span className="material-symbols-outlined text-[24px]">
// //                 view_cozy
// //               </span>
// //               <span className="text-[10px] font-bold mt-1 tracking-widest uppercase">
// //                 Menu
// //               </span>
// //             </button>
// //             <button
// //               onClick={() => setIsCartOpen(true)}
// //               disabled={totalItems === 0}
// //               className="relative flex flex-col items-center -mt-8 bg-white text-slate-900 p-4 rounded-full border-[6px] border-[#F8FAFC] hover:scale-105 active:scale-95 transition-all shadow-[0_10px_20px_rgba(0,0,0,0.15)] group disabled:opacity-60"
// //             >
// //               <span className="material-symbols-outlined text-[24px] group-hover:rotate-12 transition-transform">
// //                 local_mall
// //               </span>
// //               {totalItems > 0 && (
// //                 <div className="absolute top-0 right-0 -mt-1 -mr-1 min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-lg border-2 border-white pointer-events-none ring-2 ring-red-500/30">
// //                   {totalItems > 99 ? "99+" : totalItems}
// //                 </div>
// //               )}
// //             </button>
// //             <button className="flex flex-col items-center p-2 pt-3 text-white/50 hover:text-white transition-colors active:scale-95">
// //               <span className="material-symbols-outlined text-[24px]">
// //                 receipt_long
// //               </span>
// //               <span className="text-[10px] font-bold mt-1 tracking-widest uppercase">
// //                 Orders
// //               </span>
// //             </button>
// //           </div>
// //         </nav>

// //         {/* Modals & Drawers */}
// //         <div className="relative z-[9999]">
// //           <CartDrawer
// //             isOpen={isCartOpen}
// //             onClose={() => setIsCartOpen(false)}
// //             cart={cart}
// //             cartTotals={cartTotals}
// //             totalItems={totalItems}
// //             updateQty={updateQty}
// //             removeFromCart={removeFromCart}
// //             onCheckout={handleCartCheckout}
// //             tables={tables}
// //           />
// //         </div>

// //         <React.Suspense fallback={null}>
// //           <PaymentModal
// //             isOpen={isPaymentModalOpen}
// //             onClose={() => setIsPaymentModalOpen(false)}
// //             totalAmount={cartTotals.total}
// //             orderData={{ customerName: "Guest", table: null }}
// //             onPaymentSuccess={handleCartCheckout}
// //           />
// //         </React.Suspense>

// //         {orderStatus === "success" && currentOrder && (
// //           <OrderSuccess
// //             order={currentOrder}
// //             onHome={() => {
// //               setOrderStatus("idle");
// //               setCurrentOrder(null);
// //             }}
// //           />
// //         )}
// //       </div>
// //     </CafeStatus>
// //   );
// // }
// import { useState, useEffect, useMemo, useCallback, useRef } from "react";
// import { itemsAPI, categoriesAPI, tablesAPI, ordersAPI } from "../services/api";
// import { toast } from "react-hot-toast";
// import React from "react";
// import Header from "../components/home/Header";
// import CategoryFilter from "../components/home/CategoryFilter";
// import ItemCard from "../components/home/ItemCard";
// const PaymentModal = React.lazy(() => import("../components/home/PaymentModal"));
// import OrderSuccess from "../components/home/OrderSuccess";
// import CafeStatus from "../components/CafeStatus/CafeStatus";
// import CartDrawer from "../components/home/CartDrawer";

// // ✅ FIX 1: Move styles OUTSIDE component so they never re-create on render
// const globalStyles = `
//   @keyframes fade-in-up {
//     from { opacity: 0; transform: translateY(20px); }
//     to { opacity: 1; transform: translateY(0); }
//   }
//   @keyframes shimmer {
//     0% { transform: translateX(-150%) skewX(-12deg); }
//     100% { transform: translateX(200%) skewX(-12deg); }
//   }
//   .scrollbar-hide::-webkit-scrollbar { display: none; }
//   .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
// `;

// // ✅ FIX 2: Static style injection — runs ONCE, never re-renders
// const styleEl = document.createElement("style");
// styleEl.textContent = globalStyles;
// if (!document.head.querySelector("#velvet-global-styles")) {
//   styleEl.id = "velvet-global-styles";
//   document.head.appendChild(styleEl);
// }

// export default function CustomerHome() {
//   // 🎯 Core Data States
//   const [items, setItems] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [tables, setTables] = useState([]);
//   const [cart, setCart] = useState([]);

//   // 🎨 UI Control States
//   const [activeCat, setActiveCat] = useState("All");
//   const [search, setSearch] = useState("");
//   const [typeFilter, setTypeFilter] = useState("");
//   const [isCartOpen, setIsCartOpen] = useState(false);

//   // 🛒 Modal & Loading States
//   const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [orderStatus, setOrderStatus] = useState("idle");
//   const [currentOrder, setCurrentOrder] = useState(null);

//   // 📍 Performance Refs
//   const mainRef = useRef(null);
//   const cartSidebarRef = useRef(null);
//   const isInitialized = useRef(false);
//   const cartLoaded = useRef(false);

//   // ✅ FIX 3: fetchInitialData defined BEFORE the useEffect that calls it,
//   // with empty deps so it never re-creates
//   const fetchInitialData = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const [itemsRes, categoriesRes, tablesRes] = await Promise.allSettled([
//         itemsAPI.getAll(),
//         categoriesAPI.getAll(),
//         tablesAPI.getAll(),
//       ]);

//       const newItems =
//         itemsRes.status === "fulfilled" ? itemsRes.value?.data || [] : [];
//       const newCategories =
//         categoriesRes.status === "fulfilled"
//           ? categoriesRes.value?.data || []
//           : [];
//       const newTables =
//         tablesRes.status === "fulfilled" ? tablesRes.value?.data || [] : [];

//       setItems(newItems);
//       setCategories([{ _id: "all", name: "All" }, ...newCategories]);
//       setTables(newTables.filter((t) => t.status === "available"));
//     } catch (err) {
//       console.error("🚨 Fetch failed:", err);
//       setError("Failed to load menu");
//       toast.error("Menu temporarily unavailable", {
//         style: { borderRadius: "16px", background: "#333", color: "#fff" },
//         id: "fetch-error",
//       });
//     } finally {
//       setLoading(false);
//     }
//   }, []); // ✅ empty deps — stable reference forever

//   // ✅ FIX 4: Single init — strict guard via ref
//   useEffect(() => {
//     if (isInitialized.current) return;
//     isInitialized.current = true;
//     fetchInitialData();
//   }, [fetchInitialData]);

//   // ✅ FIX 5: Cart load — only once after items are ready
//   useEffect(() => {
//     if (cartLoaded.current || !items.length) return;
//     cartLoaded.current = true;

//     const savedCart = localStorage.getItem("velvetCart");
//     if (!savedCart) return;

//     try {
//       const parsedCart = JSON.parse(savedCart);
//       const validCart = parsedCart.filter((cartItem) =>
//         items.some((item) => item._id === cartItem._id)
//       );
//       if (validCart.length > 0) setCart(validCart);
//     } catch {
//       localStorage.removeItem("velvetCart");
//     }
//   }, [items]);

//   // ✅ FIX 6: Cart save — debounced, only after initial cart load
//   useEffect(() => {
//     if (!cartLoaded.current) return;

//     const id = setTimeout(() => {
//       if (cart.length > 0) {
//         localStorage.setItem("velvetCart", JSON.stringify(cart));
//       } else {
//         localStorage.removeItem("velvetCart");
//       }
//     }, 500);

//     return () => clearTimeout(id);
//   }, [cart]);

//   // ✅ FIX 7: handleRetry resets init ref so fetchInitialData can run again
//   const handleRetry = useCallback(() => {
//     isInitialized.current = false;
//     cartLoaded.current = false;
//     setError(null);
//     fetchInitialData().finally(() => {
//       isInitialized.current = true;
//     });
//   }, [fetchInitialData]);

//   // ⚡ Memoized derivations
//   const filteredItems = useMemo(() => {
//     return items.filter((item) => {
//       const matchesCat =
//         activeCat === "All" ||
//         item.category?._id === activeCat ||
//         item.category?.name === activeCat;
//       const matchesType = !typeFilter || item.type === typeFilter;
//       const matchesSearch =
//         !search ||
//         item.name?.toLowerCase().includes(search.toLowerCase()) ||
//         item.description?.toLowerCase().includes(search.toLowerCase());
//       return matchesCat && matchesType && matchesSearch;
//     });
//   }, [items, activeCat, typeFilter, search]);

//   const cartTotals = useMemo(() => {
//     const subtotal = cart.reduce(
//       (acc, item) => acc + Number(item.price || 0) * (item.qty || 0),
//       0
//     );
//     const tax = subtotal * 0.05;
//     const total = subtotal + tax;
//     return {
//       subtotal: Number(subtotal.toFixed(2)),
//       tax: Number(tax.toFixed(2)),
//       total: Number(total.toFixed(2)),
//     };
//   }, [cart]);

//   const totalItems = useMemo(
//     () => cart.reduce((acc, item) => acc + (item.qty || 0), 0),
//     [cart]
//   );

//   // 🛒 Cart operations
//   const addToCart = useCallback((item) => {
//     if (!item?._id) return;
//     setCart((prev) => {
//       const existing = prev.find((i) => i._id === item._id);
//       if (existing) {
//         return prev.map((i) =>
//           i._id === item._id ? { ...i, qty: (i.qty || 0) + 1 } : i
//         );
//       }
//       return [...prev, { ...item, qty: 1 }];
//     });
//     toast.success(`Added: ${item.name}`, {
//       duration: 2000,
//       position: "bottom-right",
//       style: {
//         borderRadius: "100px",
//         background: "#0f172a",
//         color: "#fff",
//         boxShadow: "0 20px 40px -15px rgba(0,0,0,0.5)",
//       },
//       id: `add-${item._id}`,
//     });
//   }, []);

//   const updateQty = useCallback((id, newQty) => {
//     if (!id || newQty < 1) return;
//     setCart((prev) =>
//       prev
//         .map((item) =>
//           item._id === id ? { ...item, qty: Math.max(1, newQty) } : item
//         )
//         .filter((item) => (item.qty || 0) >= 1)
//     );
//   }, []);

//   const removeFromCart = useCallback((id) => {
//     if (!id) return;
//     setCart((prev) => {
//       toast.success("Item removed", {
//         duration: 2000,
//         position: "bottom-right",
//         id: `remove-${id}`,
//       });
//       return prev.filter((item) => item._id !== id);
//     });
//   }, []);

//   // ✅ FIX 8: handleCartCheckout — cartTotals ref to avoid stale closure
//   const cartTotalsRef = useRef(cartTotals);
//   useEffect(() => { cartTotalsRef.current = cartTotals; }, [cartTotals]);

//   const handleCartCheckout = useCallback(
//     async ({ customerInfo, orderType }) => {
//       if (cart.length === 0) return;
//       const totals = cartTotalsRef.current;

//       try {
//         const orderData = {
//           customerName: customerInfo.name?.trim() || "Web Guest",
//           phone: customerInfo.phone?.trim() || "0000000000",
//           table: orderType === "dine-in" ? customerInfo.table : null,
//           orderType: orderType || "takeaway",
//           items: cart.map((item) => ({
//             itemId: item._id,
//             name: item.name || "Unknown Item",
//             price: Number(item.price || 0).toFixed(2),
//             quantity: item.qty || 1,
//           })),
//           subtotal: Number(totals.subtotal).toFixed(2),
//           taxAmount: Number(totals.tax).toFixed(2),
//           totalAmount: Number(totals.total).toFixed(2),
//           paymentMethod: "cash",
//           paymentStatus: "pending",
//           status: "pending",
//         };

//         const res = await ordersAPI.create(orderData);
//         setCurrentOrder(res.data);
//         setOrderStatus("success");
//         setCart([]);
//         setIsCartOpen(false);
//         localStorage.removeItem("velvetCart");
//         toast.success("✅ Order placed successfully!", {
//           duration: 4000,
//           id: "order-success",
//         });
//       } catch (err) {
//         console.error("❌ Checkout failed:", err);
//         try {
//           await ordersAPI.create({
//             customerName: "Emergency Web Order",
//             phone: "0000000000",
//             items: cart.map((item) => ({
//               name: item.name || "Unknown",
//               quantity: item.qty || 1,
//               price: Number(item.price || 0),
//             })),
//             totalAmount: Number(cartTotalsRef.current.total),
//           });
//           setCart([]);
//           setIsCartOpen(false);
//           localStorage.removeItem("velvetCart");
//           toast.success("✅ Order saved as emergency order!", {
//             duration: 4000,
//             id: "fallback-success",
//           });
//         } catch {
//           toast.error("Server busy. Cart saved locally for staff.", {
//             duration: 5000,
//             id: "server-busy",
//           });
//           setIsCartOpen(false);
//         }
//       }
//     },
//     [cart] // ✅ only cart in deps; totals accessed via ref
//   );

//   // 🎨 Loading screen
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
//         <div className="w-full max-w-sm space-y-10 animate-pulse">
//           <div className="h-12 bg-slate-200/60 rounded-full w-3/4 mx-auto blur-[1px]" />
//           <div className="space-y-6">
//             <div className="h-64 bg-slate-200/40 rounded-[2.5rem] mx-auto shadow-[0_30px_60px_rgba(0,0,0,0.02)]" />
//             <div className="grid grid-cols-2 gap-6">
//               <div className="h-32 bg-slate-200/40 rounded-3xl" />
//               <div className="h-32 bg-slate-200/40 rounded-3xl" />
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // 🚨 Error screen
//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-8 bg-[#fafafa]">
//         <div className="max-w-md w-full space-y-8 text-center p-12 bg-white/70 backdrop-blur-2xl rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.04)] border border-white">
//           <div className="w-24 h-24 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
//             <span className="material-symbols-outlined text-5xl">
//               signal_cellular_nodata
//             </span>
//           </div>
//           <div>
//             <h2 className="text-2xl font-bold text-slate-800 tracking-tight mb-2">
//               Connection Lost
//             </h2>
//             <p className="text-slate-500 text-sm leading-relaxed">
//               We're having trouble reaching the kitchen. Please check your
//               connection and try again.
//             </p>
//           </div>
//           <button
//             onClick={handleRetry}
//             className="w-full bg-slate-900 text-white py-4 px-6 rounded-full font-medium shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 active:scale-95 transition-all text-sm"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     // ✅ FIX 9: CafeStatus must NOT re-mount on every render.
//     // If CafeStatus has polling/intervals, ensure it has cleanup.
//     // Wrap in React.memo if needed (see note below).
//     <CafeStatus>
//       <div className="min-h-screen relative bg-[#F8FAFC] text-slate-900 font-sans selection:bg-slate-200 selection:text-black overflow-x-hidden">

//         {/* Background orbs */}
//         <div className="fixed top-[-15%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-400/5 blur-[120px] pointer-events-none" />
//         <div className="fixed bottom-[-15%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-400/5 blur-[120px] pointer-events-none" />
//         <div className="fixed top-[40%] left-[20%] w-[30vw] h-[30vw] rounded-full bg-teal-400/5 blur-[100px] pointer-events-none" />

//         {/* Header */}
//         <div className="relative z-20 mix-blend-multiply">
//           <Header
//             search={search}
//             setSearch={setSearch}
//             totalItems={totalItems}
//           />
//         </div>

//         {/* Main Layout */}
//         <main
//           ref={mainRef}
//           className="pt-24 pb-32 lg:pb-16 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10 transition-all duration-500"
//         >
//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">

//             {/* Main Content */}
//             <section className="lg:col-span-8 xl:col-span-9 order-2 lg:order-1 flex flex-col gap-10 lg:gap-14">

//               {/* Hero Banner */}
//               <div className="group relative w-full aspect-[4/3] sm:aspect-video lg:aspect-[21/9] rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)] transition-all duration-700 bg-white border border-white/50">
//                 <img
//                   className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 group-hover:rotate-[1deg] transition-all duration-1000 ease-out"
//                   src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmwAmNiGAkSuDjc9Y4EcQVwHz9atlwLY0vwITnjAA2GVSIkeYRluRILLjajNUytQ_cXeeREL_VE50Aj7IorxwmWNMGVTUTbo6nWvxM1ykkQPadw4oLnU6zAPdREerr82dATYKrMhJ53dobn0DW7S7byRhPTZMMqWLDePDAlGMeqOsGI4cKuCDq5Pi4VJBFHZ0qOjgWzK5ImaFxvSrvexB2wd4mv6YWljDTyMekwKuDxl1APNPyoRvNS1gDwvrcfFdQEpY2J92bIpWA"
//                   alt="Signature Roast"
//                   loading="eager"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent flex flex-col justify-center p-8 sm:p-12 md:p-16 lg:p-20">
//                   <div className="transform translate-y-4 opacity-0 animate-[fade-in-up_0.8s_ease-out_forwards]">
//                     <span className="inline-flex items-center gap-2 text-white/90 text-xs sm:text-sm font-medium tracking-widest uppercase bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 mb-6 shadow-xl">
//                       <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
//                       New Arrivals
//                     </span>
//                     <h2 className="font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tighter text-white leading-[1.1] drop-shadow-2xl mb-6 max-w-2xl">
//                       Signature <br className="hidden sm:block" /> Blend Roast.
//                     </h2>
//                     <p className="text-white/70 max-w-md text-sm sm:text-base md:text-lg font-light leading-relaxed mb-8 md:mb-10 hidden md:block">
//                       Elevate your mornings with our meticulously crafted
//                       Ethiopian blend, featuring delicate notes of dark cocoa
//                       and sweet orange zest.
//                     </p>
//                     <button
//                       onClick={() => {
//                         const signatureItem = items.find(
//                           (item) =>
//                             item.name?.toLowerCase().includes("signature") ||
//                             item.name?.toLowerCase().includes("roast")
//                         );
//                         if (signatureItem) addToCart(signatureItem);
//                         else if (items[0]) addToCart(items[0]);
//                       }}
//                       className="group/btn relative overflow-hidden bg-white text-slate-900 px-8 sm:px-10 py-4 sm:py-5 rounded-full font-semibold text-sm sm:text-base shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 flex items-center gap-3 w-fit"
//                     >
//                       <span className="relative z-10 flex items-center gap-2">
//                         Get Started
//                         <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform">
//                           arrow_forward
//                         </span>
//                       </span>
//                       <div className="absolute inset-0 -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-slate-100/40 to-transparent skew-x-12" />
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* Filters */}
//               <div className="relative z-20">
//                 <CategoryFilter
//                   categories={categories}
//                   activeCat={activeCat}
//                   setActiveCat={setActiveCat}
//                   typeFilter={typeFilter}
//                   setTypeFilter={setTypeFilter}
//                 />
//               </div>

//               {/* Items Grid */}
//               <div className="space-y-10 lg:space-y-12">
//                 {filteredItems.length === 0 ? (
//                   <div className="text-center py-20 px-4 bg-white/40 backdrop-blur-xl rounded-[3rem] border border-white shadow-sm">
//                     <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
//                       <span className="material-symbols-outlined text-4xl text-slate-400 block animate-pulse">
//                         search_off
//                       </span>
//                     </div>
//                     <h3 className="text-2xl font-bold text-slate-800 tracking-tight mb-3">
//                       No matching items
//                     </h3>
//                     <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
//                       We couldn't find anything matching your filters. Try
//                       adjusting your search query or picking a different
//                       category.
//                     </p>
//                     <button
//                       onClick={() => {
//                         setSearch("");
//                         setActiveCat("All");
//                         setTypeFilter("");
//                       }}
//                       className="mt-6 px-6 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-full shadow hover:bg-slate-800 transition-colors"
//                     >
//                       Clear Filters
//                     </button>
//                   </div>
//                 ) : (
//                   <>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 auto-rows-max">
//                       {filteredItems.map((item, i) => (
//                         <div
//                           key={item._id}
//                           className="opacity-0 animate-[fade-in-up_0.5s_ease-out_forwards] h-full"
//                           style={{
//                             animationDelay: `${Math.min(i * 0.05, 0.5)}s`,
//                           }}
//                         >
//                           <div className="h-full bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] hover:-translate-y-2 rounded-[2rem] transition-all duration-500 group overflow-hidden">
//                             <ItemCard item={item} onAdd={() => addToCart(item)} />
//                           </div>
//                         </div>
//                       ))}
//                     </div>

//                     {/* Promo Card */}
//                     <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-8 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.2)] group cursor-pointer hover:shadow-[0_30px_60px_rgba(0,0,0,0.3)] transition-all duration-500">
//                       <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/30 rounded-full blur-[80px] group-hover:bg-indigo-400/40 transition-colors duration-700 pointer-events-none translate-x-1/2 -translate-y-1/2" />
//                       <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
//                         <div className="space-y-6">
//                           <span className="inline-flex items-center gap-1.5 text-indigo-300 font-semibold text-xs tracking-widest uppercase bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-400/20 backdrop-blur-md">
//                             <span className="material-symbols-outlined text-[14px]">
//                               bolt
//                             </span>
//                             Spring Special
//                           </span>
//                           <h4 className="text-3xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
//                             The Matcha <br /> Architecture.
//                           </h4>
//                           <p className="text-slate-400 text-sm lg:text-base leading-relaxed max-w-md">
//                             Experience the delicate balance of our ceremonial
//                             grade matcha, lightly sweetened and poured over oat
//                             milk.
//                           </p>
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               const promoItem = items.find((item) =>
//                                 item.name?.toLowerCase().includes("matcha")
//                               );
//                               if (promoItem) addToCart(promoItem);
//                             }}
//                             className="bg-white text-black px-8 py-3.5 rounded-full font-semibold hover:bg-indigo-50 hover:scale-105 active:scale-95 transition-all text-sm flex items-center gap-2 w-fit"
//                           >
//                             Add to Cart
//                           </button>
//                         </div>
//                         <div className="w-full h-60 lg:h-72 rounded-[2rem] overflow-hidden shadow-2xl relative border border-white/10">
//                           <img
//                             className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-all duration-700"
//                             src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7gPhXpI-UCM9lzDybVlUNFJcpIZeoKPg2zjFqbTDE0lG3Vq-D4O0Jyo4p64yFkHrGhKLzilMqV3WIJGvZl5dznj41To8UfMF6_k8hOE-NSyo1bbKSbWV92psSq_NDVs5XkHS2SxxDOZ5X69SkcstAsutAV97yNZ5NBR1GiWefH5e8zJLitjZUQlucMCRWH7G7RkhVYlkx0StJvDvHORqb3r0u5uWXsCMU15kV2r82E5GjL5NbNLkqyNlORUobLmGaWR6h5M4TR_yo"
//                             alt="Matcha Drink"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </section>

//             {/* Desktop Cart Sidebar */}
//             <aside
//               ref={cartSidebarRef}
//               className="hidden lg:block fixed right-0 lg:col-span-4 xl:col-span-3 order-1 lg:order-2"
//             >
//               <div className="sticky top-28 h-[calc(100vh-8.5rem)] flex flex-col bg-white/60 backdrop-blur-2xl border border-white shadow-[0_20px_50px_-10px_rgba(0,0,0,0.05)] rounded-[2.5rem] overflow-hidden transform transition-all duration-500 hover:shadow-[0_25px_60px_-10px_rgba(0,0,0,0.08)]">

//                 {/* Cart Header */}
//                 <div className="p-6 md:p-8 shrink-0 bg-white/40 border-b border-slate-100/50 relative z-10">
//                   <div className="flex items-center justify-between pointer-events-none">
//                     <div>
//                       <h3 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">
//                         Your Order
//                       </h3>
//                       <p className="text-slate-500 text-xs mt-1 font-medium">
//                         {totalItems === 0
//                           ? "Empty list"
//                           : `${totalItems} items selected`}
//                       </p>
//                     </div>
//                     <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-white shadow-xl">
//                       <span className="material-symbols-outlined text-[20px]">
//                         shopping_bag
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Cart Items */}
//                 <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8 space-y-4 scrollbar-hide select-none bg-gradient-to-b from-transparent to-slate-50/30">
//                   {cart.length === 0 ? (
//                     <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
//                       <div className="w-20 h-20 bg-slate-100 border border-white rounded-3xl flex items-center justify-center shadow-inner mb-5">
//                         <span className="material-symbols-outlined text-4xl text-slate-300">
//                           receipt_long
//                         </span>
//                       </div>
//                       <p className="text-sm text-slate-500 font-medium">
//                         Time to pick something delicious.
//                       </p>
//                       <button
//                         onClick={() =>
//                           mainRef.current?.scrollIntoView({
//                             behavior: "smooth",
//                           })
//                         }
//                         className="mt-6 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-black border-b border-slate-300 pb-1 hover:border-black transition-all"
//                       >
//                         Explore Menu
//                       </button>
//                     </div>
//                   ) : (
//                     cart.map((item) => (
//                       <div
//                         key={item._id}
//                         className="group flex gap-4 p-3 bg-white hover:bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-[1.5rem] shadow-sm hover:shadow-md transition-all duration-300"
//                       >
//                         <img
//                           src={item.image || "/api/placeholder/80/80"}
//                           alt={item.name}
//                           className="w-14 h-14 object-cover rounded-[1rem] shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform"
//                           loading="lazy"
//                         />
//                         <div className="flex-1 min-w-0 flex flex-col justify-center">
//                           <h4 className="font-bold text-slate-800 text-sm truncate tracking-tight">
//                             {item.name}
//                           </h4>
//                           <p className="text-slate-500 text-xs mt-0.5 font-medium">
//                             ${Number(item.price || 0).toFixed(2)}
//                           </p>
//                         </div>
//                         <div className="flex flex-col items-end justify-between pr-1">
//                           <div className="text-sm font-bold text-slate-900 tracking-tight">
//                             $
//                             {(
//                               Number(item.price || 0) * (item.qty || 0)
//                             ).toFixed(2)}
//                           </div>
//                           <div className="flex items-center gap-1.5 bg-slate-100 rounded-full p-0.5 mt-2 border border-slate-200/50 shadow-inner">
//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 updateQty(item._id, (item.qty || 0) - 1);
//                               }}
//                               className="w-6 h-6 bg-white shadow-sm rounded-full flex items-center justify-center text-slate-500 hover:text-black hover:bg-slate-50 transition-all active:scale-90"
//                             >
//                               <span className="material-symbols-outlined text-[12px]">
//                                 remove
//                               </span>
//                             </button>
//                             <span className="text-xs font-bold text-slate-800 w-3 text-center pointer-events-none">
//                               {item.qty || 0}
//                             </span>
//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 updateQty(item._id, (item.qty || 0) + 1);
//                               }}
//                               className="w-6 h-6 bg-white shadow-sm rounded-full flex items-center justify-center text-slate-500 hover:text-black hover:bg-slate-50 transition-all active:scale-90"
//                             >
//                               <span className="material-symbols-outlined text-[12px]">
//                                 add
//                               </span>
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     ))
//                   )}
//                 </div>

//                 {/* Cart Footer */}
//                 <div className="p-6 md:p-8 bg-white/80 border-t border-slate-100/80 backdrop-blur-xl shrink-0 z-10 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
//                   <div className="space-y-3 mb-6">
//                     <div className="flex justify-between items-center text-sm font-medium text-slate-500">
//                       <span>Subtotal</span>
//                       <span className="text-slate-700">
//                         ${cartTotals.subtotal.toFixed(2)}
//                       </span>
//                     </div>
//                     <div className="flex justify-between items-center text-sm font-medium text-slate-500">
//                       <span>Tax (5%)</span>
//                       <span className="text-slate-700">
//                         ${cartTotals.tax.toFixed(2)}
//                       </span>
//                     </div>
//                     <div className="h-px bg-slate-200/60 my-2" />
//                     <div className="flex justify-between items-center text-2xl font-extrabold text-slate-900 tracking-tight">
//                       <span>Total</span>
//                       <span>${cartTotals.total.toFixed(2)}</span>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => setIsCartOpen(true)}
//                     disabled={cart.length === 0}
//                     className="group relative w-full bg-slate-900 hover:bg-slate-800 text-white rounded-[1.5rem] py-4 px-6 font-bold text-sm md:text-base flex items-center justify-between shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.2)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 active:scale-[0.98] overflow-hidden"
//                   >
//                     <span>Checkout Now</span>
//                     <span className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform">
//                       <span className="material-symbols-outlined text-sm">
//                         arrow_forward
//                       </span>
//                     </span>
//                   </button>
//                 </div>
//               </div>
//             </aside>
//           </div>
//         </main>

//         {/* Mobile Bottom Nav */}
//         <nav className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-sm z-[100] transition-all duration-300">
//           <div className="bg-slate-900/90 backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.4)] rounded-[2rem] px-5 py-3 flex items-center justify-between">
//             <button className="flex flex-col items-center p-2 pt-3 text-white/50 hover:text-white transition-colors active:scale-95">
//               <span className="material-symbols-outlined text-[24px]">
//                 view_cozy
//               </span>
//               <span className="text-[10px] font-bold mt-1 tracking-widest uppercase">
//                 Menu
//               </span>
//             </button>
//             <button
//               onClick={() => setIsCartOpen(true)}
//               disabled={totalItems === 0}
//               className="relative flex flex-col items-center -mt-8 bg-white text-slate-900 p-4 rounded-full border-[6px] border-[#F8FAFC] hover:scale-105 active:scale-95 transition-all shadow-[0_10px_20px_rgba(0,0,0,0.15)] group disabled:opacity-60"
//             >
//               <span className="material-symbols-outlined text-[24px] group-hover:rotate-12 transition-transform">
//                 local_mall
//               </span>
//               {totalItems > 0 && (
//                 <div className="absolute top-0 right-0 -mt-1 -mr-1 min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-lg border-2 border-white pointer-events-none ring-2 ring-red-500/30">
//                   {totalItems > 99 ? "99+" : totalItems}
//                 </div>
//               )}
//             </button>
//             <button className="flex flex-col items-center p-2 pt-3 text-white/50 hover:text-white transition-colors active:scale-95">
//               <span className="material-symbols-outlined text-[24px]">
//                 receipt_long
//               </span>
//               <span className="text-[10px] font-bold mt-1 tracking-widest uppercase">
//                 Orders
//               </span>
//             </button>
//           </div>
//         </nav>

//         {/* Modals & Drawers */}
//         <div className="relative z-[9999]">
//           <CartDrawer
//             isOpen={isCartOpen}
//             onClose={() => setIsCartOpen(false)}
//             cart={cart}
//             cartTotals={cartTotals}
//             totalItems={totalItems}
//             updateQty={updateQty}
//             removeFromCart={removeFromCart}
//             onCheckout={handleCartCheckout}
//             tables={tables}
//           />
//         </div>

//         <React.Suspense fallback={null}>
//           <PaymentModal
//             isOpen={isPaymentModalOpen}
//             onClose={() => setIsPaymentModalOpen(false)}
//             totalAmount={cartTotals.total}
//             orderData={{ customerName: "Guest", table: null }}
//             onPaymentSuccess={handleCartCheckout}
//           />
//         </React.Suspense>

//         {orderStatus === "success" && currentOrder && (
//           <OrderSuccess
//             order={currentOrder}
//             onHome={() => {
//               setOrderStatus("idle");
//               setCurrentOrder(null);
//             }}
//           />
//         )}
//       </div>
//     </CafeStatus>
//   );
// }
import { useState, useEffect, useMemo } from "react";
import { itemsAPI, categoriesAPI, tablesAPI, ordersAPI } from "../services/api";
import { toast } from "react-hot-toast";

import Header from "../components/home/Header";
import BannerSlider from "../components/home/BannerSlider";
import PopularSlider from "../components/home/PopularSlider";
import CategoryFilter from "../components/home/CategoryFilter";
import ItemCard from "../components/home/ItemCard";
import CartDrawer from "../components/home/CartDrawer";
import CheckoutForm from "../components/home/CheckoutForm";
import PaymentModal from "../components/home/PaymentModal";
import OrderSuccess from "../components/home/OrderSuccess";

import { ShoppingCart } from "lucide-react";

export default function CustomerHome() {
  // ---------------- DATA STATE ----------------
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tables, setTables] = useState([]);

  // ---------------- CART STATE ----------------
  const [cart, setCart] = useState([]);

  // ---------------- UI STATE ----------------
  const [activeCat, setActiveCat] = useState("All");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderStatus, setOrderStatus] = useState("idle");

  // ---------------- CHECKOUT STATE ----------------
  const [customerInfo, setCustomerInfo] = useState({ name: "", phone: "", table: "" });
  const [orderType, setOrderType] = useState("dine-in");
  const [currentOrder, setCurrentOrder] = useState(null);

  // ---------------- LOAD CART FROM STORAGE ----------------
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // ---------------- SAVE CART ----------------
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ---------------- FETCH DATA ----------------
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [itemsRes, catRes, tableRes] = await Promise.all([
        itemsAPI.getAll(),
        categoriesAPI.getAll(),
        tablesAPI.getAll(),
      ]);

      setItems(itemsRes.data || []);
      setCategories(catRes.data || []);
      setTables((tableRes.data || []).filter((t) => t.status === "available"));
    } catch (err) {
      console.error(err);
      setError("Failed to load menu");
      toast.error("Failed to load menu data");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- FILTER ITEMS ----------------
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCat = activeCat === "All" || item.category?._id === activeCat;
      const matchesType = !typeFilter || item.type === typeFilter;
      const matchesSearch = !search || item.name?.toLowerCase().includes(search.toLowerCase());
      return matchesCat && matchesType && matchesSearch;
    });
  }, [items, activeCat, typeFilter, search]);

  // ---------------- CART TOTALS ----------------
  const cartTotals = useMemo(() => {
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    const taxRate = 0.05;
    const tax = subtotal * taxRate;
    return { subtotal, tax, total: subtotal + tax };
  }, [cart]);

  const totalItems = useMemo(() => cart.reduce((acc, item) => acc + item.qty, 0), [cart]);

  // ---------------- CART ACTIONS ----------------
  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i._id === item._id);
      if (existing) return prev.map((i) => (i._id === item._id ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { ...item, qty: 1 }];
    });
    toast.success(`${item.name} added to cart`);
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => (item._id === id ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((item) => item._id !== id));

  // ---------------- PLACE ORDER ----------------
  const handlePlaceOrder = async () => {
    if (orderStatus === "loading") return;
    if (!customerInfo.name.trim()) return toast.error("Please enter your name");
    if (orderType === "dine-in" && !customerInfo.table) return toast.error("Please select a table");
    if (cart.length === 0) return toast.error("Your cart is empty");

    setOrderStatus("loading");

    try {
      const orderData = {
        customerName: customerInfo.name.trim(),
        phone: customerInfo.phone.trim(),
        table: orderType === "dine-in" ? customerInfo.table : null,
        orderType,
        items: cart.map((item) => ({ item: item._id, name: item.name, price: item.price, quantity: item.qty })),
        subtotal: cartTotals.subtotal,
        taxAmount: cartTotals.tax,
        totalAmount: cartTotals.total,
        paymentMethod: "cash",
        paymentStatus: "pending",
      };

      const response = await ordersAPI.create(orderData);
      setCurrentOrder(response.data || response);
      setOrderStatus("success");
      setCart([]);
      setCustomerInfo({ name: "", phone: "", table: "" });
      setIsCartOpen(false);
      toast.success("Order placed successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order");
      setOrderStatus("idle");
    }
  };

  // ---------------- LOADING UI ----------------
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );

  // ---------------- ERROR UI ----------------
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pb-32 font-sans text-gray-800">
      <Header search={search} setSearch={setSearch} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BannerSlider />

        <PopularSlider items={items} />

        {/* Sticky Category Filter */}
        <div className="sticky top-16 z-30 bg-gray-50 py-2 shadow-sm">
          <CategoryFilter
            categories={categories}
            activeCat={activeCat}
            setActiveCat={setActiveCat}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
          />
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 col-span-full">
              <p className="text-lg text-gray-500">No items found</p>
              <p className="text-sm text-gray-400">Try changing category or search</p>
            </div>
          ) : (
            filteredItems.map((item) => <ItemCard key={item._id} item={item} onAdd={addToCart} />)
          )}
        </div>
      </main>

      {/* Bottom Cart Bar */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-md z-40">
          <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-xs text-gray-500">Total (incl GST)</p>
              <p className="text-xl font-bold">₹{cartTotals.total.toFixed(2)}</p>
            </div>
            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-700 flex items-center gap-2 cursor-pointer transition-transform transform hover:scale-105"
            >
              <ShoppingCart size={20} />
              View Cart ({totalItems})
            </button>
          </div>
        </div>
      )}

      {/* CART DRAWER */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        cartTotals={cartTotals}
        updateQty={updateQty}
        removeFromCart={removeFromCart}
        onCheckout={() => setIsPaymentOpen(true)}
      />

      {/* PAYMENT MODAL */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        totalAmount={cartTotals.total}
        orderData={{ ...customerInfo, orderType }}
        onPaymentSuccess={() => {
          setIsPaymentOpen(false);
          handlePlaceOrder();
        }}
      />

      {/* CHECKOUT FORM */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsCartOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl shadow-xl p-6 animate-slide-up">
            <CheckoutForm
              customerInfo={customerInfo}
              setCustomerInfo={setCustomerInfo}
              tables={tables}
              orderType={orderType}
              setOrderType={setOrderType}
              onSubmit={() => setIsPaymentOpen(true)}
              loading={orderStatus === "loading"}
            />
          </div>
        </div>
      )}

      {/* ORDER SUCCESS */}
      {orderStatus === "success" && currentOrder && (
        <OrderSuccess
          order={currentOrder}
          onHome={() => {
            setOrderStatus("idle");
            setCurrentOrder(null);
          }}
        />
      )}
    </div>
  );
}



          