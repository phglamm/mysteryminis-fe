import { Modal, Input, Rate, Button, Upload, message } from 'antd';
import { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import uploadFile from '../../utils/UploadImage'; // Import your uploadFile function
import api from '../../config/api';
import { useSelector } from 'react-redux';
import { selectUser } from '../../Redux/features/counterSlice';  // Assuming you're using Redux to store user data
import toast from 'react-hot-toast';
// import { propTypes } from 'react-bootstrap/esm/Image';


const FeedbackModal = ({ orderId, visible, setVisible, onFeedbackSubmitted, selectedOrderForFeedback }) => {
  const [feedbackContent, setFeedbackContent] = useState('');
  const [rating, setRating] = useState(0);
  const [fileList, setFileList] = useState([]);
  const [imageUrl, setImageUrl] = useState(''); // To store the uploaded image URL
  
  // Get user from Redux
  const user = useSelector(selectUser);
    console.log("User: ", user);

    const handleOk = async () => {
        if (!user || !selectedOrderForFeedback || !selectedOrderForFeedback.orderItems || selectedOrderForFeedback.orderItems.length === 0) {
          message.error('User or order item not found!');
          return;
        }
      
        // Debug log để kiểm tra giá trị của selectedOrderForFeedback
        console.log('Selected Order for Feedback:', selectedOrderForFeedback);
        console.log('Order Item ID:', selectedOrderForFeedback.orderItems[0].orderItemId);  // Truy cập vào orderItems[0].orderItemId
      
        const feedbackData = {
          userId: user.id,
          feedbackContent,
          rating,
          orderItemId: selectedOrderForFeedback.orderItems[0].orderItemId, // Sử dụng orderItemId từ orderItems[0]
          boxOptionId: selectedOrderForFeedback.orderItems[0].boxOptionId,  // Nếu boxOptionId cũng nằm trong orderItems[0]
          imageUrl: imageUrl,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      
        try {
          const response = await api.post('Feedback', feedbackData);
      
          // Kiểm tra phản hồi thành công
          if (response.status === 200) {
            message.success('Feedback submitted successfully!');
            onFeedbackSubmitted();
            setVisible(false);
          }
        } catch (error) {
          // Xử lý lỗi khi đã có feedback cho đơn hàng
          if (error.response && error.response.status === 400) {
            message.error('You have already submitted feedback for this order!');
            // toast.error('You have already submitted feedback for this order!');
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
      // Upload the image and get the URL
      const uploadedImageUrl = await uploadFile(file);
      setImageUrl(uploadedImageUrl); // Set the image URL

      // Update file list (Optional, if you want to show the file list)
      setFileList([...fileList, { ...file, url: uploadedImageUrl }]);
      return false; // Prevent automatic file upload since we handle it manually
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
          beforeUpload={handleImageUpload} // Custom image upload handler
        >
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
      </div>
    </Modal>
  );
};

export default FeedbackModal;
