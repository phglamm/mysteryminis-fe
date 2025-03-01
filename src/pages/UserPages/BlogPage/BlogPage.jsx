import React, { useEffect, useState } from "react";
import { Pagination } from "antd";
import api from "../../../config/api"; // Ensure the correct path to api.jsx
import "./BlogPage.scss";
import { Link } from "react-router-dom";

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]); // Store blogs fetched from API
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [totalBlogs, setTotalBlogs] = useState(0); // Track total number of blogs

  const pageSize = 6; // Number of blogs per page

  // Fetch data from API
  const fetchBlogs = async () => {
    try {
      const response = await api.get("BlogPost");

      // Check if the response is JSON
      const contentType = response.headers["content-type"];
      if (contentType && contentType.includes("application/json")) {
        const data = response.data; // Parse JSON response
        setBlogs(data); // Set data into state
        setTotalBlogs(data.length); // Set total blogs count for pagination
        console.log(data);
      } else {
        console.error("Expected JSON, but got:", contentType);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    fetchBlogs(); // Call the function when component mounts
  }, []); // Empty dependency array ensures this runs only once after the component mounts

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page); // Update the current page
  };

  // Slice the blogs to get only the ones for the current page
  const paginatedBlogs = blogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="bg-gray-100 min-h-screen p-4 pt-[8%] h-fit">
      {/* Header Banner */}
      <div className="relative w-full bg-cover bg-center">
        <img
          src="https://cdn.shopify.com/s/files/1/0773/9165/9282/files/cimmybanner2_1200x.jpg?v=1698568735"
          alt="Banner"
          className="w-full h-fit object-cover"
        />
      </div>

      <div className="grid grid-cols-3 gap-10 p-6 mt-5">
        {paginatedBlogs.map((blog, index) => (
          <Link
            to={`/blog/${blog.blogPostId}`}
            key={index}
            className="text-center transition-transform transform hover:scale-105"
          >
            <div className="w-80 h-60 mx-auto overflow-hidden flex items-center justify-center">
              <img
                src={blog.blogPostImage}
                alt={blog.blogPostTitle}
                className="max-w-full h-60 object-contain transition-transform transform hover:scale-110"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mt-4 hover:text-red-500">
              {blog.blogPostTitle}
            </h3>
            {blog.blogPostContent && (
              <p className="text-gray-600 mt-2">
                {blog.blogPostContent.slice(0, 100)}...
              </p>
            )}
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center my-6">
        <Pagination
          current={currentPage}
          total={totalBlogs}
          pageSize={pageSize}
          onChange={handlePageChange} // Handle page change
          className="custom-pagination"
        />
      </div>
    </div>
  );
};

export default BlogPage;
