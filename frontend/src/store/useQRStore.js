import { create } from "zustand";
import { qrService } from "../services/qrService";

export const useQRStore = create((set, get) => ({
  currentQR: null,
  qrHistory: [],
  isLoading: false,
  error: null,
  toast: null,

  // Utility: ensure loader stays visible long enough
  withMinimumLoading: async (promise, minTime = 600) => {
    const start = Date.now();
    const result = await promise;
    const elapsed = Date.now() - start;

    if (elapsed < minTime) {
      await new Promise((res) => setTimeout(res, minTime - elapsed));
    }
    return result;
  },

  // -------------------------------------------------------
  // Generate QR Code
  // -------------------------------------------------------
  generateQR: async (qrData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await get().withMinimumLoading(
        qrService.generateQR(qrData)
      );

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
  // Get QR History (Retry for Render cold starts)
  // -------------------------------------------------------
  getQRHistory: async (retry = false) => {
    set({ isLoading: true, error: null });

    try {
      const response = await get().withMinimumLoading(
        qrService.getQRCodes()
      );

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
      if (!retry) {
        // Retry once after cold start
        set({ isLoading: true });
        setTimeout(() => {
          get().getQRHistory(true);
        }, 2000);
        return;
      }

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
  // Get a Single QR Code
  // -------------------------------------------------------
  getQRCode: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const response = await get().withMinimumLoading(
        qrService.getQRCode(id)
      );

      const qr = response.data?.data;

      const formatted = {
        id: qr._id,
        imageUrl: qr.qrCodeImage,
        content: qr.data,
        type: qr.type,
        size: qr.size,
        createdAt: qr.generatedAt,
      };

      set({
        currentQR: formatted,
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
  // Delete QR Code
  // -------------------------------------------------------
  deleteQRCode: async (id) => {
    try {
      const response = await get().withMinimumLoading(
        qrService.deleteQRCode(id)
      );

      if (!response.data?.success) {
        throw new Error("Failed to delete QR code");
      }

      set((state) => ({
        qrHistory: state.qrHistory.filter((qr) => qr.id !== id),
        toast: { message: "QR Code deleted successfully", type: "success" },
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
  // Utilities
  // -------------------------------------------------------
  clearError: () => set({ error: null }),
  clearCurrentQR: () => set({ currentQR: null }),
  clearToast: () => set({ toast: null }),
}));
