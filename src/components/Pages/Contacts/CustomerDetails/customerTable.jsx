import React, { useState } from "react";

const CustomerTable = ({Customers}) => {
      const [editRowId, setEditRowId] = useState(null);
  
  console.log("customertable data",Customers)
	return (
		<>
			<div className="mt-5 rounded border border-[#c9c9cd]">
				<div className="max-h-[350px] overflow-y-auto">
					<table className="w-full">
						<thead className="sticky top-0 bg-[#f8f8f8]">
							<tr className="text-left">
								<th className="p-2 text-center text-sm font-semibold w-[5%]">
									S.No
								</th>
								<th className="p-2 text-center text-sm font-semibold w-[20%]">
									Customer Name
								</th>
								<th className="p-2 text-center text-sm font-semibold w-[17%]">
									Mobile No
								</th>
								<th className="p-2 text-center text-sm font-semibold w-[20%]">
									Email
								</th>
								<th className="p-2 text-center text-sm font-semibold w-[15%]">
									Address
								</th>
								<th className="p-2 text-center text-sm font-semibold w-[10%]">
									Opening Balance
								</th>
								<th className="p-2 text-center text-sm font-semibold w-[13%]">
									Balance Amount
								</th>
							</tr>
						</thead>
						<tbody>
							{Customers.length > 0 ? (
								Customers.map((customer, index) => (
                  <>{console.log("mapping functions",customer)}
									<tr
										className="text-center bg-white border-b"
										key={customer.Customer_id}>
										<td className="p-2 text-sm w-[5%]">{index + 1}</td>
										<td className="p-2 text-sm w-[20%]">
											{customer.customer_name}
										</td>
										<td className="p-2 text-sm w-[17%]">
											{customer.Mobile_no}
										</td>
										<td className="p-2 text-sm w-[20%]">{customer.email}</td>
										<td className="p-2 text-sm break-words whitespace-normal w-[15%]">
											{customer.address}
										</td>
										<td className="p-2 text-sm w-[10%]">
											{customer.opening_balance.toLocaleString()}
										</td>
										<td className="p-2 text-sm w-[13%]">
											{customer.balance_amount !== null
												? customer.balance_amount.toLocaleString()
												: "N/A"}
										</td>
									</tr></>
								))
							) : (
								<tr>
									<td
										colSpan="7"
										className="p-4 text-center text-sm text-[#202020]">
										Your table is ready! Start adding data to see it here.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
};
export default CustomerTable;
