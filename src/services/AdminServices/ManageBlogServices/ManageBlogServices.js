import api from "../../../config/api";

export const getAllBlogs = async () => {
    try {
      const response = await api.get("BlogPost");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
      throw error;
    }
  };
  
  export const addBlog = async (blogData) => {
    try {
      const response = await api.post("BlogPost", blogData);
      return response.data;
    } catch (error) {
      console.error("Failed to add blog:", error);
      throw error;
    }
  };
  
  export const updateBlog = async (blogId, blogData) => {
    try {
      const response = await api.put(`BlogPost/${blogId}`, blogData);
      return response.data;
    } catch (error) {
      console.error("Failed to update blog:", error);
      throw error;
    }
  };
  
  export const deleteBlog = async (blogId) => {
    try {
      await api.delete(`BlogPost/${blogId}`);
    } catch (error) {
      console.error("Failed to delete blog:", error);
      throw error;
    }
  };