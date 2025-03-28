/* eslint-disable react/no-unescaped-entities */
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
  const [timeoutMessage, setTimeoutMessage] = useState(false); // New state for timeout message
  const user = useSelector(selectUser);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    setIsEditing(false); // Reset isEditing when the component mounts
    setAddAddress(false); // Reset addAddress when the component mounts
  }, []);
  
  useEffect(() => {
    if (user.userId) {
      getUserAddresses(user.userId)
        .then((fetchedAddresses) => {
          setAddresses(fetchedAddresses);
          setTimeoutMessage(false); // Reset timeout message if addresses are fetched
        })
        .catch((err) => console.log(err.message));
    }

    // Set a timeout to display the message if addresses remain empty
    const timeout = setTimeout(() => {
      if (addresses.length === 0) {
        setTimeoutMessage(true);
      }
    }, 5000); // 5 seconds timeout

    return () => clearTimeout(timeout); // Cleanup timeout on component unmount or re-render
  }, [user.userId, isEditing, addresses.length]);

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
          {timeoutMessage ? (
            <p className="w-full h-full flex justify-center items-center text-gray-500">
              You don't have any addresses yet.
            </p>
          ) : addresses.length === 0 ? (
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
