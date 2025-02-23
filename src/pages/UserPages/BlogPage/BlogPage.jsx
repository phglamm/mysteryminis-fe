import React from "react";
import { Pagination } from "antd";
import "./BlogPage.scss";

const blogs = [
  {
    title: "ÁNH TRĂNG THƠ MỘNG CỦA WENDY",
    image: "https://bizweb.dktcdn.net/thumb/large/100/357/932/articles/cover-3.jpg?v=1738687679983",
  },
  {
    title: "MUA SẮM ĐẦU NĂM CÙNG RICO NAO00",
    image: "https://bizweb.dktcdn.net/thumb/large/100/357/932/articles/rico-cover.jpg?v=1738339373827",
  },
  {
    title: "GIA NHẬP ĐOÀN LÂN SƯ RỒNG WASA",
    image: "https://bizweb.dktcdn.net/thumb/large/100/357/932/articles/wasa-full.png?v=1738160002900",
  },
  {
    title: "BẠN CÓ MUỐN THAM GIA SQUID GAME?",
    image: "https://bizweb.dktcdn.net/thumb/large/100/357/932/articles/squid-full.jpg?v=1737899587377",
    description:
      "Với sự thành công vang dội của bộ phim truyền hình Squid Game trên Netflix, không có gì ngạc nhiên khi...",
  },
  {
    title: "MR. PA VÀ CHUYẾN DU LỊCH TRUNG HOA",
    image: "https://bizweb.dktcdn.net/thumb/large/100/357/932/articles/pa-1.jpg?v=1737301834993",
    description:
      "Trở lại với series blind box PA National Essence Travel Notes, chàng kiến trúc Mr Pa hóa thân thành một kẻ sĩ khám phá...",
  },
  {
    title: "SỰ TRỞ LẠI CỦA TỀU VÀ LÀNG TOYS",
    image: "https://bizweb.dktcdn.net/100/357/932/files/teu.jpg?v=1737626680102",
    description:
      "Chú Tễu Ngồi Sao - nhân vật nổi bật từ Xóm Rối trong vũ trụ Làng Toys, đã chính thức trở lại với phiên bản mới Ver 02...",
  },
];

const BlogPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-4 mt-24">
      {/* Header Banner */}
      <div className="relative w-full bg-cover bg-center" >
        <img src="https://cdn.shopify.com/s/files/1/0773/9165/9282/files/cimmybanner2_1200x.jpg?v=1698568735" 
        alt="Banner" 
        className="w-full h-fit object-cover" />
      </div>

      <div className="grid grid-cols-3 gap-10 p-6 mt-5">
        {blogs.map((blog, index) => (
          <div key={index} className="text-center transition-transform transform hover:scale-105">
            <div className="w-80 h-60 mx-auto overflow-hidden flex items-center justify-center">
              <img src={blog.image} alt={blog.title} className="max-w-full h-60 object-contain transition-transform transform hover:scale-110" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mt-4 hover:text-red-500">{blog.title}</h3>
            {blog.description && <p className="text-gray-600 mt-2">{blog.description}</p>}
          </div>
        ))}
      </div>

      <div className="flex justify-center my-6">
        <Pagination 
          defaultCurrent={2} 
          total={10} 
          pageSize={9} 
          className="custom-pagination"
        />
      </div>

    </div>
  );
};

export default BlogPage;
