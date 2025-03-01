import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Breadcrumb, Typography, Image } from "antd";
import api from "../../../config/api"; // Import API config

const { Title, Paragraph } = Typography;

const BlogDetail = () => {
  const { blogPostId } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("Ẩn danh");
  const [allBlogs, setAllBlogs] = useState([]);
  const [previousPost, setPreviousPost] = useState(null);
  const [nextPost, setNextPost] = useState(null);

  useEffect(() => {
    // Fetch bài viết hiện tại
    api.get(`/BlogPost/v2/${blogPostId}`)
      .then((res) => {
        setBlog(res.data);
        setLoading(false);

        if (res.data.author?.username) {
          setUsername(res.data.author.username);
        } else if (res.data.author?.userId) {
          api.get(`/User/${res.data.author.userId}`)
            .then((userRes) => setUsername(userRes.data.username))
            .catch(() => setUsername("Ẩn danh"));
        }
      })
      .catch((err) => {
        console.error("Lỗi fetch bài blog:", err);
        setBlog(null);
        setLoading(false);
      });

    // Fetch toàn bộ danh sách blog để tìm previousId và nextId
    api.get(`/BlogPost`)
      .then((res) => {
        setAllBlogs(res.data);
      })
      .catch((err) => console.error("Lỗi fetch danh sách bài blog:", err));
  }, [blogPostId]);

  useEffect(() => {
    if (allBlogs.length > 0 && blog) {
      const currentIndex = allBlogs.findIndex((post) => post.blogPostId === parseInt(blogPostId));
      if (currentIndex > 0) setPreviousPost(allBlogs[currentIndex - 1]);
      if (currentIndex < allBlogs.length - 1) setNextPost(allBlogs[currentIndex + 1]);
    }
  }, [allBlogs, blog, blogPostId]);

  if (loading) return <p className="text-center mt-10">Đang tải bài viết...</p>;
  if (!blog) return <p className="text-center mt-10 text-red-500">Bài viết không tồn tại!</p>;

  return (
    <div className="mt-30">
      {/* Breadcrumb */}
      <div style={{ marginLeft: "5%" }}>
        <Breadcrumb
          items={[
            { title: <Link to="/">Home</Link> },
            { title: <Link to="/blog">Blog</Link> },
            { title: blog.blogPostTitle },
          ]}
        />
      </div>

      {/* Nội dung bài viết */}
      <div className="max-w-5xl mx-auto py-10">
        <Title level={2} className="text-center">{blog.blogPostTitle}</Title>
        <Paragraph className="text-center text-gray-500 text-sm mb-8">
          ĐĂNG BỞI <strong>{username}</strong> VÀO LÚC {blog.date || "Không có ngày"}
        </Paragraph>

        <Paragraph className="text-gray-700 leading-relaxed mb-6">
          {blog.blogPostContent}
        </Paragraph>

        {blog.blogPostImage && (
          <div className="flex justify-center">
            <Image src={blog.blogPostImage} alt={blog.blogPostTitle} className="rounded-lg shadow-md" />
          </div>
        )}
      </div>

      {/* Nút lên đầu trang */}
      <div className="fixed bottom-10 right-5 flex flex-col items-center">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
          className="text-sm text-gray-600 hover:text-gray-900 transition-all cursor-pointer"
        >
          ← Lên đầu trang
        </a>
      </div>

      {/* Điều hướng bài viết */}
      <div className="bg-black text-white py-4 px-15 mt-10 flex justify-between items-center">
        <div className="truncate">
          <span className="font-bold">Bạn đang xem: </span>{blog.blogPostTitle}
        </div>
        <div className="flex items-center space-x-4">
          {previousPost ? (
            <Link to={`/blog/${previousPost.blogPostId}`} className="text-gray-300 hover:text-white">
              &lt; Bài trước
            </Link>
          ) : (
            <span className="text-gray-500">&lt; Bài trước</span>
          )}
          <span className="text-gray-500">|</span>
          {nextPost ? (
            <Link to={`/blog/${nextPost.blogPostId}`} className="text-gray-300 hover:text-white">
              Bài sau &gt;
            </Link>
          ) : (
            <span className="text-gray-500">Bài sau &gt;</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
