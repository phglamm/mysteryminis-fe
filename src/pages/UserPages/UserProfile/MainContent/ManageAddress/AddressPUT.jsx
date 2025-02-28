/* eslint-disable react/prop-types */
import { Input } from "antd";
import { useState } from "react";
import { UserOutlined, InfoCircleOutlined } from "@ant-design/icons";
import api from "../../../../../config/api";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
const AddressPUT = ({ setIsEditing, selectedAddress }) => {
    const [formData, setFormData] = useState({
        addressId: selectedAddress.addressId || 0,
        province: selectedAddress.province || "",
        district: selectedAddress.district || "",
        ward: selectedAddress.ward || "",
        addressDetail: selectedAddress.addressDetail || "",
        phoneNumber: selectedAddress.phoneNumber || "",
        name: selectedAddress.name || ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const updateAddress = async () => {
        try {
            await api.put(`Address`, formData);
            toast.success("Address updated successfully!");
            setIsEditing(false);
        } catch (err) {
            console.error("Error updating address:", err);
        }
    };

    return (
        <div>
            {Object.keys(formData).map((field) => (
                field !== "addressId" && (
                    <div key={field} className="flex flex-row items-center border-t pt-4 mb-4 border-gray-300">
                        <span className="basis-1/4 capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="basis-2/4">
                            <Input
                                name={field}
                                value={formData[field]}
                                onChange={handleChange}
                                placeholder={`Enter your ${field}`}
                                prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                                suffix={
                                    <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                                }
                            />
                        </span>
                    </div>
                )
            ))}
            <div className="flex justify-between">
                <motion.div
            className="text-center bg-black text-white rounded-full p-2 w-1/4 mx-auto mt-4 cursor-pointer"
            whileHover={{ scale: 1.1, backgroundColor: "red", color: "black", fontWeight: "bold" }}
            whileTap={{ scale: 0.9, backgroundColor: "black", color: "white", fontWeight: "bold" }}
            onClick={updateAddress}
          >
            Save Changes
          </motion.div>
                
            </div>
        </div>
    );
};

export default AddressPUT;