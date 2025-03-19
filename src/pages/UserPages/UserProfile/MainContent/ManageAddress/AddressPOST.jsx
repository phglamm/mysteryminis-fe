/* eslint-disable react/prop-types */
import { Input, Select } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { UserOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { selectUser } from "../../../../../Redux/features/counterSlice";
import { addAddress, fetchDistricts, fetchProvinces, fetchWards } from "../../../../../services/UserServices/AddressServices/AddressServices";

const { Option } = Select;

const AddressPOST = ({ setAddAddress }) => {
  const user = useSelector(selectUser);
  const [loading, setLoading] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);


  const [formData, setFormData] = useState({
    phoneNumber: "",
    name: "",
    provinceId: null,
    province: null,
    districtId: null,
    district: null,
    wardCode: null,
    ward: null,
    addressDetail: "",
    userId: user.userId,
    note: "",
  });

 

  useEffect(() => {
    fetchProvinces().then(setProvinces);
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateAddress = async () => {
    setLoading(true);
    try {
      await addAddress(formData);
      toast.success("Address added successfully!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
      setAddAddress(false);
    }
  };

  return (
    <div>
      {/* Name & Phone Number Inputs */}
      {["name", "phoneNumber", "addressDetail"].map((field) => (
        <div
          key={field}
          className="flex flex-row items-center border-t pt-4 mb-4 border-gray-300"
        >
          <span className="basis-1/4 capitalize">
            {field.replace(/([A-Z])/g, " $1").trim()}
          </span>
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
      ))}

      {/* Province Select */}
      <div className="flex flex-row items-center border-t pt-4 mb-4 border-gray-300">
        <span className="basis-1/3 px-9 text-center ">
          <Select
            style={{ width: "100%" }}
            placeholder="Select Province"
            value={formData.provinceId}
            onChange={(value) => {
              const selectedProvince = provinces.find(
                (p) => p.ProvinceID === value
              );
              setFormData((prev) => ({
                ...prev,
                provinceId: value,
                province: selectedProvince
                  ? selectedProvince.ProvinceName
                  : null, // Lưu thêm Province Name
                districtId: null, // Reset khi đổi tỉnh
                district: null,
                wardCode: null,
                ward: null,
              }));
              fetchDistricts(value).then(setDistricts);
            }}
          >
            {provinces &&
              provinces.map((prov) => (
                <Option key={prov.ProvinceID} value={prov.ProvinceID}>
                  {prov.ProvinceName}
                </Option>
              ))}
          </Select>
        </span>
        <span className="basis-1/3 px-9 text-center ">
          <Select
            style={{ width: "100%" }}
            placeholder="Select District"
            value={formData.districtId}
            onChange={(value) => {
              const selectedDistrict = districts.find(
                (d) => d.DistrictID === value
              );
              setFormData((prev) => ({
                ...prev,
                districtId: value,
                district: selectedDistrict
                  ? selectedDistrict.DistrictName
                  : null, // Lưu thêm District Name
                wardCode: null,
                ward: null,
              }));
              fetchWards(value).then(setWards);
            }}
            disabled={!formData.provinceId}
          >
            {districts &&
              districts.map((dist) => (
                <Option key={dist.DistrictID} value={dist.DistrictID}>
                  {dist.DistrictName}
                </Option>
              ))}
          </Select>
        </span>

        <span className="basis-1/3 px-9 text-center ">
          <Select
            style={{ width: "100%" }}
            placeholder="Select Ward"
            value={formData.wardCode}
            onChange={(value) => {
              const selectedWard = wards.find((w) => w.WardCode === value);
              setFormData((prev) => ({
                ...prev,
                wardCode: value,
                ward: selectedWard ? selectedWard.WardName : null, // Lưu thêm Ward Name
              }));
            }}
            disabled={!formData.districtId}
          >
            {wards &&
              wards.map((ward) => (
                <Option key={ward.WardCode} value={ward.WardCode}>
                  {ward.WardName}
                </Option>
              ))}
          </Select>
        </span>
      </div>

      {/* Save Button */}
      <div className="flex justify-between">
        <motion.button
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
          onClick={handleUpdateAddress}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </motion.button>
      </div>
    </div>
  );
};

export default AddressPOST;