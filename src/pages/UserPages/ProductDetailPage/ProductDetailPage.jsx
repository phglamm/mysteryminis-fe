import { useEffect, useState } from "react";
import { Button, Collapse, Row, Col, Spin, Rate } from "antd";
import ReactImageGallery from "react-image-gallery";
import CardProduct from "../../../components/CardProduct/CardProduct"; // Import CardProduct
import "react-image-gallery/styles/css/image-gallery.css";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import api from "../../../config/api";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, clearCart } from "../../../Redux/features/cartSlice";
import "./ProductDetailPage.scss";
import {
  addToFavorite,
  removeFromFavorite,
  selectFavoriteItems,
} from "../../../Redux/features/favoriteSlice";
import toast from "react-hot-toast";
import moment from "moment";
const { Panel } = Collapse;

const ProductDetailPage = () => {
  const [chooseOption, setChooseOption] = useState(null);
  const [selectedOptionName, setSelectedOptionName] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [isOutOfStock, setIsOutOfStock] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const [box, setBox] = useState();
  const [relevantBox, setRelevantBox] = useState([]);
  const [displayedVotes, setDisplayedVotes] = useState([]);
  const [showAllComments, setShowAllComments] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const { id } = useParams();
  const dispatch = useDispatch();
  const favoriteItems = useSelector(selectFavoriteItems);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBoxDetail = async () => {
      setLoading(true);
      try {
        const response = await api.get(`Box/withDTO/${id}`);
        console.log(response.data);
        setBox(response.data);
        const defaultOption = response.data.boxOptions.reduce(
          (minOption, option) => {
            return option.displayPrice < minOption.displayPrice
              ? option
              : minOption;
          },
          response.data.boxOptions[0]
        );
        setSelectedOptionName(defaultOption.boxOptionName);
        setSelectedPrice(defaultOption.displayPrice);
        setChooseOption(defaultOption);
        setIsOutOfStock(defaultOption.boxOptionStock === 0);
      } catch (error) {
        console.log("Failed to fetch box detail: ", error);
        toast.error("Failed to fetch box detail");
      }
      setLoading(false);
    };
    fetchBoxDetail();
  }, [id]);

  useEffect(() => {
    if (box) {
      const fetchRelevantBox = async () => {
        const response = await api.get(`Box`);
        // console.log(response.data);
        const filterResponse = response.data.filter(
          (relevantBox) =>
            relevantBox.brandName === box.brandName &&
            relevantBox.boxId !== box.boxId
        );
        setRelevantBox(filterResponse);
      };
      fetchRelevantBox();
    }
  }, [box]);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await api.get(`/Feedback/boxes/${id}/feedback`);
        setDisplayedVotes(response.data);
      } catch (error) {
        console.error("Failed to fetch feedback:", error);
      }
    };
    fetchFeedback();
  }, [id]);

  useEffect(() => {
    if (box) {
      setIsWishlisted(favoriteItems.some((item) => item.boxId === box.boxId));
    }
  }, [box, favoriteItems]);

  if (!box || loading) {
    return (
      <div className="w-full h-full min-h-screen  flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const handleOptionChange = (option) => {
    setSelectedOptionName(option.boxOptionName);
    setSelectedPrice(option.displayPrice);
    setIsOutOfStock(option.boxOptionStock === 0);
    setChooseOption(option);
    console.log("option choosing: ", option);
  };

  const handleAddToCart = () => {
    const selectedOption = box.boxOptions.find(
      (option) => option.boxOptionId === chooseOption.boxOptionId
    );
    const orderItemOpenRequestNumber = 0;
    console.log("Selected: ", selectedOption);
    if (selectedOption) {
      const boxToAdd = { ...box, selectedOption, orderItemOpenRequestNumber };
      console.log(boxToAdd);
      dispatch(addToCart(boxToAdd));
    }
    // dispatch(clearCart());
  };

  const handleToggleFavorite = () => {
    if (isWishlisted) {
      dispatch(removeFromFavorite({ boxId: box.boxId }));
    } else {
      dispatch(addToFavorite(box));
    }
    setIsWishlisted(!isWishlisted);
  };

  const boxImages = box?.boxImage.map((image) => ({
    original: image.boxImageUrl,
    thumbnail: image.boxImageUrl,
  }));


  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const calculateAverageRating = (votes) => {
    if (!votes || votes.length === 0) return 0;
    const totalRating = votes.reduce((acc, vote) => acc + vote.rating, 0);
    return (totalRating / votes.length).toFixed(1);
  };

  // Tính rating trung bình và tổng số feedbacks
  const averageRating = calculateAverageRating(displayedVotes);
  const totalFeedbackCount = displayedVotes.length;

  return (
    <div className="product-detail-page container mx-auto mt-[10%]">
      {/* Chi tiết sản phẩm */}
      <div className="grid grid-cols-2 gap-10">
        {/* Hình ảnh */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <ReactImageGallery items={boxImages} showNav={false} />
        </div>

        {/* Thông tin sản phẩm */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <h1 style={{ fontSize: "25px", fontWeight: "bold", color: "#333" }}>
            {box.boxName}
          </h1>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <Rate value={Number(averageRating)} disabled />
            <span>{averageRating} ({totalFeedbackCount} feedbacks)</span>
          </div>

          <p style={{ fontSize: "20px", color: "#e60000", fontWeight: "bold" }}>
            {formatPrice(selectedPrice)}
          </p>

          {/* Kích thước sản phẩm */}
          <div className="wrap">
            <h3 style={{ fontSize: "16px", fontWeight: "500", color: "#555" }}>
              Options
            </h3>
            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "8px",
                width: "100%",
              }}
            >
              {box.boxOptions.map((option, index) => (
                <button
                  key={option.boxOptionId}
                  style={{
                    padding: "10px 16px",
                    border:
                      chooseOption &&
                      chooseOption.boxOptionId === option.boxOptionId
                        ? "2px solid black"
                        : "1px solid #ccc",
                    borderRadius: "8px",
                    fontSize: "14px",
                    cursor: "pointer",
                    fontWeight:
                      chooseOption &&
                      chooseOption.boxOptionId === option.boxOptionId
                        ? "bold"
                        : "normal",
                    backgroundColor:
                      chooseOption &&
                      chooseOption.boxOptionId === option.boxOptionId
                        ? "#fff"
                        : "#f0f0f0",
                    color: "#333",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    boxShadow:
                      chooseOption &&
                      chooseOption.boxOptionId === option.boxOptionId
                        ? "0 0 5px rgba(0,0,0,0.3)"
                        : "none",
                    minWidth: "150px",
                    minHeight: "40px",
                    boxSizing: "border-box",
                  }}
                  onClick={() => handleOptionChange(option)}
                >
                  {option.boxOptionName}
                </button>
              ))}
            </div>
          </div>

          {/* Nút CTA */}
          <Button
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "16px",
              fontWeight: "500",
              backgroundColor: isOutOfStock ? "#ccc" : "#000", // Black background color
              color: "#fff",
              height: "50px",
            }}
            disabled={isOutOfStock}
            onClick={handleAddToCart}
          >
            {isOutOfStock ? "NOTIFY ME WHEN AVAILABLE" : "ADD TO CART"}
          </Button>

          {/* Add to Wishlist Button */}
          <Button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "16px",
              fontWeight: "500",
              border: "1px solid #ccc",
              borderRadius: "8px",
              backgroundColor: isWishlisted ? "#ffebee" : "#fff",
              color: isWishlisted ? "#e60000" : "#313857",
              padding: "10px 16px",
              transition: "all 0.3s",
              width: "40%",
              height: "50px",
            }}
            onClick={handleToggleFavorite}
          >
            {isWishlisted ? (
              <HeartFilled style={{ color: "#e60000" }} />
            ) : (
              <HeartOutlined style={{ color: "#ccc" }} />
            )}
            {isWishlisted ? "Already in Favorites" : "Add to Favorites"}
          </Button>

          {/* Thông tin chi tiết */}
          <Collapse
            defaultActiveKey={[]}
            style={{
              marginTop: "16px",
              border: "none",
              backgroundColor: "transparent",
            }}
          >
            <Panel style={{ fontSize: "20px" }} header="Details" key="1">
              <p style={{ color: "#555" }}>
                <strong>Brand:</strong> {box.brandName}
              </p>
              <p style={{ color: "#555" }}>
                <strong>Size:</strong>{" "}
                {selectedOptionName || box.boxOptions[0].boxOptionName}
              </p>
            </Panel>
          </Collapse>
        </div>
      </div>

      {/* Tất cả đánh giá */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Feedback</h2>
        {displayedVotes.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-4">
              {displayedVotes.slice(0, showAllComments ? undefined : 3).map((vote) => (
                <div key={vote.feedbackId} className="p-4 rounded-lg shadow-md">
                  <p className="text-lg">
                    <strong>User: </strong> {vote.userName}
                  </p>
                  <p className="text-lg">
                    <strong>Content: </strong> 
                    {vote.feedbackContent}
                  </p>
                  <p className="text-lg">
                    <strong>Rating: </strong> <Rate value={vote.rating} disabled />
                  </p>
                  <p className="text-lg">
                    <strong>Date: </strong>{" "}
                    {moment(vote.updatedAt).format("DD-MM-YYYY")}
                  </p>
                  {/* Hiển thị hình ảnh từ imageUrl trong feedback */}
                  {vote.imageUrl && (
                    <img
                      src={vote.imageUrl}
                      alt="Feedback image"
                      style={{ width: "10%", height: "auto", marginTop: "10px" }}
                    />
                  )}
                </div>
              ))}
            </div>
            {displayedVotes.length > 3 && (
              <div className="mt-4 text-center">
                <Button
                  className="!bg-blue-300 !text-white !font-bold !rounded-lg"
                  onClick={() => setShowAllComments(!showAllComments)}
                >
                  {showAllComments ? "Show Less" : "Show More"}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-lg text-center text-gray-500">
            No feedback yet.
          </div>
        )}
      </div>

      {/* Danh sách sản phẩm liên quan */}
      {relevantBox.length > 0 && (
        <div style={{ marginTop: "50px" }}>
          <h2
            style={{
              fontSize: "22px",
              fontWeight: "bold",
              color: "#333",
              marginBottom: "16px",
            }}
          >
            Sản phẩm liên quan
          </h2>
          <Row gutter={[16, 16]}>
            {relevantBox.map((product, index) => (
              <Col key={index} xs={24} sm={12} md={8} lg={6}>
                <CardProduct product={product} />
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
