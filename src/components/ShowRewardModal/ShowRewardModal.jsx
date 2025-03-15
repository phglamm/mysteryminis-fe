/* eslint-disable react/prop-types */
import { Modal, Badge, Descriptions, Rate } from "antd";

const ShowRewardModal = ({ reward, visible, onClose, setShowVideo }) => {
  const items = reward
    ? [
        {
          key: "1",
          label: "Name",
          children: reward.boxItemName,
        },
        {
          key: "2",
          label: "Description",
          children: reward.boxItemDescription,
        },
        {
          key: "3",
          label: "Eyes Type",
          children: reward.boxItemEyes,
        },
        {
          key: "4",
          label: "Color",
          children: reward.boxItemColor,
        },
        {
          key: "5",
          label: "Average Rating",
          children: (
            <div className="flex items-center gap-2">
              <Rate disabled defaultValue={reward.averageRating} /> {reward.numOfVote} votes
            </div>
          ),
        },
      ]
    : [];

  return (
    <Modal
      open={visible}
      onOk={onClose}
      onCancel={() => {
        onClose();
        setShowVideo(false);
      }}
      centered
      footer={null}
      width={800}
      className="text-center z-20 mt-20"
      maskStyle={{ backgroundColor: "transparent" }}
    >
      {reward ? (
        <div className="flex justify-center gap-10 items-center">
          <div className="w-1/3 justify-center items-center flex flex-col gap-2 h-[25vw]">
            <img
              src={reward.imageUrl}
              alt="logo"
              className=" w-full h-[60%] bg-amber-400"
            />
            <Badge
              style={{
                boxShadow: reward.isSecret ? "2px 2px #DAA520" : "2px 2px black",
              }}
              color={reward.isSecret ? "gold" : "lime"}
              count={reward.isSecret ? "Secret" : "Normal"}
              className="w-full h-[20%]"
            />
          </div>
          <Descriptions bordered column={1} items={items} />
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </Modal>
  );
};

export default ShowRewardModal;
