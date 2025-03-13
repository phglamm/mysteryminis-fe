import React, { useEffect, useState } from "react";
import { Table, Button, Tag, Modal, Form, Input, DatePicker, InputNumber } from "antd";
import axios from "axios";
import api from "../../../config/api";

const ManageVoucher = () => {
    const [vouchers, setVouchers] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchVouchers();
    }, []);

    const fetchVouchers = async () => {
        try {
            const response = await api.get("Voucher");
            setVouchers(response.data);
        } catch (error) {
            console.error("Error fetching vouchers:", error);
        }
    };

    const handleCreate = async (values) => {
        try {
            await api.post("Voucher", values, {
            });
            fetchVouchers();
            setIsModalVisible(false);
            form.resetFields();
        } catch (error) {
            console.error("Error creating voucher:", error.response ? error.response.data : error);
        }
    };
    

    const columns = [
        {
            title: "ID",
            dataIndex: "voucherId",
            key: "voucherId",
        },
        {
            title: "Name",
            dataIndex: "voucherName",
            key: "voucherName",
        },
        {
            title: "Code",
            dataIndex: "voucherCode",
            key: "voucherCode",
        },
        {
            title: "Discount",
            dataIndex: "voucherDiscount",
            key: "voucherDiscount",
            render: (discount) => `${discount}%`,
        },
        {
            title: "Start Date",
            dataIndex: "voucherStartDate",
            key: "voucherStartDate",
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: "End Date",
            dataIndex: "voucherEndDate",
            key: "voucherEndDate",
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: "Max Discount",
            dataIndex: "maxDiscount",
            key: "maxDiscount",
            render: (amount) => `$${amount}`,
        },
        {
            title: "Status",
            dataIndex: "isDeleted",
            key: "isDeleted",
            render: (isDeleted) => (
                <Tag color={isDeleted ? "red" : "green"}>{isDeleted ? "Inactive" : "Active"}</Tag>
            ),
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <>
                    <Button
                        type="primary"
                        style={{ backgroundColor: "#313857", borderColor: "#FFF1F2", color: "#FFF1F2" }}
                        // onClick={() => handleEdit(record)}
                    >
                        Update
                    </Button>
                    <Button
                        type="default"
                        style={{ backgroundColor: "#ff4d4f", borderColor: "#ff4d4f", color: "#fff" }}
                        // onClick={() => handleDelete(record.voucherId)}
                    >
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    return (
        <div style={{ padding: 20, maxWidth: "100%", overflowX: "auto" }}>
            <h2 style={{ fontSize: "30px" }}>Manage Vouchers</h2>
            <Button type="primary"
                style={{
                    marginBottom: 16,
                    backgroundColor: "#313857",
                    borderColor: "#FFF1F2",
                    color: "#FFF1F2",
                }}
                onClick={() => setIsModalVisible(true)}
            >
                Create Voucher
            </Button>
            <Table
                columns={columns}
                dataSource={vouchers}
                rowKey="voucherId"
                scroll={{ x: "max-content" }}
            />

            <Modal
                title="Create Voucher"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleCreate}>
                    <Form.Item name="voucherName" label="Voucher Name" rules={[{ required: true }]}> 
                        <Input />
                    </Form.Item>
                    <Form.Item name="voucherCode" label="Voucher Code" rules={[{ required: true }]}> 
                        <Input />
                    </Form.Item>
                    <Form.Item name="voucherDiscount" label="Discount (%)" rules={[{ required: true }]}> 
                        <InputNumber min={0} max={100} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item name="voucherStartDate" label="Start Date" rules={[{ required: true }]}> 
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item name="voucherEndDate" label="End Date" rules={[{ required: true }]}> 
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item name="maxDiscount" label="Max Discount ($)" rules={[{ required: true }]}> 
                        <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                        <Button
                            style={{ backgroundColor: "#ff4d4f", borderColor: "#ff4d4f", color: "#fff" }}
                            onClick={() => setIsModalVisible(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit"
                            style={{ backgroundColor: "#313857", borderColor: "#FFF1F2", color: "#FFF1F2" }}
                        >
                            OK
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default ManageVoucher;
