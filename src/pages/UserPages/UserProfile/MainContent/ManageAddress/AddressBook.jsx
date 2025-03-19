/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../../Redux/features/counterSlice";
import AddressPUT from "./AddressPUT";
import { Spin } from "antd";
import { EditOutlined } from "@ant-design/icons";
import AddressPOST from "./AddressPOST";
import { getUserAddresses } from "../../../../../services/UserServices/AddressServices/AddressServices";

const AddressBook = ({
  isEditing,
  setIsEditing,
  addAddress,
  setAddAddress,
}) => {
  const [addresses, setAddresses] = useState([]);
  const user = useSelector(selectUser);
  const [selectedAddress, setSelectedAddress] = useState(null);


  useEffect(() => {
    if (user.userId) {
      getUserAddresses(user.userId)
        .then((fetchedAddresses) => setAddresses(fetchedAddresses))
        .catch((err) => console.log(err.message));
    }
  }, [user.userId, isEditing]);

  return (
    <div>
      {addAddress ? (
        <AddressPOST setAddAddress={setAddAddress} />
      ) : isEditing ? (
        <AddressPUT
          setIsEditing={setIsEditing}
          selectedAddress={selectedAddress}
        />
      ) : (
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
      )}
    </div>
  );
};

export default AddressBook;
