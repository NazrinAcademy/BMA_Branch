import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { saveGeneralDetails, savePersonalDetails } from '../apiService/PGapi';
import { states } from '../utils/States';
import successImage from '../assets/success.png'

const PGDetails = () => {
    const [activeForm, setActiveForm] = useState('general');
    const [personalData, setPersonalData] = useState({
        name: '',
        mailingName: '',
        country: '',
        state: '',
        addressLine1: '',
        addressLine2: '',
        pinCode: '',
        mobileNo: '',
        phoneNumber: '',
        faxNo: '',
        emailId: '',
        import React, { useState } from 'react';
    import { ChevronRight, ChevronLeft } from 'lucide-react';
    import { saveGeneralDetails, savePersonalDetails } from '../apiService/PGapi';


    const PGDetails = () => {
        const [activeForm, setActiveForm] = useState('personal');
        const [personalData, setPersonalData] = useState({
            name: '',
            pinCode: '',
            mailingName: '',
            mobileNo: '',
            country: '',
            phoneNumber: '',
            state: '',
            faxNo: '',
            addressLine1: '',
            emailId: '',
            addressLine2: '',
            website: '',
        });

        const [generalData, setGeneralData] = useState({
            financialYearBeginsWith: '',
            booksBeginningFrom: '',
            password: '',
            repeatPassword: '',
            baseCurrencySymbol: '',
            suffixSymbolToAmount: '',
            showAmountOfMillions: '',
            decimalValue: '',
            formalName: '',
            addSpaceBetweenAmountAndSymbol: '',
            noOfDecimalPlaces: '',
            decimalPrecision: '',
        });

        const [successMessageVisible, setSuccessMessageVisible] = useState(false);


        // validate for personal detail form

        const validatePersonalFields = () => {
            const allFieldsEmpty = Object.values(personalData).every((value) => !value.trim());

            if (allFieldsEmpty) {
                toast.error("All fields are required", {
                    style: {
                        backgroundColor: "#F8D7DA",
                        color: "#842029",
                    }
                },);
                return false;
            }

            let firstError = null;

            Object.entries(personalData).forEach(([key, value]) => {
                if (!value.trim() && !firstError) {
                    firstError = `${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")} is required`;
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


        // validate for general detail form

        const validateGeneralFields = () => {
            const allFieldsEmpty = Object.values(generalData).every((value) => !value.trim());

            if (allFieldsEmpty) {
                toast.error("All fields are required", {
                    style: {
                        backgroundColor: "#F8D7DA",
                        color: "#842029",
                    }
                },);
                return false;
            }

            let firstError = null;

            Object.entries(generalData).forEach(([key, value]) => {
                if (!value.trim() && !firstError) {
                    firstError = `${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")} is required`;
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
            if (activeForm === 'personal') {
                setPersonalData((prevData) => ({
                    ...prevData,
                    [id]: id === 'name' ? value : value,
                    ...(id === 'name' && { mailingName: value }),
                }));
            } else if (activeForm === 'general') {
                setGeneralData((prevData) => ({
                    ...prevData,
                    [id]: value,
                }));
            }
        };

        useEffect(() => {
            if (successMessageVisible) {
                const timer = setTimeout(() => setSuccessMessageVisible(false), 3000);
                return () => clearTimeout(timer);
            }
        }, [successMessageVisible]);



        // handle key Down:

        const handleKeyDown = (e, nextFieldId, nextColumnFields) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const nextInput = document.getElementById(nextFieldId);

                // If no field in the current column, check next column
                if (!nextInput && nextColumnFields?.length > 0) {
                    const firstFieldInNextColumn = document.getElementById(nextColumnFields[0]);
                    if (firstFieldInNextColumn) {
                        firstFieldInNextColumn.focus();
                    }
                } else if (nextInput) {
                    nextInput.focus();
                }
            }
        };


        // handle Submit Personal

        const handleSubmitPersonal = async () => {

            if (validatePersonalFields()) {
                try {
                    await savePersonalDetails(personalData);
                    setActiveForm('general');
                } catch (error) {
                    alert('Failed to save personal details.');
                }
            }
        };

        // handle Submit General

        const handleSubmitGeneral = async () => {
            if (validateGeneralFields()) {
                try {
                    await saveGeneralDetails(generalData);
                    setSuccessMessageVisible(true);
                } catch (error) {
                    alert('Failed to save general details.');
                }
            }
        };

        return (
            <div className="p-4 max-w-6xl mx-auto font-sans">
                {/* //  Success Overlay */}
                <div
                    id="successOverlay"
                    className={`fixed inset-0 flex items-center justify-center bg-black/30 z-50 ${successMessageVisible ? '' : 'hidden'
                        }`}
                >
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
                        FinancialYearBeginsWith : '',
                        BooksBeginningFrom : '',
                        Password :'',
                        RepeatPassword :'',
                        BaseCurrencySymbol :'',
                        SuffixSymboltoAmount :'',
                        ShowAmountofMillions :'',
                        DecimalValue :'',
                        FormalName :'',
                        AddSpacebetweenAmountandSymbol :'',
                        NoofDecimalPlaces :'',
                        DecimalPrecision :'',
    })

    const handleInputChange = (e) => {
        const {id, value} = e.target;
                        setPersonalData({
                            ...personalData,
                            [id]: value,
        });

                        setGeneralData({
                            ...generalData,
                            [id]: value,
        })
    };

    const handleSubmitPersonal = async () => {
        try {
                            await savePersonalDetails(personalData);
                        setActiveForm('general'); // Move to the next form
        } catch (error) {
                            alert('Failed to save personal details.');
        }
    };

    const handleSubmitGeneral = async () =>{
        try {
                            await saveGeneralDetails(generalData);
        } catch (error) {
                            alert('Failed to save general details.');
        }
    }

                        return (
                        <div className="p-4 my-4 max-w-5xl mx-auto bg-[#ffff] rounded-lg">
                            <div className="text-center mb-6">
                                <h2 className="text-base sm:text-lg font-bold leading-tight mb-2">
                                    Join Us and Empower Your Business!
                                </h2>
                                <p className="text-xs sm:text-sm font-medium leading-relaxed text-gray-600">
                                    Register your company today and unlock tools to streamline operations, manage inventory, and grow with ease.
                                </p>
                            </div>


                            {/* Form Headings */}
                            <div className="flex items-center justify-center gap-4 my-10">
                                <div className="flex items-center">
                                    <span
                                        className={`w-8 h-8 flex items-center justify-center rounded-full font-bold border ${activeForm === 'personal'
                                            ? 'text-purpleCustom border-purpleCustom'
                                            : 'text-purpleCustom border-purpleCustom'}`}
                                ? 'text-[#593FA9] border-[#593FA9]'
                                : 'text-[#593FA9] border-[#593FA9]'}`}
                    >
                                    1
                                </span>
                                <span
                                    className={`ml-2 text-xs sm:text-base font-semibold ${activeForm === 'personal' ? 'text-purpleCustom' : 'text-purpleCustom'}`}
                                    className={`ml-2 text-xs sm:text-sm font-semibold ${activeForm === 'personal' ? 'text-[#593FA9]' : 'text-[#593FA9]'}`}
                                >
                                    Personal Details
                                </span>
                            </div>

                            <div className={`w-44 h-px  ${activeForm === 'general'
                                ? 'bg-purpleCustom'
                                : 'bg-[#C0C0C0]'}`}>
                            </div>

                            <div className="flex items-center">
                                <span
                                    className={`w-8 h-8 flex items-center justify-center rounded-full font-bold border ${activeForm === 'general'
                                        ? 'text-purpleCustom border-purpleCustom'
                                        : 'text-[#C0C0C0] border-[#C0C0C0]'}`}
                <div className="h-px w-20 bg-gray-300"></div>
                                <div className="flex items-center">
                                    <span
                                        className={`w-8 h-8 flex items-center justify-center rounded-full font-bold border ${activeForm === 'general'
                                            ? 'text-[#593FA9] border-[#593FA9]'
                                            : 'text-gray-400 border-gray-400'}`}
                                    >
                                        2
                                    </span>
                                    <span
                                        className={`ml-2 text-xs sm:text-base font-semibold ${activeForm === 'general' ? 'text-purpleCustom' : 'text-[#C0C0C0]'}`}
                                        className={`ml-2 text-xs sm:text-sm font-semibold ${activeForm === 'general' ? 'text-[#593FA9]' : 'text-gray-400'}`}
                                    >
                                        General Details
                                    </span>
                                </div>
                            </div>



                            {/* ---------------------------------------Personal Details Form--------------------------------------------------- */}
                            {activeForm === 'personal' && (
                                <div className="grid grid-cols-1 sm:max-w-4xl mx-auto sm:grid-cols-2 gap-4 personal-grid">
                                    {/* First column (first 6 fields) */}
                                    <div className="flex flex-col space-y-4">
                                        {[
                                            'name*',
                                            'mailingName*',
                                            'country*',
                                            'state*',
                                            'addressLine1*',
                                            'addressLine2*',
                                        ].map((field, index, fieldsArray) => (
                                            <div key={index} className="relative">
                                                <input
                                                    type="text"
                                                    id={field}
                                                    value={personalData[field]}
                                                    onChange={handleInputChange}
                                                    onKeyDown={(e) =>
                                                        handleKeyDown(
                                                            e,
                                                            fieldsArray[index + 1], // Focus next field in column
                                                            ['pinCode', 'mobileNo', 'phoneNumber', 'faxNo', 'emailId', 'website'] // Fields in next column
                                                        )
                                                    }
                                                    placeholder=" "
                                                    className="peer w-full h-9 px-2 text-sm border border-grayCustom focus:outline-none focus:border-purpleCustom rounded-md"
                                                />
                                                <label
                                                    htmlFor={field}
                                                    className="absolute left-3 -top-2 text-xs text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white"
                                                >
                                                    {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                                                </label>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Second column (next 6 fields) */}
                                    <div className="flex flex-col space-y-4">
                                        {[
                                            'pinCode*',
                                            'mobileNo*',
                                            'phoneNumber*',
                                            'faxNo*',
                                            'emailId*',
                                            'website*',
                                        ].map((field, index, fieldsArray) => (
                                            <div key={index} className="relative">
                                                <input
                                                    type="text"
                                                    id={field}
                                                    value={personalData[field]}
                                                    onChange={handleInputChange}
                                                    onKeyDown={(e) =>
                                                        handleKeyDown(e, fieldsArray[index + 1]) // Focus next field in this column
                                                    }
                                                    placeholder=" "
                                                    className="peer w-full h-9 px-2 text-sm border border-grayCustom focus:outline-none focus:border-purpleCustom rounded-md"
                                                />
                                                <label
                                                    htmlFor={field}
                                                    className="absolute left-3 -top-2 text-xs text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white"
                                                >
                                                    {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                                                </label>
                                            </div>
                                        ))}
                                    </div>




                                    {/* Next Button */}
                                    <button
                                        className="col-span-1 sm:col-span-2 ml-auto mt-4 flex items-center gap-2 bg-purpleCustom text-white px-5 py-1 text-sm rounded-lg"
                                        {/* Personal Details Form */}
                                        {activeForm === 'personal' && (
                                            <div className="grid grid-cols-1 sm:max-w-4xl mx-auto sm:grid-cols-2 gap-4 personal-grid">
                                                {[
                                                    'Name',
                                                    'Pin Code',
                                                    'Mailing Name',
                                                    'Mobile No',
                                                    'Country',
                                                    'Phone Number',
                                                    'State',
                                                    'Fax No',
                                                    'Address (line 1)',
                                                    'Email Id',
                                                    'Address (line 2)',
                                                    'Website',
                                                ].map((label, index) => (
                                                    <div key={index} className="relative">
                                                        {label === 'State' ? (
                                                            <select
                                                                id="state" // Make sure the id matches the key in `personalData`
                                                                value={personalData.state} // Bind the value to personalData.state
                                                                onChange={handleInputChange}
                                                                className="peer w-full h-9 px-2 text-sm border border-gray-300 focus:outline-none focus:border-[#593FA9] rounded-lg bg-white"
                                                            >
                                                                <option value="" disabled>Select State</option>
                                                                <option value="Tamil Nadu">Tamil Nadu</option>
                                                                <option value="Kerala">Kerala</option>
                                                                <option value="Karnataka">Karnataka</option>
                                                                <option value="Andhra Pradesh">Andhra Pradesh</option>
                                                                <option value="Telangana">Telangana</option>
                                                            </select>
                                                        ) : (
                                                            <input
                                                                type="text"
                                                                id={label}
                                                                value={personalData[label]}
                                                                onChange={handleInputChange}
                                                                placeholder=" "
                                                                className="peer w-full h-9 px-2 text-sm border border-gray-300 focus:outline-none focus:border-[#593FA9] rounded-lg"
                                                            />
                                                        )}
                                                        <label
                                                            htmlFor={label}
                                                            className="absolute left-3 -top-2 text-xs text-gray-500 bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-500 peer-focus:bg-white"
                                                        >
                                                            {label}
                                                        </label>
                                                    </div>
                                                ))}
                                                <button
                                                    className="col-span-1 sm:col-span-2 ml-auto mt-4  flex items-center gap-2 bg-[#593FA9] text-white px-5 py-1 text-sm rounded-lg"
                                                    onClick={handleSubmitPersonal}
                                                >
                                                    Next <ChevronRight size={16} />
                                                </button>
                                            </div>
                                        )}

                                        HEAD


                                        {/*----------------------------------- General Details Form ------------------------------------------------*/}
                                        {activeForm === 'general' && (
                                            <div className="space-y-5 sm:w-full mx-auto">
                                                {/* Financial Year Details */}
                                                <div className="text-center">
                                                    <h3 className="font-semibold text-sm sm:text-md mb-4">
                                                        Financial Year Details
                                                    </h3>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        {['financialYearBeginsWith*', 'booksBeginningFrom*'].map((field, index, fieldsArray) => (
                                                            <div key={index} className="relative">
                                                                <input
                                                                    type="date"
                                                                    id={field}
                                                                    value={generalData[field]}
                                                                    onChange={handleInputChange}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter') {
                                                                            // Focus next field in the next section if exists
                                                                            handleKeyDown(e, fieldsArray[index + 1] || 'password');
                                                                        }
                                                                    }}
                                                                    placeholder=" "
                                                                    className="peer w-full h-9 px-2 text-sm border border-grayCustom focus:outline-none focus:border-purpleCustom rounded-md"
                                                                />
                                                                <label
                                                                    htmlFor={field}
                                                                    className="absolute left-3 -top-2 text-xs text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white"
                                                                >
                                                                    {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Security Control */}
=======
            {/* General Details Form (This section will be shown once the 'personal' form is submitted) */}
                                                <div className="space-y-5 sm:w-full mx-auto">
                                                    {/* Books and Financial Year Details */}
                                                    {activeForm === 'general' && (
                                                        <div className="text-center">
                                                            <h3 className="font-semibold text-sm sm:text-md mb-4">
                                                                Books and Financial Year Details
                                                            </h3>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                {['Financial year begins with', 'Books beginning from'].map(
                                                                    (label, index) => (
                                                                        <div key={index} className="relative">
                                                                            <input
                                                                                type="date"
                                                                                id={label}
                                                                                value={generalData[label]}
                                                                                onChange={handleInputChange}
                                                                                placeholder=" "
                                                                                className="peer w-full h-9 px-2 text-sm border border-gray-300 focus:outline-none focus:border-[#593FA9] rounded-lg"
                                                                            />
                                                                            <label
                                                                                htmlFor={label}
                                                                                className="absolute left-3 -top-2 text-xs text-gray-500 bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-500 peer-focus:bg-white"
                                                                            >
                                                                                {label}
                                                                            </label>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Security Control */}
                                                    {activeForm === 'general' && (
>>>>>>> origin/Frontend_Niyas
                                                        <div className="text-center">
                                                            <h3 className="font-semibold text-sm sm:text-md mb-4">
                                                                Security Control
                                                            </h3>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {
            ['password*', 'repeatPassword*'].map((field, index, fieldsArray) => (
                <div key={index} className="relative">
                    <input
                        type="password"
                        id={field}
                        value={generalData[field]}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleKeyDown(e, fieldsArray[index + 1] || 'baseCurrencySymbol');
                            }
                        }}
                        placeholder=" "
                        className="peer w-full h-9 px-2 text-sm border border-grayCustom focus:outline-none focus:border-purpleCustom rounded-md"
                    />
                    <label
                        htmlFor={field}
                        className="absolute left-3 -top-2 text-xs text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white"
                    >
                        {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                            {['Password', 'Repeat Password'].map((label, index) => (
                            <div key={index} className="relative">
                                <input
                                    type="password"
                                    id={label}
                                    value={generalData[label]}
                                    onChange={handleInputChange}
                                    placeholder=" "
                                    className="peer w-full h-9 px-2 text-sm border border-gray-300 focus:outline-none focus:border-[#593FA9] rounded-lg"
                                />
                                <label
                                    htmlFor={label}
                                    className="absolute left-3 -top-2 text-xs text-gray-500 bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-500 peer-focus:bg-white"
                                >
                                    {label}
                                </label>
                            </div>
                        ))}
                </div>
                    </div >

    {/* Base Currency Information */ }
                )}

                {/* Base Currency Information */}
                {activeForm === 'general' && (
    < div className = "text-center" >
                        <h3 className="font-semibold text-sm sm:text-md mb-4">
                            Base Currency Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 tracking-tight lg:grid-cols-4 gap-4">
                            {[
                                'baseCurrencySymbol*',
                                'suffixSymbolToAmount*',
                                'showAmountOfMillions*',
                                'decimalValue*',
                                'formalName*',
                                'addSpaceBetweenAmountAndSymbol*',
                                'noOfDecimalPlaces*',
                                'decimalPrecision*',
                            ].map((field, index, fieldsArray) => (
                                <div key={index} className="relative">
                                    <input
                                        type="text"
                                        id={field}
                                        value={generalData[field]}
                                        onChange={handleInputChange}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleKeyDown(e, fieldsArray[index + 1] || 'financialYearBeginsWith');
                                            }
                                        }}
                                        placeholder=" "
                                        className="peer w-full h-9 px-2 text-sm border border-grayCustom focus:outline-none focus:border-purpleCustom rounded-md"
                                    />
                                    <label
                                        htmlFor={field}
                                        className="absolute left-3 -top-2 text-xs text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white"
                                    >
                                        {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                                'Base Currency Symbol',
                                'Suffix Symbol to Amount',
                                'Show amount of millions',
                                'Decimal Value',
                                'Formal Name',
                                'Add Space between amount and symbol',
                                'No of decimal places',
                                'Decimal Precision',
                            ].map((label, index) => (
                                <div key={index} className="relative">
                    <input
                        type="text"
                        id={label}
                        value={generalData[label]}
                        onChange={handleInputChange}
                        placeholder=" "
                        className="peer w-full h-9 px-2 text-sm border border-gray-300 focus:outline-none focus:border-[#593FA9] rounded-lg"
                    />
                    <label
                        htmlFor={label}
                        className="absolute left-3 -top-2 text-xs text-gray-500 bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-500 peer-focus:bg-white"
                    >
                        {label}
                    </label>
                </div>
                            ))}
        </div>
                    </div >




    {/* Buttons */ }
    < div className = "flex justify-end space-x-6 items-center mt-4" >
                        <button
                            className="flex items-center gap-2 bg-purpleCustom text-white px-5 py-1 text-sm rounded-lg"
                            onClick={() => setActiveForm('personal')}
                        >
                            <ChevronLeft /> Back
                        </button>
                        <button className="flex items-center gap-2 bg-purpleCustom text-white px-5 py-1 text-sm rounded-lg"
                            onClick={handleSubmitGeneral}>
                            Register <ChevronRight />
                        </button>
                    </div >
                </div >
            )}

{/* Your existing JSX */ }
{/* <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss pauseOnHover draggable /> */ }
<ToastContainer autoClose={3000} />
        </div >

    );
};

export default PGDetails;
                {/* Buttons */}
                <div className="flex justify-end space-x-6 items-center mt-4">
                    <button
                        className="flex items-center gap-2 bg-[#593FA9] text-white px-5 py-1 text-sm rounded-lg"
                        onClick={() => setActiveForm('personal')}
                    >
                        <ChevronLeft /> Back
                    </button>
                    <button className="flex items-center gap-2 bg-[#593FA9] text-white px-5 py-1 text-sm rounded-lg"
                    onClick={handleSubmitGeneral}>
                        Next <ChevronRight />
                    </button>
                </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default PGDetails;
