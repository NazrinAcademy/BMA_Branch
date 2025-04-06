import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChevronRight, ChevronLeft } from "lucide-react";
import {
	saveOrganizedDetails,
	savePersonalDetails,
} from "../../apiService/PGapi";
import { states } from "../Utils/States";
import successImage from "../../assets/success.png";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Registration = () => {
	const [activeForm, setActiveForm] = useState("personal");
	const navigate = useNavigate();
	const [personalData, setPersonalData] = useState({
		company_name: "",
		mailing_name: "",
		country: "",
		state: "",
		address_line1: "",
		address_line2: "",
		pin_code: "",
		mobile_no: "",
		phone_no: "",
		gst_no: "",
		email_id: "",
		website: "",
	});

	const [organizedData, setOrganizedData] = useState({
		financial_year_begin: "",
		books_beginning_from: "",
		password: "",
		repeat_password: "",
		base_currency_symbol: "",
		suffix_symbol_to_amount: false,
		show_amount_of_millions: false,
		decimal_value: "",
		formal_name: "",
		add_space_between_amount_and_symbol: false,
		no_of_decimal_places: "",
		decimal_precision: "",
	});

	const {userDetails}=useSelector((state)=>(state.auth))


	const [successMessageVisible, setSuccessMessageVisible] = useState(false);

	const [filteredStates, setFilteredStates] = useState([]);
	const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
	const [highlightedIndex, setHighlightedIndex] = useState(-1);

	// validate for personal detail form

	const validatePersonalFields = () => {
		const allFieldsEmpty = Object.values(personalData).every(
			(value) => typeof value === "string" && !value.trim()
		);

		if (allFieldsEmpty) {
			toast.error("All fields are required", {
				style: {
					backgroundColor: "#F8D7DA",
					color: "#842029",
				},
			});
			return false;
		}

		let firstError = null;

		Object.entries(personalData).forEach(([key, value]) => {
			if (typeof value === "string" && !value.trim() && !firstError) {
				firstError = `${
					key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")
				} is required`;
			}
		});

		if (firstError) {
			toast.error(firstError, {
				style: {
					backgroundColor: "#F8D7DA",
					color: "#842029",
				},
			});
			return false;
		}

		return true;
	};

	// validate for Organized detail form

	const validateOrganizedFields = () => {
		// Check if all fields are empty (null, undefined, or empty string)
		const allFieldsEmpty = Object.values(organizedData).every(
			(value) =>
				(typeof value === "string" && value.trim() === "") ||
				(typeof value === "number" && isNaN(value)) // Handle invalid numbers (NaN)
		);

		if (allFieldsEmpty) {
			toast.error("All fields are required", {
				style: {
					backgroundColor: "#F8D7DA",
					color: "#842029",
				},
			});
			return false;
		}

		let firstError = null;

		// Validate each field
		Object.entries(organizedData).forEach(([key, value]) => {
			if (
				((typeof value === "string" && value.trim() === "") ||
					(typeof value === "number" && isNaN(value))) &&
				!firstError
			) {
				firstError = `${
					key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")
				} is required`;
			}
		});

		if (firstError) {
			toast.error(firstError, {
				style: {
					backgroundColor: "#F8D7DA",
					color: "#842029",
				},
			});
			return false;
		}

		return true;
	};

	// handle Input Change

	const handleInputChange = (e) => {
		const { id, value } = e.target;

		if (activeForm === "personal") {
			setPersonalData((prevData) => {
				let updatedData = { ...prevData, [id]: value };

				// Auto-fill mailing_name only if it's empty or was previously the same as company_name
				if (
					id === "company_name" &&
					(!prevData.mailing_name ||
						prevData.mailing_name === prevData.company_name)
				) {
					updatedData.mailing_name = value;
				}

				return updatedData;
			});

			// State dropdown functionality
			if (id === "state") {
				setFilteredStates(
					states.filter((s) => s.toLowerCase().includes(value.toLowerCase()))
				);
				setStateDropdownOpen(true);
				setHighlightedIndex(-1);
			}
		} else if (activeForm === "organized") {
			if (
				id === "suffix_symbol_to_amount" ||
				id === "add_space_between_amount_and_symbol" ||
				id === "show_amount_of_millions"
			) {
				setOrganizedData((prevData) => ({
					...prevData,
					[id]: e.target.checked ? true : false,
				}));
			} else {
				setOrganizedData((prevData) => ({
					...prevData,
					[id]: value,
				}));
			}
		}
	};

	useEffect(() => {
		if (successMessageVisible) {
			const timer = setTimeout(() => setSuccessMessageVisible(false), 3000);
			return () => clearTimeout(timer);
		}
	}, [successMessageVisible]);

	// personal details:

	const company_nameRef = useRef();
	const mailing_nameRef = useRef();
	const countryRef = useRef();
	const stateRef = useRef();
	const address_line1Ref = useRef();
	const address_line2Ref = useRef();
	const pin_codeRef = useRef();
	const mobile_noRef = useRef();
	const phone_noRef = useRef();
	const gst_noRef = useRef();
	const email_idRef = useRef();
	const websiteRef = useRef();

	// organized details

	const financial_year_beginRef = useRef();
	const books_beginning_fromRef = useRef();
	const passwordRef = useRef();
	const repeat_passwordRef = useRef();
	const base_currency_symbolRef = useRef();
	const suffix_symbol_to_amountRef = useRef();
	const show_amount_of_millionsRef = useRef();
	const decimal_valueRef = useRef();
	const formal_nameRef = useRef();
	const add_space_between_amount_and_symbolRef = useRef();
	const no_of_decimal_placesRef = useRef();
	const decimal_precisionRef = useRef();

	// handle key Down:
	const handleKeyDown = (e, nextRef, prevRef) => {
		if (e.key === "Enter" && nextRef?.current) {
			e.preventDefault();
			nextRef.current.focus();
		}

		if (e.key === "Backspace" && e.target.value === "" && prevRef?.current) {
			e.preventDefault();
			prevRef.current.focus();
		}
	};

	// Handle State Selection
	const handleStateSelection = (state) => {
		setPersonalData((prev) => ({ ...prev, state }));
		setStateDropdownOpen(false);
	};

	// Handle Key Down in State Dropdown
	const handleKeyDownState = (e) => {
		if (e.key === "ArrowDown") {
			setHighlightedIndex((prevIndex) =>
				prevIndex < filteredStates.length - 1 ? prevIndex + 1 : prevIndex
			);
		} else if (e.key === "ArrowUp") {
			setHighlightedIndex((prevIndex) =>
				prevIndex > 0 ? prevIndex - 1 : prevIndex
			);
		} else if (e.key === "Enter" && highlightedIndex >= 0) {
			handleStateSelection(filteredStates[highlightedIndex]);
			e.preventDefault(); // Prevents form submission
		}
	};
	// handle Submit Personal

	const handleSubmitPersonal = async () => {
		if (validatePersonalFields()) {
			try {
				// await savePersonalDetails(personalData);
				setActiveForm("organized");
			} catch (error) {
				alert("Failed to save personal details.");
			}
		}
	};

	// handle Submit Organized

	const handleSubmitOrganized = async () => {
		const userData = JSON.parse(localStorage.getItem("user"));

		const token = userData?.access_token;
		const userName = userData?.username;
		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${userDetails?.access_token}`,
			},
		};

		const payload = {
			company_name: personalData?.company_name,
			financial_year_begins_from: organizedData?.financial_year_begin,
			books_beginning_from: organizedData?.books_beginning_from,
			base_currency_symbol: organizedData?.base_currency_symbol,
			mailing_name: personalData?.mailing_name,
			country: personalData?.country,
			state: personalData?.state,
			pincode: personalData?.pin_code,
			phone_no: personalData?.phone_no,
			mobile_no: personalData?.mobile_no,
			fax_no: personalData?.gst_no,
			email: personalData?.email_id,
			website: personalData?.website,
			formal_name: organizedData?.formal_name,
			suffix_symbol_to_amount: organizedData?.suffix_symbol_to_amount,
			add_space_between_amount_and_symbol:
				organizedData?.add_space_between_amount_and_symbol,
			show_amount_in_millions: organizedData?.show_amount_of_millions,
			use_security_control: true,
			administrator_name: userName,
			password: organizedData?.password,
			repeat_password: organizedData?.repeat_password,
			use_audit_features: true,
			disallow_opening_in_educational_mode: true,
		};

		if (validateOrganizedFields()) {
			try {
				await saveOrganizedDetails(payload, config); // Ensure this function exists
				setSuccessMessageVisible(true);
				// navigate("/login");
			} catch (error) {
				toast.error("Failed to save organized details.");
			}
		}
	};

	return (
		<div className="p-4 max-w-6xl mx-auto font-sans">
			{/* //  Success Overlay */}
			<div
				id="successOverlay"
				className={`fixed inset-0 flex items-center justify-center bg-black/30 z-50 ${
					successMessageVisible ? "" : "hidden"
				}`}>
				<div className="bg-white rounded-md p-6  w-96 h-72  flex flex-col items-center gap-4 shadow-lg">
					<div className="w-18 h-18 flex-shrink-0 bg-gray-200 flex items-center justify-center rounded-full">
						<img src={successImage} alt="Success Logo" className="w-20 h-20" />
					</div>
					<div className="flex flex-col items-center text-center">
						<span className="text-black text-3xl font-bold font-[Plus Jakarta Sans]">
							Success!
						</span>
					</div>
					<div className="flex flex-col items-center text-center">
						<p className="text-gray-500 text-base font-medium leading-6 font-[Plus Jakarta Sans]">
							Congratulations! Your company has been successfully registered.
						</p>
					</div>
				</div>
			</div>

			{/* content */}
			<div className="text-center mb-6">
				<h2 className="text-lg sm:text-2xl font-semibold tracking-tight mb-2">
					Join Us and Empower Your Business!
				</h2>
				<p className="text-[#838383] text-sm sm:text-base font-medium tracking-tight leading-relaxed max-w-md mx-auto">
					Register your company today and unlock tools to streamline operations,
					manage inventory, and grow with ease.
				</p>
			</div>

			{/* Form Headings */}
			<div className="flex items-center justify-center gap-4 my-10">
				<div className="flex items-center">
					<span
						className={`w-8 h-8 flex items-center justify-center rounded-full font-bold border ${
							activeForm === "personal"
								? "text-purpleCustom border-purpleCustom"
								: "text-purpleCustom border-purpleCustom"
						}`}>
						1
					</span>
					<span
						className={`ml-2 text-xs sm:text-base font-semibold ${
							activeForm === "personal"
								? "text-purpleCustom"
								: "text-purpleCustom"
						}`}>
						Personal Details
					</span>
				</div>

				<div
					className={`w-44 h-px  ${
						activeForm === "organized" ? "bg-purpleCustom" : "bg-[#C0C0C0]"
					}`}></div>

				<div className="flex items-center">
					<span
						className={`w-8 h-8 flex items-center justify-center rounded-full font-bold border ${
							activeForm === "organized"
								? "text-purpleCustom border-purpleCustom"
								: "text-[#C0C0C0] border-[#C0C0C0]"
						}`}>
						2
					</span>
					<span
						className={`ml-2 text-xs sm:text-base font-semibold ${
							activeForm === "organized"
								? "text-purpleCustom"
								: "text-[#C0C0C0]"
						}`}>
						Organized Details
					</span>
				</div>
			</div>

			{/* ---------------------------------------Personal Details Form--------------------------------------------------- */}
			{activeForm === "personal" && (
				<div className="grid grid-cols-1 sm:max-w-4xl mx-auto sm:grid-cols-2 gap-4 personal-grid">
					<div className="flex flex-col space-y-4">
						{/* company name */}
						<div className="relative">
							<input
								type="text"
								id="company_name"
								value={personalData.company_name}
								onChange={handleInputChange}
								ref={company_nameRef}
								onKeyDown={(e) => handleKeyDown(e, mailing_nameRef, null)}
								placeholder=""
								className="peer w-full h-9 px-2 text-sm border border-grayCustom focus:outline-none focus:border-purpleCustom rounded-md"
							/>
							<label
								htmlFor="company_name"
								className="absolute left-3 -top-2 text-xs text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
								Company Name
							</label>
						</div>
						{/* Mailing name */}
						<div className="relative">
							<input
								type="text"
								id="mailing_name"
								value={personalData.mailing_name}
								onChange={handleInputChange}
								ref={mailing_nameRef}
								onKeyDown={(e) => handleKeyDown(e, countryRef, company_nameRef)}
								placeholder=""
								className="peer w-full h-9 px-2 text-sm border border-grayCustom focus:outline-none focus:border-purpleCustom rounded-md"
							/>
							<label
								htmlFor="mailing_name"
								className="absolute left-3 -top-2 text-xs text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
								Mailing Name
							</label>
						</div>

						{/* country */}
						<div className="relative">
							<input
								type="text"
								id="country"
								value={personalData.country}
								onChange={handleInputChange}
								ref={countryRef}
								onKeyDown={(e) => handleKeyDown(e, stateRef, mailing_nameRef)}
								placeholder=""
								className="peer w-full h-9 px-2 text-sm border border-grayCustom focus:outline-none focus:border-purpleCustom rounded-md"
							/>
							<label
								htmlFor="country"
								className="absolute left-3 -top-2 text-xs text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
								Country
							</label>
						</div>

						{/* State Search Dropdown */}
						<div className="relative">
							<input
								type="text"
								id="state"
								value={personalData.state}
								onChange={handleInputChange}
								ref={stateRef}
								onKeyDown={(e) => {
									handleKeyDown(e, address_line1Ref, countryRef);
									if (stateDropdownOpen) handleKeyDownState(e);
								}}
								placeholder=""
								className="peer w-full h-9 px-2 text-sm border border-grayCustom focus:outline-none focus:border-purpleCustom rounded-md"
							/>
                            <label htmlFor='state'
                                className="absolute left-3 -top-2 text-xs text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white"
                            >
								State
							</label>
							{stateDropdownOpen && (
								<ul className="absolute z-10 bg-white border border-grayCustom w-full mt-1 max-h-40 overflow-y-auto">
									{filteredStates.map((state, index) => (
										<li
											key={state}
                                            className={`p-2 cursor-pointer ${index === highlightedIndex ? 'bg-gray-200' : ''}`}
                                            onMouseDown={() => handleStateSelection(state)}
                                        >
											{state}
										</li>
									))}
								</ul>
							)}
						</div>
						{/* address line1 */}
						<div className="relative">
							<input
								type="text"
								id="address_line1"
								value={personalData.address_line1}
								onChange={handleInputChange}
								ref={address_line1Ref}
								onKeyDown={(e) => handleKeyDown(e, address_line2Ref, stateRef)}
								placeholder=""
								className="peer w-full h-9 px-2 text-sm border border-grayCustom focus:outline-none focus:border-purpleCustom rounded-md"
							/>
                            <label htmlFor='address_line1'
                                className="absolute left-3 -top-2 text-xs text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white"
                            >
								Address(line1)
							</label>
						</div>

						{/* address line 2 */}
						<div className="relative">
							<input
								type="text"
								id="address_line2"
								value={personalData.address_line2}
								onChange={handleInputChange}
								ref={address_line2Ref}
								onKeyDown={(e) =>
									handleKeyDown(e, pin_codeRef, address_line1Ref)
								}
								placeholder=""
								className="peer w-full h-9 px-2 text-sm border border-grayCustom focus:outline-none focus:border-purpleCustom rounded-md"
							/>
							<label
								htmlFor="address_line2"
								className="absolute left-3 -top-2 text-xs text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
								Address(line2)
							</label>
						</div>
					</div>

					{/* Second column (next 6 fields) */}
					<div className="flex flex-col space-y-4">
						{/* pin code */}
						<div className="relative">
							<input
								type="text"
								id="pin_code"
								value={personalData.pin_code}
								onChange={handleInputChange}
								ref={pin_codeRef}
								onKeyDown={(e) =>
									handleKeyDown(e, mobile_noRef, address_line2Ref)
								}
								placeholder=""
								className="peer w-full h-9 px-2 text-sm border border-grayCustom focus:outline-none focus:border-purpleCustom rounded-md"
							/>
							<label
								htmlFor="pin_code"
								className="absolute left-3 -top-2 text-xs text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
								Pin Code
							</label>
						</div>
						{/* mobile no */}
						<div className="relative">
							<input
								type="text"
								id="mobile_no"
								value={personalData.mobile_no}
								onChange={handleInputChange}
								ref={mobile_noRef}
								onKeyDown={(e) => handleKeyDown(e, phone_noRef, pin_codeRef)}
								placeholder=""
								className="peer w-full h-9 px-2 text-sm border border-grayCustom focus:outline-none focus:border-purpleCustom rounded-md"
							/>
							<label
								htmlFor="mobile_no"
								className="absolute left-3 -top-2 text-xs text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
								Mobile No
							</label>
						</div>
						{/* phone no */}
						<div className="relative">
							<input
								type="text"
								id="phone_no"
								value={personalData.phone_no}
								onChange={handleInputChange}
								ref={phone_noRef}
								onKeyDown={(e) => handleKeyDown(e, gst_noRef, mobile_noRef)}
								placeholder=""
								className="peer w-full h-9 px-2 text-sm border border-grayCustom focus:outline-none focus:border-purpleCustom rounded-md"
							/>
							<label
								htmlFor="phone_no"
								className="absolute left-3 -top-2 text-xs text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
								Phone No
							</label>
						</div>
						{/* gst no */}
						<div className="relative">
							<input
								type="text"
								id="gst_no"
								value={personalData.gst_no}
								onChange={handleInputChange}
								ref={gst_noRef}
								onKeyDown={(e) => handleKeyDown(e, email_idRef, phone_noRef)}
								placeholder=""
								className="peer w-full h-9 px-2 text-sm border border-grayCustom focus:outline-none focus:border-purpleCustom rounded-md"
							/>
							<label
								htmlFor="gst_no"
								className="absolute left-3 -top-2 text-xs text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
								GST No
							</label>
						</div>
						{/* Email id */}
						<div className="relative">
							<input
								type="text"
								id="email_id"
								value={personalData.email_id}
								onChange={handleInputChange}
								ref={email_idRef}
								onKeyDown={(e) => handleKeyDown(e, websiteRef, gst_noRef)}
								placeholder=""
								className="peer w-full h-9 px-2 text-sm border border-grayCustom focus:outline-none focus:border-purpleCustom rounded-md"
							/>
							<label
								htmlFor="email_id"
								className="absolute left-3 -top-2 text-xs text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
								Email Id
							</label>
						</div>
						{/* State Search Dropdown */}
						<div className="relative">
							<input
								type="text"
								id="website"
								value={personalData.website}
								onChange={handleInputChange}
								ref={websiteRef}
								onKeyDown={(e) => handleKeyDown(e, null, email_idRef)}
								placeholder=""
								className="peer w-full h-9 px-2 text-sm border border-grayCustom focus:outline-none focus:border-purpleCustom rounded-md"
							/>
							<label
								htmlFor="website"
								className="absolute left-3 -top-2 text-xs text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
								Website
							</label>
						</div>
					</div>

					{/* Next Button */}
					<button
						className="col-span-1 sm:col-span-2 ml-auto mt-4 flex items-center gap-2 bg-purpleCustom text-white px-5 py-1 text-sm rounded-lg"
						onClick={handleSubmitPersonal}>
						Next <ChevronRight size={16} />
					</button>
				</div>
			)}

			{/*----------------------------------- organized Details Form ------------------------------------------------*/}
			{activeForm === "organized" && (
				<div className="space-y-5 sm:w-full mx-auto">
					{/* Financial Year Details */}
					<div className="text-center">
						<h3 className="font-semibold text-sm sm:text-md mb-4">
							Financial Year Details
						</h3>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							{/* financial_year_begin  */}
							<div className="relative">
								<input
									type="date"
									id="financial_year_begin"
									value={organizedData.financial_year_begin}
									onChange={handleInputChange}
									ref={financial_year_beginRef}
									onKeyDown={(e) =>
										handleKeyDown(e, books_beginning_fromRef, null)
									}
									placeholder=""
									className="peer w-full h-9 px-2 text-sm border border-grayCustom focus:outline-none focus:border-purpleCustom rounded-md"
								/>
								<label className="absolute left-3 -top-2 text-xs text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
									Financial Year Begins With
								</label>
							</div>
							{/* books_beginning_from */}
							<div className="relative">
								<input
									type="date"
									id="books_beginning_from"
									value={organizedData.books_beginning_from}
									onChange={handleInputChange}
									ref={books_beginning_fromRef}
									onKeyDown={(e) =>
										handleKeyDown(e, passwordRef, financial_year_beginRef)
									}
									placeholder=""
									className="peer w-full h-9 px-2 text-sm border border-grayCustom focus:outline-none focus:border-purpleCustom rounded-md"
								/>
								<label className="absolute left-3 -top-2 text-xs text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
									Books Beginning from
								</label>
							</div>
						</div>
					</div>

					{/* Security Control */}
					<div className="text-center">
						<h3 className="font-semibold text-sm sm:text-md mb-4">
							Security Control
						</h3>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							{/* Password  */}
							<div className="relative">
								<input
									type="password"
									id="password"
									value={organizedData.password}
									onChange={handleInputChange}
									ref={passwordRef}
									onKeyDown={(e) =>
										handleKeyDown(
											e,
											repeat_passwordRef,
											books_beginning_fromRef
										)
									}
									placeholder=""
									className="peer w-full h-9 px-2 text-sm border border-grayCustom focus:outline-none focus:border-purpleCustom rounded-md"
								/>
								<label
									htmlFor="password"
									className="absolute left-3 -top-2 text-xs text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
									Password
								</label>
							</div>
							{/* repeat_password */}
							<div className="relative">
								<input
									type="password"
									id="repeat_password"
									value={organizedData.repeat_password}
									onChange={handleInputChange}
									ref={repeat_passwordRef}
									onKeyDown={(e) =>
										handleKeyDown(e, base_currency_symbolRef, passwordRef)
									}
									placeholder=""
									className="peer w-full h-9 px-2 text-sm border border-grayCustom focus:outline-none focus:border-purpleCustom rounded-md"
								/>
								<label
									htmlFor="repeat_password"
									className="absolute left-3 -top-2 text-xs text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
									Repeat Password
								</label>
							</div>
						</div>
					</div>

					{/* Base Currency Information */}
					<div className="text-center">
						<h3 className="font-semibold text-sm sm:text-md mb-4">
							Base Currency Information
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 tracking-tight lg:grid-cols-4 gap-4">
							{/* base_currency_symbol  */}
							<div className="relative">
								<input
									type="text"
									id="base_currency_symbol"
									value={organizedData.base_currency_symbol}
									onChange={handleInputChange}
									ref={base_currency_symbolRef}
									onKeyDown={(e) =>
										handleKeyDown(
											e,
											suffix_symbol_to_amountRef,
											repeat_passwordRef
										)
									}
									placeholder=""
									className="peer w-full h-9 px-2 text-sm border border-grayCustom focus:outline-none focus:border-purpleCustom rounded-md"
								/>
								<label
									htmlFor="base_currency_symbol"
									className="absolute left-3 -top-2 text-xs text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
									Base Currency Symbol
								</label>
							</div>
							{/* suffix_symbol_to_amount */}

							{/* decimal_value */}
							<div className="relative">
								<input
									type="test"
									id="decimal_value"
									value={organizedData.decimal_value}
									onChange={handleInputChange}
									ref={decimal_valueRef}
									onKeyDown={(e) =>
										handleKeyDown(e, formal_nameRef, show_amount_of_millionsRef)
									}
									placeholder=""
									className="peer w-full h-9 px-2 text-sm border border-grayCustom focus:outline-none focus:border-purpleCustom rounded-md"
								/>
								<label
									htmlFor="decimal_value"
									className="absolute left-3 -top-2 text-xs text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
									Decimal Value
								</label>
							</div>
							{/* formal_name */}
							<div className="relative">
								<input
									type="text"
									id="formal_name"
									value={organizedData.formal_name}
									onChange={handleInputChange}
									ref={formal_nameRef}
									onKeyDown={(e) =>
										handleKeyDown(
											e,
											add_space_between_amount_and_symbolRef,
											decimal_valueRef
										)
									}
									placeholder=""
									className="peer w-full h-9 px-2 text-sm border border-grayCustom focus:outline-none focus:border-purpleCustom rounded-md"
								/>
								<label
									htmlFor="formal_name"
									className="absolute left-3 -top-2 text-xs text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
									Formal Name
								</label>
							</div>
							{/* add_space_between_amount_and_symbol */}

							{/* no_of_decimal_places */}
							<div className="relative">
								<input
									type="text"
									id="no_of_decimal_places"
									value={organizedData.no_of_decimal_places}
									onChange={handleInputChange}
									ref={no_of_decimal_placesRef}
									onKeyDown={(e) =>
										handleKeyDown(
											e,
											decimal_precisionRef,
											add_space_between_amount_and_symbolRef
										)
									}
									placeholder=""
									className="peer w-full h-9 px-2 text-sm border border-grayCustom focus:outline-none focus:border-purpleCustom rounded-md"
								/>
								<label
									htmlFor="no_of_decimal_places"
									className="absolute left-3 -top-2 text-xs text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
									No of decimal places
								</label>
							</div>
							{/* decimal_precision */}
							<div className="relative">
								<input
									type="text"
									id="decimal_precision"
									value={organizedData.decimal_precision}
									onChange={handleInputChange}
									ref={decimal_precisionRef}
									onKeyDown={(e) =>
										handleKeyDown(e, null, no_of_decimal_placesRef)
									}
									placeholder=""
									className="peer w-full h-9 px-2 text-sm border border-grayCustom focus:outline-none focus:border-purpleCustom rounded-md"
								/>
								<label
									htmlFor="decimal_precision"
									className="absolute left-3 -top-2 text-xs text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
									Decimal Precision
								</label>
							</div>
							<div className="flex items-center gap-2">
								<input
									type="checkbox"
									id="suffix_symbol_to_amount"
									checked={organizedData.suffix_symbol_to_amount}
									onChange={handleInputChange}
									ref={suffix_symbol_to_amountRef}
									className="w-5 h-5 accent-purpleCustom"
								/>
								<label
									htmlFor="suffix_symbol_to_amount"
									className="text-sm text-[#838383]">
									Suffix Symbol to Amount
								</label>
							</div>

							<div className="flex items-center gap-2">
								<input
									type="checkbox"
									id="show_amount_of_millions"
									checked={organizedData.show_amount_of_millions}
									onChange={handleInputChange}
									ref={show_amount_of_millionsRef}
									className="w-5 h-5 accent-purpleCustom"
								/>
								<label
									htmlFor="show_amount_of_millions"
									className="text-sm text-[#838383]">
									Show amount of millions
								</label>
							</div>

							<div className="flex items-center gap-2">
								<input
									type="checkbox"
									id="add_space_between_amount_and_symbol"
									checked={organizedData.add_space_between_amount_and_symbol}
									onChange={handleInputChange}
									ref={add_space_between_amount_and_symbolRef}
									className="w-5 h-5 accent-purpleCustom"
								/>
								<label
									htmlFor="add_space_between_amount_and_symbol"
									className="text-sm text-[#838383]">
									Add Space between amount and symbol
								</label>
							</div>
						</div>
					</div>

					{/* Buttons */}
					<div className="flex justify-end space-x-6 items-center mt-4">
						<button
							className="flex items-center gap-2 bg-purpleCustom text-white px-5 py-1 text-sm rounded-lg"
							onClick={() => setActiveForm("personal")}>
							<ChevronLeft /> Back
						</button>
						<button
							className="flex items-center gap-2 bg-purpleCustom text-white px-5 py-1 text-sm rounded-lg"
							onClick={handleSubmitOrganized}>
							Register <ChevronRight />
						</button>
					</div>
				</div>
			)}

			{/* Your existing JSX */}
			{/* <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss pauseOnHover draggable /> */}
			<ToastContainer autoClose={3000} />
		</div>
	);
};

export default Registration;
