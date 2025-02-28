import  { useEffect, useState } from "react";
import {  useNavigate, useParams } from "react-router-dom";
import api from "../../../config/api";
import { Button, Collapse, Rate } from "antd";
import { route } from "../../../routes";
import CardBoxItem from "../../../components/CardBoxItem/CardBoxItem";
const { Panel } = Collapse;

export default function BoxItemDetailPage() {
  const { boxItemId } = useParams();
  const [boxItem, setBoxItem] = useState();
  const [relevantBoxItem, setRelevantBoxItem] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBoxItemDetail = async () => {
      const response = await api.get(`BoxItem/WithDTO/${boxItemId}`);
      console.log(response.data);
      setBoxItem(response.data);
    };
    fetchBoxItemDetail();
  }, [boxItemId]);

  useEffect(() => {
    if (boxItem) {
      const fetchRelevantBoxItems = async () => {
        const response = await api.get(`BoxItem`);
        const filterResponse = response.data.filter(
          (item) => item.belongBox.boxId === boxItem.belongBox.boxId
        );
        console.log(response.data);
        setRelevantBoxItem(filterResponse);
      };
      fetchRelevantBoxItems();
    }
  }, [boxItem]);
  if (!boxItem) return <div>Loading...</div>;

  return (
    <div className="mt-34 container mx-auto">
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
          <Button
            className="!bg-blue-300 w-full !text-white !font-bold !text-lg !rounded-lg !mt-10 !py-7"
            onClick={() => {
              navigate(`${route.productDetail}/${boxItem.belongBox.boxId}`);
            }}
          >
            Hunt this Item
          </Button>{" "}
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
    </div>
  );
}
