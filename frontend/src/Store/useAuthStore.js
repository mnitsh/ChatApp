import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  islogingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUser:[],

  CheckAuth: async () => {
    set({ isCheckingAuth: true }); // Start loading state
    try {
      const res = await axiosInstance.get("/auth/currentUser");
      set({ authUser: res.data });
    } catch (error) {
      console.error("Error in check auth:", error);
      set({ authUser: null }); // Clear user on failure
    } finally {
      set({ isCheckingAuth: false }); // Ensure loading state resets
    }
  },

  signUp: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("logOut successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  login: async (data) => {
    set({ islogingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("login successfully");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
    } finally {
      set({ islogingIn: false });
    }
  },

  updatingProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.patch("/auth/updateDP", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set({ authUser: res.data });
      toast.success("Profile picture updated successfullly");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again";
      toast.error(errorMessage);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
