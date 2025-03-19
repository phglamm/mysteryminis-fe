/* eslint-disable react/prop-types */
import { InfoCircleOutlined, UserOutlined } from "@ant-design/icons";
import { Input, Tooltip, Spin, Select, message } from "antd";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../Redux/features/counterSlice";
import { fetchUserData, updateUserProfile } from "../../../../services/UserServices/UserProfileServices/UserProfileServices";

const { Option } = Select;

const MyProfile = ({
  isEditing,
  setIsEditing,
  resetPassword,
  setResetPassword,
}) => {
  const user = useSelector(selectUser);

  const [formData, setFormData] = useState({
    userId: user.userId,
    username: "",
    fullname: "",
    phone: "",
    email: user.email,
    gender: true, // Default to true (Male)
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchUserData(user.email);
        setFormData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [user.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenderChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      gender: value,
    }));
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      await updateUserProfile(formData);
      message.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="w-full h-[27vw] flex justify-center items-center">
        <Spin size="large" />
      </div>
    );

  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div>
      <div className="max-h-[27vw]">
        {!resetPassword ? (
          <>
            {/* User Information Fields */}
            {["username", "fullname", "phone", "email"].map((field) => (
              <div
                key={field}
                className="flex flex-row items-center border-t-1 pt-4 mb-4 border-gray-300"
              >
                <span className="basis-1/4 capitalize">{field}</span>
                {isEditing ? (
                  <span className="basis-2/4">
                    <Input
                      name={field}
                      value={formData[field] || ""}
                      onChange={handleChange}
                      placeholder={`Enter your ${field}`}
                      disabled={field === "email"}
                      prefix={
                        <UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                      }
                      suffix={
                        <Tooltip title="Extra information">
                          <InfoCircleOutlined
                            style={{ color: "rgba(0,0,0,.45)" }}
                          />
                        </Tooltip>
                      }
                    />
                  </span>
                ) : (
                  <span className="basis-2/4">{formData[field]}</span>
                )}
              </div>
            ))}

            {/* Gender Field with Select Dropdown */}
            <div className="flex flex-row items-center border-t-1 pt-4 mb-4 border-gray-300">
              <span className="basis-1/4">Gender</span>
              {isEditing ? (
                <span className="basis-2/4">
                  <Select
                    value={formData.gender}
                    onChange={handleGenderChange}
                    style={{ width: "100%" }}
                  >
                    <Option value={true}>Male</Option>
                    <Option value={false}>Female</Option>
                  </Select>
                </span>
              ) : (
                <span className="basis-2/4">
                  {formData.gender ? "Male" : "Female"}
                </span>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Reset Password Fields */}
            {["Current Password", "New Password", "Confirm new password"].map(
              (field) => (
                <div
                  key={field}
                  className="flex flex-row items-center border-t-1 pt-4 mb-4 border-gray-300"
                >
                  <span className="basis-1/4 capitalize">{field}</span>
                  <span className="basis-2/4">
                    <Input
                      name={field}
                      placeholder={`Enter your ${field}`}
                      prefix={
                        <UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                      }
                      suffix={
                        <Tooltip title="Extra information">
                          <InfoCircleOutlined
                            style={{ color: "rgba(0,0,0,.45)" }}
                          />
                        </Tooltip>
                      }
                    />
                  </span>
                </div>
              )
            )}
          </>
        )}

        {/* Save Changes Button */}
        {isEditing || resetPassword ? (
          <motion.div
            className="text-center bg-black text-white rounded-full p-2 w-1/4 mx-auto mt-4 cursor-pointer"
            whileHover={{
              scale: 1.1,
              backgroundColor: "red",
              color: "black",
              fontWeight: "bold",
            }}
            whileTap={{
              scale: 0.9,
              backgroundColor: "black",
              color: "white",
              fontWeight: "bold",
            }}
            onClick={handleUpdateProfile}
          >
            Save Changes
          </motion.div>
        ) : (
          <motion.div
            className="text-center bg-black text-white rounded-full p-2 w-1/4 mx-auto mt-4 cursor-pointer"
            whileHover={{
              scale: 1.1,
              backgroundColor: "red",
              color: "black",
              fontWeight: "bold",
            }}
            whileTap={{
              scale: 0.9,
              backgroundColor: "black",
              color: "white",
              fontWeight: "bold",
            }}
            onClick={() => setResetPassword(true)}
          >
            Reset Password
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
