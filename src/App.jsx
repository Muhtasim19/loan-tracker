import React, { useState, useEffect } from "react";


export default function App() {
 const [loans, setLoans] = useState({});
 const [amount, setAmount] = useState("");
 const [account, setAccount] = useState("");
 const [purpose, setPurpose] = useState("");
 const [repayments, setRepayments] = useState({});


 // Load loans from local storage
 useEffect(() => {
   const storedLoans = localStorage.getItem("loans");
   if (storedLoans) {
     setLoans(JSON.parse(storedLoans));
   }
 }, []);


 // Save loans to local storage
 useEffect(() => {
   localStorage.setItem("loans", JSON.stringify(loans));
 }, [loans]);


 // Function to add a loan
 const addLoan = () => {
   if (!amount || !account || !purpose) {
     alert("All fields are required!");
     return;
   }
   if (!/^\d+(\.\d+)?$/.test(amount)) {
     alert("Amount must be a valid number.");
     return;
   }


   const bankName = account.trim().toUpperCase(); // Normalize bank name
   const newLoans = { ...loans };


   if (newLoans[bankName]) {
     newLoans[bankName].total += parseFloat(amount);
     newLoans[bankName].transactions.push({ amount: parseFloat(amount), purpose });
   } else {
     newLoans[bankName] = {
       total: parseFloat(amount),
       repaid: 0,
       transactions: [{ amount: parseFloat(amount), purpose }],
     };
   }


   setLoans(newLoans);
   setAmount("");
   setAccount("");
   setPurpose("");
 };


 // Function to add repayment
 const addRepayment = (bank) => {
   if (!repayments[bank] || !/^\d+(\.\d+)?$/.test(repayments[bank])) {
     alert("Enter a valid repayment amount.");
     return;
   }


   const newLoans = { ...loans };
   newLoans[bank].repaid += parseFloat(repayments[bank]);


   setLoans(newLoans);
   setRepayments({ ...repayments, [bank]: "" });
 };


 // Function to delete a bank's loan record
 const deleteLoan = (bank) => {
   const newLoans = { ...loans };
   delete newLoans[bank];
   setLoans(newLoans);
 };


 return (
   <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-900 to-gray-700 p-6">
     <h1 className="text-4xl font-extrabold text-white mb-6">💰 Loan Tracker</h1>


     {/* Loan Input Form */}
     <div className="bg-white p-6 shadow-2xl rounded-2xl w-full max-w-lg">
       <h2 className="text-2xl font-semibold mb-4 text-gray-800">Add a Loan</h2>
       <input
         type="text"
         placeholder="Bank Name"
         className="border p-3 rounded-lg w-full mb-3 text-lg"
         value={account}
         onChange={(e) => setAccount(e.target.value)}
       />
       <input
         type="number"
         placeholder="Loan Amount"
         className="border p-3 rounded-lg w-full mb-3 text-lg"
         value={amount}
         onChange={(e) => setAmount(e.target.value)}
       />
       <input
         type="text"
         placeholder="Purpose (e.g., Land Purchase)"
         className="border p-3 rounded-lg w-full mb-3 text-lg"
         value={purpose}
         onChange={(e) => setPurpose(e.target.value)}
       />
       <button
         onClick={addLoan}
         className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl w-full font-semibold transition duration-300"
       >
         ➕ Add Loan
       </button>
     </div>


     {/* Loan List */}
     <div className="mt-8 w-full max-w-lg">
       {Object.keys(loans).length === 0 ? (
         <p className="text-white text-center text-lg">No loans recorded.</p>
       ) : (
         Object.keys(loans).map((bank) => (
           <div key={bank} className="bg-white p-6 shadow-lg rounded-xl mb-6 border-l-8 border-blue-500">
             <h2 className="text-xl font-bold text-gray-900">{bank}</h2>
             <p className="text-lg text-gray-600">Total Loaned: <span className="text-blue-600 font-bold">${loans[bank].total.toFixed(2)}</span></p>
             <p className="text-lg text-gray-600">Repaid: <span className="text-green-600 font-bold">${loans[bank].repaid.toFixed(2)}</span></p>
             <p className="text-lg text-gray-600">Remaining: <span className="text-red-600 font-bold">${(loans[bank].total - loans[bank].repaid).toFixed(2)}</span></p>


             {/* Loan Details */}
             <h3 className="mt-4 text-gray-800 font-semibold">Loan Breakdown:</h3>
             <ul className="list-disc pl-5 text-gray-700">
               {loans[bank].transactions.map((loan, index) => (
                 <li key={index} className="text-md">
                   💵 ${loan.amount.toFixed(2)} - {loan.purpose}
                 </li>
               ))}
             </ul>


             {/* Repayment Input */}
             <div className="mt-4">
               <input
                 type="number"
                 placeholder="Repayment Amount"
                 className="border p-3 rounded-lg w-full text-lg"
                 value={repayments[bank] || ""}
                 onChange={(e) =>
                   setRepayments({ ...repayments, [bank]: e.target.value })
                 }
               />
               <div className="flex gap-2 mt-4">
                 <button
                   onClick={() => addRepayment(bank)}
                   className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg flex-1 font-semibold transition duration-300"
                 >
                   💸 Repay
                 </button>
                 <button
                   onClick={() => deleteLoan(bank)}
                   className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg flex-1 font-semibold transition duration-300"
                 >
                   ❌ Delete
                 </button>
               </div>
             </div>
           </div>
         ))
       )}
     </div>
   </div>
 );
}



