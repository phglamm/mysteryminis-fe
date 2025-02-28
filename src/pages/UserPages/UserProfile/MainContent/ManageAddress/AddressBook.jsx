/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../../Redux/features/counterSlice";
import api from "../../../../../config/api";
import AddressPUT from "./AddressPUT";
import { Spin } from "antd";
import { EditOutlined } from "@ant-design/icons";

const AddressBook = ({ isEditing, setIsEditing }) => {
  const [addresses, setAddresses] = useState([]); // Khởi tạo với mảng rỗng

  const user = useSelector(selectUser);
  console.log(isEditing);
  const [selectedAddress, setSelectedAddress] = useState(null);
  console.log(selectedAddress);
  const fetchAddress = async () => {
    try {
      const response = await api.get(`/Address/?userId=${user.userId}`);
      const fetchedAddresses = Array.isArray(response.data)
        ? response.data
        : [response.data];
      setAddresses(fetchedAddresses);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    if (user.userId) {
      fetchAddress();
    }
  }, [user.userId, isEditing]);

  return (
    <div>
      {!isEditing ? (
        <div className="h-[30vw] pb-28 overflow-y-auto">
          {addresses.length === 0 ? (
            <p className="w-full h-full flex justify-center items-center">
              <Spin size="large" />
            </p>
          ) : (
            addresses.map((address) => (
              <motion.div key={address.addressId} className="p-4 border-b">
                <span className="flex flex-row">
                  <span className="flex flex-col w-[30%]">
                    <span className="text-[1vw]">{address.name}</span>
                    <span className="text-[0.9vw] text-gray-400">
                      {address.phoneNumber}
                    </span>
                  </span>
                  <span className="text-[1.2vw] items-center flex text-center w-[60%] text-gray-400">
                    {address.addressDetail}, {address.ward}, {address.district},{" "}
                    {address.province}
                  </span>
                  <span
                    onClick={() => {
                      setIsEditing(true);
                      setSelectedAddress(address);
                    }}
                    className="w-[10%] flex justify-end items-center"
                  >
                    <EditOutlined />
                  </span>
                </span>
              </motion.div>
            ))
          )}
        </div>
      ) : (
        <AddressPUT
          setIsEditing={setIsEditing}
          selectedAddress={selectedAddress}
        />
      )}
    </div>
  );
};

export default AddressBook;
