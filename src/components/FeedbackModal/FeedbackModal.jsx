import { UploadOutlined } from "@ant-design/icons";
import { Button, Input, message, Modal, Rate, Upload } from "antd";
import api from "../../config/api";
import { useSelector } from "react-redux";
import { selectUser } from "../../Redux/features/counterSlice";

const FeedbackModal = ({ visible, setVisible, onFeedbackSubmitted, selectedOrderForFeedback }) => {
  const [feedbackContent, setFeedbackContent] = useState('');
  const [rating, setRating] = useState(0);
  const [fileList, setFileList] = useState([]);
  const [imageUrl, setImageUrl] = useState('');

  const user = useSelector(selectUser);

  const handleOk = async () => {
    if (!user || !selectedOrderForFeedback || !selectedOrderForFeedback.orderItems || selectedOrderForFeedback.orderItems.length === 0) {
      message.error('User or order item not found!');
      return;
    }

    const orderItem = selectedOrderForFeedback.orderItems[0]; 

    if (!orderItem) {
      message.error('Order item not found!');
      return;
    }

    const feedbackData = {
      userId: user.id,
      feedbackContent,
      rating,
      orderItemId: orderItem.orderItemId,
      boxOptionId: orderItem.boxOptionId,
      imageUrl: imageUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const response = await api.post('Feedback', feedbackData);

      if (response.status === 200) {
        message.success('Feedback submitted successfully!');
        onFeedbackSubmitted();
        setVisible(false);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        message.error('You have already submitted feedback for this order!');
      } else {
        message.error('Failed to submit feedback!');
        console.error(error);
      }
    }
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleImageUpload = async (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return false;
    }

    try {
      const uploadedImageUrl = await uploadFile(file);
      setImageUrl(uploadedImageUrl);
      setFileList([...fileList, { ...file, url: uploadedImageUrl }]);
      return false;
    } catch (error) {
      message.error('Failed to upload image!');
      console.error(error);
      return false;
    }
  };

  return (
    <Modal
      title="Rate Your Order"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Submit"
      cancelText="Cancel"
    >
      <div>
        <span>Feedback Content</span>
        <Input.TextArea
          value={feedbackContent}
          onChange={(e) => setFeedbackContent(e.target.value)}
          rows={4}
        />
      </div>
      <div>
        <span>Rating</span>
        <Rate value={rating} onChange={setRating} />
      </div>
      <div>
        <span>Upload Image (Optional)</span>
        <Upload
          listType="picture"
          fileList={fileList}
          onChange={({ fileList: newFileList }) => setFileList(newFileList)}
          beforeUpload={handleImageUpload}
        >
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
      </div>
    </Modal>
  );
};
