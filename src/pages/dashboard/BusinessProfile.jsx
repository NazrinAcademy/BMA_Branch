import { useState } from "react";
import { Upload } from "lucide-react";
import logo from "../../assets/Frame 152.png";

const BusinessProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [businessData, setBusinessData] = useState({
    companyName: "Grafin Mobiles",
    mailingName: "Grafin Mobiles",
    gstNo: "12AB3403R092",
    website: "http://grafin.shop.com",
    mobileNo: "9876543234",
    alternateNo: "7654389750",
    email: "grafin@gmail.com",
    country: "India",
    state: "Tamil Nadu",
    address1: "3-10 Post Office",
    address2: "Tenkasi",
    pinCode: "824612",
  });

  const [image, setImage] = useState(logo);

  const handleChange = (e) => {
    setBusinessData({ ...businessData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-xl p-2 lg:p-4 xl:p-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-lg font-semibold">Business Profile</h2>
        {!isEditing && (
          <button
            className="px-4 py-2 border rounded-lg text-purple-600 hover:bg-purple-100 transition"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
        )}
      </div>

 {/* Profile Image */}
<div className="flex items-center mt-6 relative">
  <div className="w-28 h-28 p-4 border-2 border-dotted border-gray-400 rounded-full flex items-center justify-center relative">
    <img src={image} alt="Business Logo" className="w-full h-full object-cover" />
    
    {/* Upload Icon (Visible Only in Edit Mode) */}
    {isEditing && (
      <label className="absolute bottom-0 right-2 translate-x-2 bg-white p-2 rounded-full cursor-pointer ">
        <Upload size={20} className="text-gray-600" />
        <input type="file" className="hidden" onChange={handleImageChange} />
      </label>
    )}
  </div>
</div>


      {/* Business Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <FieldGroup title="Business Details" fields={[
          { label: "Company Name", name: "companyName" },
          { label: "Mailing Name", name: "mailingName" },
          { label: "GST No", name: "gstNo" },
          { label: "Website", name: "website" },
        ]} businessData={businessData} isEditing={isEditing} handleChange={handleChange} />

        <FieldGroup title="Contact Details" fields={[
          { label: "Mobile No", name: "mobileNo" },
          { label: "Alternate No", name: "alternateNo" },
          { label: "Email Id", name: "email" },
        ]} businessData={businessData} isEditing={isEditing} handleChange={handleChange} />

        <FieldGroup title="Address" fields={[
          { label: "Country", name: "country" },
          { label: "State", name: "state" },
          { label: "Address (Line 1)", name: "address1" },
          { label: "Address (Line 2)", name: "address2" },
          { label: "Pin Code", name: "pinCode" },
        ]} businessData={businessData} isEditing={isEditing} handleChange={handleChange} />
      </div>

      {/* Update Button */}
      {isEditing && (
        <div className="flex justify-end mt-6">
          <button
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            onClick={() => setIsEditing(false)}
          >
            Update
          </button>
        </div>
      )}
    </div>
  );
};

// Reusable Field Group Component
const FieldGroup = ({ title, fields, businessData, isEditing, handleChange }) => (
  <div>
    <h3 className="text-md font-medium mb-4">{title}</h3>
    <div className="space-y-4">
      {fields.map(({ label, name }) => (
        <FloatingLabelInput
          key={name}
          label={label}
          name={name}
          value={businessData[name]}
          isEditing={isEditing}
          onChange={handleChange}
        />
      ))}
    </div>
  </div>
);

// Floating Label Input Component
const FloatingLabelInput = ({ label, name, value, onChange, isEditing }) => {
  return (
    <div className="relative w-full">
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        readOnly={!isEditing}
        placeholder=""
        className={`peer w-full h-9 px-3 text-sm border ${isEditing ? 'border-purple-500 focus:ring-purple-500' : 'border-gray-300'} focus:outline-none rounded-md`}
      />
      <label
        htmlFor={name}
        className="absolute left-3 -top-2 text-xs text-[#838383] bg-white px-1 transition-all 
                   peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent 
                   peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white"
      >
        {label}
      </label>
    </div>
  );
};

export default BusinessProfile;
