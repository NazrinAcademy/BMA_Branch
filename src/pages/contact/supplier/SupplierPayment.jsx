import React from 'react'

const SupplierPayment = ({onClose}) => {
  return (
    <>
     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 pl-11 pt-11">
      <div className="bg-white  rounded-lg shadow-md w-full max-w-3xl">
      
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl text-neutral-800 font-jakarta font-semibold">Payment (Purchase)</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-3xl">
            &times;
          </button>
        </div>

      
        <div className="p-4 space-y-4">
        
          <div className="grid grid-cols-3  text-gray-800 text-sm ">
            
            <div>
              <h3 className="font-semibold text-lg font-jakarta text-neutral-800 ">Supplier Details</h3>
              <p className='text-zinc-500 font-jakarta font-normal text-base'>Name: <span className="font-normal text-neutral-800 font-jakarta text-base">Zupee Electronic</span></p>
              <p className='text-zinc-500 font-jakarta font-normal text-base'>Mobile No: <span className="font-normal text-neutral-800 font-jakarta text-base">6548962509</span></p>
              <p className='text-zinc-500 font-jakarta font-normal text-base'>GST No: <span className="font-normal text-neutral-800 font-jakarta text-base">23AD24FR83KS</span></p>
              <p className=" text-zinc-500 font-jakarta font-normal text-base mt-4">Total Amount: <span className="font-normal text-neutral-800 font-jakarta text-base">₹ 4000</span></p>
              <p className='text-zinc-500 font-jakarta font-normal text-base'> Payment Due: <span className="font-normal text-neutral-800 font-jakarta text-base">₹ 3000</span></p>
            </div>

      
            <div>
              <h3 className="font-semibold text-lg font-jakarta text-neutral-800">Supplier Address</h3>
              <p className='text-zinc-500 font-jakarta font-normal text-base'>2/23-4 PSS Complex,</p>
              <p className='text-zinc-500 font-jakarta font-normal text-base'>Tenkasi - 627 811</p>
              <p className='text-zinc-500 font-jakarta font-normal text-base'>Tamil Nadu</p>
            </div>

          
            <div>
              <h3 className="font-semibold text-lg font-jakarta text-neutral-800">Purchase Details</h3>
              <p className='text-zinc-500 font-jakarta font-normal text-base'>Purchase Date: <span className="font-normal text-neutral-800 font-jakarta text-base">14/02/2025</span></p>
              <p className='text-zinc-500 font-jakarta font-normal text-base'>Purchase Status: <span className="font-normal text-neutral-800 font-jakarta text-base">Received</span></p>
              <p className='text-zinc-500 font-jakarta font-normal text-base'>Payment Status: <span className="font-normal text-neutral-800 font-jakarta text-base">Duo</span></p>
            </div>
          </div>

          
          <div className="text-right">
            <button className="px-4 py-2 border border-violet-800 font-jakarta rounded-md  text-violet-800 text-base font-bold">
              Add Payment
            </button>
          </div>

          
          <div className="border rounded-md overflow-hidden">
            <table className="w-full text-gray-700 text-sm">
              <thead className="bg-[#f3f3f3] border-b">
                <tr>
                  <th className="px-4 py-2 text-center ">Date</th>
                  <th className="px-4 py-2  text-center">Invoice No</th>
                  <th className="px-4 py-2  text-center">Payment Method</th>
                  <th className="px-4 py-2 text-center">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-2 text-center">12/03/2025</td>
                  <td className="px-4 py-2 text-center">025</td>
                  <td className="px-4 py-2 text-center">Cash</td>
                  <td className="px-4 py-2 text-center font-medium">₹ 3000</td>
                </tr>
              </tbody>
            </table>
          </div>

          
          <div className="flex justify-end">
            <button className="px-12 py-2  bg-violet-800 rounded text-white text-base font-bold font-jakarta">
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default SupplierPayment;