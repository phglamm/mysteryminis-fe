/* eslint-disable react/prop-types */
import { Input, Select } from "antd";
import { useState, useEffect } from "react";
import { UserOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";
import api from "../../../../../config/api";

const { Option } = Select;

const AddressPUT = ({ setIsEditing, selectedAddress }) => {
  const [loading, setLoading] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [formData, setFormData] = useState({
    addressId: selectedAddress.addressId || 0,
    phoneNumber: selectedAddress.phoneNumber || "",
    name: selectedAddress.name || "",
    provinceId: selectedAddress.provinceId || null,
    province: selectedAddress.province || "",
    districtId: selectedAddress.districtId || null,
    district: selectedAddress.district || "",
    wardCode: selectedAddress.wardCode || null,
    ward: selectedAddress.ward || "",
    addressDetail: selectedAddress.addressDetail || "",
    note: selectedAddress.note || "",
  });

  useEffect(() => {
    fetchProvinces();
    if (formData.provinceId) fetchDistricts(formData.provinceId);
    if (formData.districtId) fetchWards(formData.districtId);
  }, []);

  const fetchProvinces = async () => {
    try {
      const response = await axios.get("https://online-gateway.ghn.vn/shiip/public-api/master-data/province", {
        headers: { Token: "62417330-f6d2-11ef-91ea-021c91d80158" },
      });
      if (response.data.code === 200) setProvinces(response.data.data);
    } catch (err) {
      console.error("Error fetching provinces:", err);
    }
  };

  const fetchDistricts = async (provinceId) => {
    try {
      const response = await axios.get("https://online-gateway.ghn.vn/shiip/public-api/master-data/district", {
        headers: { Token: "62417330-f6d2-11ef-91ea-021c91d80158" },
      });
      if (response.data.code === 200) {
        setDistricts(response.data.data.filter((d) => d.ProvinceID === provinceId));
      }
    } catch (err) {
      console.error("Error fetching districts:", err);
    }
  };

  const fetchWards = async (districtId) => {
    try {
      const response = await axios.get("https://online-gateway.ghn.vn/shiip/public-api/master-data/ward", {
        params: { district_id: districtId },
        headers: { Token: "62417330-f6d2-11ef-91ea-021c91d80158" },
      });
      if (response.data.code === 200) setWards(response.data.data);
    } catch (err) {
      console.error("Error fetching wards:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const updateAddress = async () => {
    setLoading(true);
    try {
      await api.put(`Address`, formData);
      toast.success("Address updated successfully!");
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to update address");
      console.error("Error updating address:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {["name", "phoneNumber", "addressDetail"].map((field) => (
        <div key={field} className="flex flex-row items-center border-t pt-4 mb-4 border-gray-300">
          <span className="basis-1/4 capitalize">{field.replace(/([A-Z])/g, " $1").trim()}</span>
          <span className="basis-2/4">
            <Input
              name={field}
              value={formData[field]}
              onChange={handleChange}
              placeholder={`Enter your ${field}`}
              prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              suffix={<InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />}
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
            value={formData.province}
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
              fetchDistricts(value);
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
            value={formData.district}
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
              fetchWards(value);
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
            value={formData.ward}
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
          whileHover={{ scale: 1.1, backgroundColor: "red", color: "black", fontWeight: "bold" }}
          whileTap={{ scale: 0.9, backgroundColor: "black", color: "white", fontWeight: "bold" }}
          onClick={updateAddress}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </motion.button>
      </div>
    </div>
  );
};

export default AddressPUT;