/* eslint-disable no-unused-vars */
import { Button, Form, Table, Modal, Input, Select } from "antd";
import { useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";
import toast from "react-hot-toast";
import {
  addBlog,
  deleteBlog,
  getAllBlogs,
  updateBlog,
} from "../../../services/AdminServices/ManageBlogServices/ManageBlogServices";

export default function ManageBlog() {
  const [formAdd] = useForm();
  const [formUpdate] = useForm();

  const [blogs, setBlogs] = useState([]);
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const [isModalViewContent, setIsModalViewContent] = useState(false);
  const [selectedContent, setSelectedContent] = useState("");
  // Fetch all blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await getAllBlogs();
        setBlogs(data);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      }
    };
    fetchBlogs();
  }, []);

  // Handle adding new blog
  const handleAdd = async (values) => {
    try {
      const newBlog = await addBlog(values);
      setBlogs([...blogs, newBlog]);
      toast.success("Blog added successfully");
      setIsModalAddOpen(false);
      formAdd.resetFields();
    } catch (error) {
      toast.error("Failed to add blog");
    }
  };
  const showViewContent = (text) => {
    setIsModalViewContent(true);
    console.log(text);
    setSelectedContent(text);
  };
  // Handle updating a blog
  const handleModalUpdate = (blog) => {
    setSelectedBlog(blog);
    formUpdate.setFieldsValue(blog);
    setIsModalUpdateOpen(true);
  };

  const handleUpdate = async (values) => {
    try {
      await updateBlog(selectedBlog.blogPostId, values);
      setBlogs(
        blogs.map((blog) =>
          blog.blogPostId === selectedBlog.blogPostId
            ? { ...blog, ...values }
            : blog
        )
      );
      toast.success("Blog updated successfully");
      setIsModalUpdateOpen(false);
      setSelectedBlog(null);
    } catch (error) {
      toast.error("Failed to update blog");
    }
  };

  // Handle deleting a blog
  const handleDelete = (blogId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this blog?",
      onOk: async () => {
        try {
          await deleteBlog(blogId);
          setBlogs(blogs.filter((blog) => blog.blogPostId !== blogId));
          toast.success("Blog deleted successfully");
        } catch (error) {
          toast.error("Failed to delete blog");
        }
      },
    });
  };

  const columnsBlog = [
    {
      title: "ID",
      dataIndex: "blogPostId",
      key: "blogPostId",
      sorter: (a, b) => a.blogPostId - b.blogPostId,
    },
    {
      title: "Title",
      dataIndex: "blogPostTitle",
      key: "blogPostTitle",
      filters: [
        ...new Set(
          blogs.map((item) => ({
            text: item.blogPostTitle,
            value: item.blogPostTitle,
          }))
        ),
      ],
      onFilter: (value, record) => record.blogPostTitle === value,
      filterSearch: true,
    },
    {
      title: "Content",
      dataIndex: "blogPostContent",
      key: "blogPostContent",
      render: (text) => (
        <>
          <Button onClick={() => showViewContent(text)}> View Content</Button>
        </>
      ),
    },
    {
      title: "Image",
      dataIndex: "blogPostImage",
      key: "blogPostImage",
      render: (image) => <img src={image} alt="Blog" width={50} />,
    },
    {
      title: "Action",
      render: (_text, record) => (
        <div>
          <Button onClick={() => handleModalUpdate(record)}>Update</Button>
          <Button
            onClick={() => handleDelete(record.blogPostId)}
            type="danger"
            style={{ marginLeft: 10 }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Button className="mb-5" onClick={() => setIsModalAddOpen(true)}>
        Create Blog
      </Button>

      <Table dataSource={blogs} columns={columnsBlog} rowKey="blogPostId" />

      {/* Add Blog Modal */}
      <Modal
        title="Add Blog"
        visible={isModalAddOpen}
        onCancel={() => {
          setIsModalAddOpen(false);
          formAdd.resetFields();
        }}
        onOk={() => formAdd.submit()}
      >
        <Form form={formAdd} layout="vertical" onFinish={handleAdd}>
          <Form.Item
            name="blogPostTitle"
            label="Blog Title"
            rules={[{ required: true, message: "Please enter the blog title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="blogPostContent"
            label="Blog Content"
            rules={[
              { required: true, message: "Please enter the blog content" },
            ]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="blogPostImage"
            label="Blog Image URL"
            rules={[
              { required: true, message: "Please enter the blog image URL" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Update Blog Modal */}
      <Modal
        title="Update Blog"
        visible={isModalUpdateOpen}
        onCancel={() => setIsModalUpdateOpen(false)}
        onOk={() => formUpdate.submit()}
      >
        <Form form={formUpdate} layout="vertical" onFinish={handleUpdate}>
          <Form.Item
            name="blogPostTitle"
            label="Blog Title"
            rules={[{ required: true, message: "Please enter the blog title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="blogPostContent"
            label="Blog Content"
            rules={[
              { required: true, message: "Please enter the blog content" },
            ]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="blogPostImage"
            label="Blog Image URL"
            rules={[
              { required: true, message: "Please enter the blog image URL" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        visible={isModalViewContent}
        title="Blog Content"
        onCancel={() => setIsModalViewContent(false)}
        footer={null}
      >
        <p>{selectedContent}</p>
      </Modal>
    </div>
  );
}
