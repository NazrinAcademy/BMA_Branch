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
        const { id, value } = e.target;
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
        <div className="p-4 max-w-6xl mx-auto">
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
                                ? 'text-[#593FA9] border-[#593FA9]'
                                : 'text-[#593FA9] border-[#593FA9]'}`}
                    >
                        1
                    </span>
                    <span
                        className={`ml-2 text-xs sm:text-sm font-semibold ${activeForm === 'personal' ? 'text-[#593FA9]' : 'text-[#593FA9]'}`}
                    >
                        Personal Details
                    </span>
                </div>
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
                        className={`ml-2 text-xs sm:text-sm font-semibold ${activeForm === 'general' ? 'text-[#593FA9]' : 'text-gray-400'}`}
                    >
                        General Details
                    </span>
                </div>
            </div>

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
                    <div className="text-center">
                        <h3 className="font-semibold text-sm sm:text-md mb-4">
                            Security Control
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    </div>
                )}

                {/* Base Currency Information */}
                {activeForm === 'general' && (
                    <div className="text-center">
                        <h3 className="font-semibold text-sm sm:text-md mb-4">
                            Base Currency Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 tracking-tight lg:grid-cols-4 gap-4">
                            {[
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
