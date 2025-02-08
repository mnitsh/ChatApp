import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoding: false,
  isMessagesLoding: false,

  getUser: async () => {
    set({ isUsersLoding: true });
    try {
      const res = await axiosInstance.get("/message/users");
      set({ users: res.data.data });
    } catch (error) {
      toast.error(error.response.data.messages);
    } finally {
      set({ isUsersLoding: false });
    }
  },

  getMessage: async (userID) => {
    set({ isMessagesLoding: true });
    try {
      const res = await axiosInstance.get(`/message/${userID}`);
      set({ messages: res.data.data });
    } catch (error) {
      toast.error(error.response.data.messages);
    } finally {
      set({ isMessagesLoding: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/message/send/${selectedUser._id}`,
        messageData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      set({ messages: [...messages, res.data.data] });
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.messages);
    }
  },

  setSelectedUser: async (selectedUser) => {
    set({ selectedUser });
  },
}));
