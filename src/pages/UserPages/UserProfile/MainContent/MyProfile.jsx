/* eslint-disable react/prop-types */
import { InfoCircleOutlined, UserOutlined } from "@ant-design/icons";
import { Input, Tooltip, Spin, Select, message, Upload, Image } from "antd";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../Redux/features/counterSlice";
import { fetchUserData, updateUserProfile } from "../../../../services/UserServices/UserProfileServices/UserProfileServices";
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
