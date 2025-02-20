/* eslint-disable react/prop-types */
import { InfoCircleOutlined, UserOutlined } from "@ant-design/icons";
import { Input, Tooltip, Spin } from "antd";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const MyProfile = ({ isEditing }) => {
  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    phone: "",
    email: ""
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          "https://mysteryminis-b3are0btehhncpcx.australiacentral-01.azurewebsites.net/api/User/user-by-email/nguyenquanggiap642004@gmail.com"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setFormData(data); // Update form data with fetched API data
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const fields = [
    { label: "UserName", name: "username", placeholder: "Enter your username" },
    { label: "Full Name", name: "fullname", placeholder: "Enter your full name" },
    { label: "Phone Number", name: "phone", placeholder: "Enter your phone number" },
    { label: "Email", name: "email", placeholder: "Enter your email" }
  ];

  if (loading) return <Spin size="large" />;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div>
      <div className="max-h-[27vw]">
        {fields.map((field) => (
          <div key={field.name} className="flex flex-row items-center border-t-1 pt-4 mb-4 border-gray-300">
            <span className="basis-1/4">{field.label}</span>
            {isEditing ? (
              <span className="basis-2/4">
                <Input
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                  suffix={
                    <Tooltip title="Extra information">
                      <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                    </Tooltip>
                  }
                />
              </span>
            ) : (
              <span className="basis-2/4">{formData[field.name]}</span>
            )}
            
          </div>
        ))}
        <motion.div 
          className="text-center bg-black text-white rounded-full p-2 w-1/4 mx-auto mt-4 cursor-pointer"
          whileHover={{ scale: 1.1, backgroundColor: "red", color: "black", fontWeight: "bold" }}
          whileTap={{ scale: 0.9, backgroundColor: "black", color: "white", fontWeight: "bold" }}
        >
          Save Changes
        </motion.div>
      </div>
    </div>
  );
};

export default MyProfile;
