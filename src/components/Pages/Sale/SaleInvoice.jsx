import React, { forwardRef, useRef } from "react";
import { useReactToPrint } from "react-to-print";

const SaleInvoice = ({ invoice, onClose }) => {
  const invoiceRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
  });

  return (
    <div className="print-modal">
      <div className="modal-content">
        <button onClick={onClose}>Close</button>
        <button onClick={handlePrint}>Print</button>
        <div ref={invoiceRef} className="invoice">
          <h2>Invoice No: {invoice.invoice_no}</h2>
          <p>Billing To: {invoice.billing_to}</p>
          <p>Amount: {invoice.amount}</p>
          <p>Status: {invoice.status}</p>
        </div>
      </div>
    </div>
  );
};

export default SaleInvoice;
