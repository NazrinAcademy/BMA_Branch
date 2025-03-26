import React, { useState } from "react";

const PurchaseStatusModal = ({ invoice, closeModal, updatePurchaseStatus }) => {
  const [selectedStatus, setSelectedStatus] = useState(invoice.purchase_status);

  const handleSaveStatus = (e) => {
    e.preventDefault();
    updatePurchaseStatus(invoice.id, selectedStatus);
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex pt-5 justify-center bg-black bg-opacity-50">
      <div className="bg-white overflow-hidden rounded-lg w-[692px] h-56 px-7 py-6">
        <h3 className="text-xl font-semibold text-center text-gray-700 mb-4">
          Update Purchase Status
        </h3>
        <form onSubmit={handleSaveStatus}>
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="peer w-full h-11 px-2 text-sm border border-gray-300 focus:outline-none focus:border-[#593FA9] rounded bg-white"
              required
            >
              <option value="Pending">Pending</option>
              <option value="Ordered">Ordered</option>
              <option value="Received">Received</option>
            </select>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={closeModal} className="border border-purpleCustom font-semibold px-12 py-2 rounded">
              Cancel
            </button>
            <button type="submit" className="bg-purpleCustom text-white font-semibold px-14 py-2 rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaseStatusModal;
