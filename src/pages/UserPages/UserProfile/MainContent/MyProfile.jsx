import { InfoCircleOutlined, UserOutlined } from "@ant-design/icons";
import { Input, Tooltip } from "antd";
import { useState } from "react";
import { motion } from "framer-motion";
// eslint-disable-next-line react/prop-types
const MyProfile = ({ isEditing }) => {
  console.log(isEditing);
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    phoneNumber: "",
    email: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const fields = [
    { label: "UserName", name: "username", placeholder: "Enter your username" },
    { label: "Full Name", name: "fullName", placeholder: "Enter your full name" },
    { label: "Phone Number", name: "phoneNumber", placeholder: "Enter your phone number" },
    { label: "Email", name: "email", placeholder: "Enter your email" }
  ];

  // Example data
  const exampleData = {
    username: "john_doe",
    fullName: "John Doe",
    phoneNumber: "123-456-7890",
    email: "john.doe@example.com"
  };

  // Apply example data to formData state
  useState(() => {
    setFormData(exampleData);
  }, []);

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
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                prefix={
                  <UserOutlined
                    style={{
                      color: 'rgba(0,0,0,.25)',
                    }}
                  />
                }
                suffix={
                  <Tooltip title="Extra information">
                    <InfoCircleOutlined
                      style={{
                        color: 'rgba(0,0,0,.45)',
                      }}
                    />
                  </Tooltip>
                }
              />
              
            </span>
            ) : (
              <span className="basis-2/4">{exampleData[field.name]}</span>
            )
            }
            <motion.div>
                Save Changed
              </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyProfile;
