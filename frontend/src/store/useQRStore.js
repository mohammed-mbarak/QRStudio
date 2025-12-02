import { create } from "zustand";
import { qrService } from "../services/qrService";

export const useQRStore = create((set) => ({
  currentQR: null,
  qrHistory: [],
  isLoading: false,
  error: null,
  toast: null, // Toast state

  // -------------------------------------------------------
  // Generate QR
  // -------------------------------------------------------
  generateQR: async (qrData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await qrService.generateQR(qrData);
      const qr = response.data?.data;

      const newQR = {
        id: qr._id,
        imageUrl: qr.qrCodeImage,
        content: qr.data,
        type: qr.type,
        size: qr.size,
        createdAt: qr.generatedAt,
      };

      set((state) => ({
        currentQR: newQR,
        qrHistory: [newQR, ...state.qrHistory],
        isLoading: false,
        toast: { message: "QR code generated successfully!", type: "success" },
      }));

      setTimeout(() => set({ toast: null }), 3000);

      return newQR;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to generate QR code";

      set({
        isLoading: false,
        error: message,
        toast: { message, type: "error" },
      });

      setTimeout(() => set({ toast: null }), 5000);

      throw error;
    }
  },

  // -------------------------------------------------------
  // Get QR History
  // -------------------------------------------------------
  getQRHistory: async () => {
    set({ isLoading: true });

    try {
      const response = await qrService.getQRCodes();
      const list = response.data?.data?.qrCodes || [];

      const history = list.map((qr) => ({
        id: qr._id,
        imageUrl: qr.qrCodeImage,
        content: qr.data,
        type: qr.type,
        size: qr.size,
        createdAt: qr.generatedAt,
      }));

      set({
        qrHistory: history,
        isLoading: false,
      });
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch QR history";

      set({
        isLoading: false,
        qrHistory: [],
        error: message,
        toast: { message, type: "error" },
      });

      setTimeout(() => set({ toast: null }), 5000);
    }
  },

  // -------------------------------------------------------
  // Get Single QR
  // -------------------------------------------------------
  getQRCode: async (id) => {
    set({ isLoading: true });

    try {
      const response = await qrService.getQRCode(id);
      const qr = response.data?.data;

      const formattedQR = {
        id: qr._id,
        imageUrl: qr.qrCodeImage,
        content: qr.data,
        type: qr.type,
        size: qr.size,
        createdAt: qr.generatedAt,
      };

      set({
        currentQR: formattedQR,
        isLoading: false,
      });
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch QR code";

      set({
        isLoading: false,
        error: message,
        toast: { message, type: "error" },
      });

      setTimeout(() => set({ toast: null }), 5000);

      throw error;
    }
  },

  // -------------------------------------------------------
  // Delete QR
  // -------------------------------------------------------
  deleteQRCode: async (id) => {
    try {
      const response = await qrService.deleteQRCode(id);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to delete QR code");
      }

      set((state) => ({
        qrHistory: state.qrHistory.filter((qr) => qr.id !== id),
        toast: { message: "QR code deleted successfully", type: "success" },
      }));

      setTimeout(() => set({ toast: null }), 3000);

      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete QR code";

      set({
        toast: { message, type: "error" },
      });

      setTimeout(() => set({ toast: null }), 5000);

      throw error;
    }
  },

  // -------------------------------------------------------
  // Utility
  // -------------------------------------------------------
  clearError: () => set({ error: null }),
  clearCurrentQR: () => set({ currentQR: null }),
  clearToast: () => set({ toast: null }),
}));
