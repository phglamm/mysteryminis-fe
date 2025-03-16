import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../config/api";
import { Button, Collapse, Form, Rate, Spin } from "antd";
import { Modal } from "antd";
import { route } from "../../../routes";
import CardBoxItem from "../../../components/CardBoxItem/CardBoxItem";
import { motion } from "framer-motion";
import { useForm } from "antd/es/form/Form";
import { useSelector } from "react-redux";
import { selectUser } from "./../../../Redux/features/counterSlice";
import toast from "react-hot-toast";
import moment from "moment/moment";
const { Panel } = Collapse;

export default function BoxItemDetailPage() {
  const { boxItemId } = useParams();
  const [boxItem, setBoxItem] = useState();
  const [relevantBoxItem, setRelevantBoxItem] = useState([]);
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const [votes, setVotes] = useState([]);
  const [showAllComments, setShowAllComments] = useState(false);

  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const fetchBoxItemDetail = async () => {
    setLoading(true);
    try {
      const response = await api.get(`BoxItem/WithDTO/${boxItemId}`);
      console.log(response.data);
      setBoxItem(response.data);
    } catch (error) {
      console.error("Failed to fetch BoxItem:", error);
      toast.error("Failed to fetch BoxItem");
    }
    setLoading(false);
  };

  const fetchAllVotesByBoxItem = async () => {
    setLoading(true);
    try {
      const response = await api.get(`boxItem/${boxItemId}/votes`);
      console.log(response.data);
      setVotes(response.data);
    } catch (error) {
      console.error("Failed to fetch BoxItem:", error);
      toast.error("Failed to fetch BoxItem");
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchAllVotesByBoxItem();
    fetchBoxItemDetail();
  }, [boxItemId]);

  useEffect(() => {
    if (boxItem) {
      const fetchRelevantBoxItems = async () => {
        const response = await api.get(`BoxItem`);
        const filterResponse = response.data.filter(
          (item) =>
            item.belongBox.boxId === boxItem.belongBox.boxId &&
            item.boxItemId !== boxItem.boxItemId
        );
        console.log(response.data);
        setRelevantBoxItem(filterResponse);
      };
      fetchRelevantBoxItems();
    }
  }, [boxItem]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleVote = async (value) => {
    if (!user) {
      toast.error("Please login to vote");
      return;
    }
    value.userId = user.userId;
    value.boxItemId = boxItem.boxItemId;
    try {
      const response = await api.post("BoxItem/Vote", value);
      console.log(response.data);
      fetchBoxItemDetail();
      fetchAllVotesByBoxItem();
      toast.success("Vote successfully");
      form.resetFields();
    } catch (error) {
      console.log(error.response.data);
    }
  };

  if (!boxItem || loading) {
    return (
      <div className="w-full h-full min-h-screen  flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }
  const displayedVotes = showAllComments ? votes : votes.slice(0, 3);

  return (
    <div className="mt-[10%] container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, type: "spring", damping: 10 }}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <img src={boxItem.imageUrl} alt="" className="w-full h-150" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{boxItem.boxItemName}</h1>
            <p className="mt-10 text-2xl font-semibold ">
              Type: {boxItem.isSecret ? "Secret" : "Normal"}
            </p>
            <Rate
              value={boxItem.averageRating}
              disabled
              allowHalf
              className="!mt-10 !text-2xl"
            />
            <div className="flex justify-between items-center gap-10">
              <Button
                className="!bg-blue-300 w-full !text-white !font-bold !text-lg !rounded-lg !mt-10 !py-7"
                onClick={() => {
                  navigate(`${route.productDetail}/${boxItem.belongBox.boxId}`);
                }}
              >
                Hunt this Item
              </Button>{" "}
              <Button
                className="!bg-pink-300 w-full !text-white !font-bold !text-lg !rounded-lg !mt-10 !py-7"
                onClick={() => {
                  setIsModalOpen(true);
                }}
              >
                Vote Item
              </Button>{" "}
            </div>
            <Collapse
              defaultActiveKey={[]}
              style={{
                border: "none",
                backgroundColor: "transparent",
              }}
            >
              <Panel style={{ fontSize: "20px" }} header="Details" key="1">
                <p style={{ color: "#555" }}>
                  <strong>Color: </strong> {boxItem.boxItemColor}
                </p>
                <p style={{ color: "#555" }}>
                  <strong>Eyes: </strong> {boxItem.boxItemEyes}
                </p>
              </Panel>
            </Collapse>
          </div>
        </div>
        <div className="mt-10">
          {displayedVotes.length > 0 && (
            <>
              <h2 className="text-2xl font-bold  mb-4">
                All Votes ({boxItem.numOfVote} votes)
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {displayedVotes.map((vote) => (
                  <div
                    key={vote.userVotedBoxItemId}
                    className="p-4  rounded-lg shadow-md"
                  >
                    <p className="text-lg">
                      <strong>User:</strong> {vote.username}
                    </p>
                    <p className="text-lg">
                      <strong>Rating:</strong>{" "}
                      <Rate value={vote.rating} disabled />
                    </p>
                    <p className="text-lg">
                      <strong>Date:</strong>{" "}
                      {moment(vote.lastUpdated).format("DD-MM-YYYY")}
                    </p>
                  </div>
                ))}
              </div>
              {votes.length > 3 && (
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
          )}
        </div>
        <div style={{ marginTop: "50px" }}>
          <h2
            style={{
              fontSize: "22px",
              fontWeight: "bold",
              color: "#333",
              marginBottom: "16px",
            }}
          >
            Item in 1 box
          </h2>
          <div className="grid grid-cols-4 gap-4">
            {relevantBoxItem.map((item) => (
              <CardBoxItem Item={item} key={item.boxItemId} />
            ))}
          </div>
        </div>
      </motion.div>

      <Modal
        title="Vote Item"
        open={isModalOpen}
        onOk={() => {
          setIsModalOpen(false);
          form.submit();
        }}
        onCancel={() => setIsModalOpen(false)}
        okText="Vote"
      >
        <Form form={form} onFinish={handleVote}>
          <Form.Item name="rating" label="Rating">
            <Rate />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
