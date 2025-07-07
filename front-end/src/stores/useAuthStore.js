import { create } from "zustand";
import { axiosInstance } from "../lib/axiosInstance.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE == "development" ? "http://localhost:8000" : "/"; // Adjust this to your backend URL

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningIn: false,
  isSigningUp: false,
  isSigningOut: false,
  isUpdatingProfile: false,
  isCheckingAuth: true, // Use when reloading the page to check if the user is authenticated
  onlineUsers: [],
  socket: null,
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/check-auth");
      set({
        authUser: res.data.user,
      });
      get().connectSocket(); // Connect to socket after checking auth
    } catch (error) {
      set({
        authUser: null,
      });
      console.error("Error checking authentication:", error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (formData) => {
    set({ isSigningUp: true });
    try {
      const { data } = await axiosInstance.post("/auth/sign-up", formData);
      // set({
      //   authUser: data.user,
      // });
      return toast.success("Sign up successful!");
    } catch (error) {
      console.error("Error signing up:", error);
      toast.error("Sign up failed. Please try again.");
    } finally {
      set({ isSigningUp: false });
    }
  },

  signOut: async () => {
    try {
      set({ isSigningOut: true });
      await axiosInstance.post("/auth/sign-out");
      set({ authUser: null });
      toast.success("Sign out successful!");
      get().disconnectSocket(); // Disconnect from socket after sign-out
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Sign out failed. Please try again.");
    } finally {
      set({ isSigningOut: false });
    }
  },

  signIn: async (formData) => {
    set({ isSigningIn: true });
    try {
      const { data } = await axiosInstance.post("/auth/sign-in", formData);
      set({
        authUser: data.user,
      });
      toast.success("Sign in successful!");

      get().connectSocket(); // Connect to socket after successful sign-in
    } catch (error) {
      console.error("Error signing in:", error);
      toast.error("Sign in failed. Please try again.");
    } finally {
      set({ isSigningIn: false });
    }
  },

  updateProfile: async (profilePic) => {
    set({ isUpdatingProfile: true });
    try {
      const { data } = await axiosInstance.put("/user/update-profile", {
        profilePic,
      });
      set({ authUser: data.user });
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Profile update failed. Please try again.");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) {
      return;
    }
    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id, // Send user ID as a query parameter
      },
    });
    socket.connect();
    set({
      socket,
    });

    socket.on("getOnlineUsers", (userIds) => {
      set({
        onlineUsers: userIds,
      });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket.disconnect();
      set({
        socket: null,
      });
    }
  },
}));
