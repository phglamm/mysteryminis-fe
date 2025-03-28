import { Button, Card, Empty, List } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromFavorite,
  selectFavoriteItems,
} from "../../../Redux/features/favoriteSlice";
import { motion } from "framer-motion";
import { DeleteOutlined, DoubleRightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { route } from "../../../routes";

export default function FavoritePage() {
  const dispatch = useDispatch();
  const favoriteItems = useSelector(selectFavoriteItems);
  const navigate = useNavigate();
  return (
    <div className="mt-[10%] container mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">My Favorite Items</h1>
      {favoriteItems.length === 0 ? (
        <Empty
          description="No favorite items"
          className="my-10"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <List
          grid={{ gutter: 16, column: 4 }}
          dataSource={favoriteItems}
          renderItem={(item) => (
            <List.Item>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring", damping: 10 }}
              >
                <Card
                  hoverable
                  cover={
                    <img
                      alt={item.boxName}
                      src={item.boxImage[0]?.boxImageUrl}
                      className="h-48 object-cover"
                    />
                  }
                  actions={[
                    <Button
                      key={item.boxId}
                      type="primary"
                      danger
                      icon={<DoubleRightOutlined />}
                      onClick={() => {
                        navigate(`${route.productDetail}/${item.boxId}`);
                      }}
                    >
                      Go to Box
                    </Button>,
                    <Button
                      key={item.boxId}
                      type="primary"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => {
                        dispatch(removeFromFavorite({ boxId: item.boxId }));
                      }}
                    >
                      Remove
                    </Button>,
                  ]}
                  className="rounded-lg shadow-md"
                >
                  <Card.Meta
                    title={
                      <>
                        <span className="font-semibold">{item.boxName}</span>
                      </>
                    }
                    description={
                      <>
                        <p className="font-semibold text-black text-md">
                          Brand: {item.brandName}
                        </p>
                      </>
                    }
                  />
                </Card>
              </motion.div>
            </List.Item>
          )}
        />
      )}
    </div>
  );
}
