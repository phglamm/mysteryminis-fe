/* eslint-disable react/prop-types */
import { InfoCircleOutlined, UserOutlined, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Input, Tooltip, Spin, Select, message, Upload, Image } from "antd";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../Redux/features/counterSlice";
import { fetchUserData, updateUserProfile, resetUserPassword } from "../../../../services/UserServices/UserProfileServices/UserProfileServices";
import uploadFile from "../../../../utils/UploadImage"; // Import the upload utility
import toast from "react-hot-toast"; // Import toast for notifications

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
    avatarUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState("");

  // Add state for password management
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

    useEffect(() => {
      setIsEditing(false); 
      setResetPassword(false); 
    }, []);
    

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

  const handleChange = async ({ fileList: newFileList }) => {
    const updatedFileList = await Promise.all(
      newFileList.map(async (file) => {
        if (file.status !== "done") {
          try {
            const url = await uploadFile(file.originFileObj); // Upload the file and get the URL
            toast.success("Upload Success");
            return { ...file, url, status: "done" }; // Update the file status and add the URL
          } catch (error) {
            console.error("Upload failed", error);
            toast.error("Upload failed");
            return { ...file, status: "error" }; // Set status to error on failure
          }
        }
        return file; // Keep already uploaded files as-is
      })
    );
    setFileList(updatedFileList);
    setFormData((prev) => ({
      ...prev,
      avatarUrl: updatedFileList.length ? updatedFileList[0].url : "", // Update avatarUrl in formData
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

  const handlePreview = async (file) => {
    setPreviewItem(file.url || file.thumbUrl);
    setPreviewOpen(true);
  };

  // Handle password reset
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation errors when user types
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Check matching passwords on the fly
    if (name === 'newPassword' || name === 'confirmNewPassword') {
      if (name === 'newPassword' && passwordData.confirmNewPassword && 
          value !== passwordData.confirmNewPassword) {
        setPasswordErrors(prev => ({
          ...prev,
          confirmNewPassword: 'Passwords do not match'
        }));
      } else if (name === 'confirmNewPassword' && 
                value !== passwordData.newPassword) {
        setPasswordErrors(prev => ({
          ...prev,
          confirmNewPassword: 'Passwords do not match'
        }));
      } else if (name === 'confirmNewPassword' && 
                value === passwordData.newPassword) {
        setPasswordErrors(prev => ({
          ...prev,
          confirmNewPassword: ''
        }));
      }
    }
  };

  // Validate password fields
  const validatePasswords = () => {
    const errors = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!passwordData.confirmNewPassword) {
      errors.confirmNewPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      errors.confirmNewPassword = 'Passwords do not match';
    }
    
    return errors;
  };

  // Handle password reset submit
  const handleResetPassword = async () => {
    const errors = validatePasswords();
    
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }
    
    setLoading(true);
    try {
      // Call API with required fields
      await resetUserPassword({
        email: user.email,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      toast.success("Password updated successfully!");
      setResetPassword(false);
      
      // Reset form fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
    } catch (err) {
      const errorMessage = err?.errors[0]?.description;
      console.error("Error resetting password:", errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const uploadButton = (
    <div>
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

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
        {isEditing ? (
          <>
            {/* Upload Field */}
            <div className="flex flex-row items-center border-t-1 pt-2 mb-2 border-gray-300">
              <span className="basis-1/4">Avatar</span>
              <span className="basis-2/4">
                <Upload
                  className="label-form-Item"
                  maxCount={1}
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                >
                  {fileList.length >= 1 ? null : uploadButton}
                </Upload>
                {previewItem && (
                  <Image
                    wrapperStyle={{
                      display: "none",
                    }}
                    preview={{
                      visible: previewOpen,
                      onVisibleChange: (visible) => setPreviewOpen(visible),
                      afterOpenChange: (visible) =>
                        !visible && setPreviewItem(""),
                    }}
                    src={previewItem}
                  />
                )}
              </span>
            </div>
          </>
        ) : null}
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
            <div
              className="flex flex-row items-center border-t-1 pt-4 mb-4 border-gray-300"
            >
              <span className="basis-1/4 capitalize">Current Password</span>
              <span className="basis-2/4">
                <Input.Password
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter your current password"
                  prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                  status={passwordErrors.currentPassword ? "error" : ""}
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
                {passwordErrors.currentPassword && (
                  <div className="text-red-500 text-xs mt-1">{passwordErrors.currentPassword}</div>
                )}
              </span>
            </div>

            <div
              className="flex flex-row items-center border-t-1 pt-4 mb-4 border-gray-300"
            >
              <span className="basis-1/4 capitalize">New Password</span>
              <span className="basis-2/4">
                <Input.Password
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter your new password"
                  prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                  status={passwordErrors.newPassword ? "error" : ""}
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
                {passwordErrors.newPassword && (
                  <div className="text-red-500 text-xs mt-1">{passwordErrors.newPassword}</div>
                )}
              </span>
            </div>

            <div
              className="flex flex-row items-center border-t-1 pt-4 mb-4 border-gray-300"
            >
              <span className="basis-1/4 capitalize">Confirm New Password</span>
              <span className="basis-2/4">
                <Input.Password
                  name="confirmNewPassword"
                  value={passwordData.confirmNewPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm your new password"
                  prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                  status={passwordErrors.confirmNewPassword ? "error" : ""}
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
                {passwordErrors.confirmNewPassword && (
                  <div className="text-red-500 text-xs mt-1">{passwordErrors.confirmNewPassword}</div>
                )}
              </span>
            </div>
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
            onClick={resetPassword ? handleResetPassword : handleUpdateProfile}
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
