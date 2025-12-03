import { create } from "zustand";
import { qrService } from "../services/qrService";

export const useQRStore = create((set, get) => ({
  currentQR: null,
  qrHistory: [],
  isLoading: false,
  error: null,
  toast: null,
  serverReady: false, // NEW: track if backend is awake

  // -------------------------------------------------------
  // Wake backend (Render cold start handling)
  // -------------------------------------------------------
  wakeServer: async () => {
    try {
      await qrService.healthCheck();
      set({ serverReady: true });
      return true;
      } catch {
      return false;
    }
  },

  // -------------------------------------------------------
  // Generate QR Code
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
        toast: { message: "QR generated!", type: "success" },
      }));

      setTimeout(() => set({ toast: null }), 3000);

      return newQR;
    } catch (error) {
      const msg =
        error.response?.data?.message || "Failed to generate QR code";

      set({
        isLoading: false,
        error: msg,
        toast: { message: msg, type: "error" }
      });

      setTimeout(() => set({ toast: null }), 5000);
      throw error;
    }
  },

  // -------------------------------------------------------
  // Load QR History (robust retry)
  // -------------------------------------------------------
  getQRHistory: async () => {
    set({ isLoading: true, error: null });

    // 🔥 Make sure backend is awake first
    if (!get().serverReady) {
      let attempts = 0;

      while (attempts < 5) {
        const awake = await get().wakeServer();
        if (awake) break;

        attempts++;
        await new Promise((res) => setTimeout(res, 2000)); // wait 2 sec before retry
      }
    }

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
        serverReady: true,
      });
    } catch (error) {
      const msg =
        error.response?.data?.message || "Failed to fetch QR history";

      set({
        isLoading: false,
        qrHistory: [],
        error: msg,
        toast: { message: msg, type: "error" }
      });

      setTimeout(() => set({ toast: null }), 5000);
    }
  },

  // -------------------------------------------------------
  // Get Single QR Code
  // -------------------------------------------------------
  getQRCode: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const response = await qrService.getQRCode(id);
      const qr = response.data?.data;

      const formatted = {
        id: qr._id,
        imageUrl: qr.qrCodeImage,
        content: qr.data,
        type: qr.type,
        size: qr.size,
        createdAt: qr.generatedAt,
      };

      set({ currentQR: formatted, isLoading: false });
    } catch (error) {
      const msg =
        error.response?.data?.message || "Failed to load QR code";

      set({
        isLoading: false,
        error: msg,
        toast: { message: msg, type: "error" }
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
      const response = await qrService.deleteQRCode(id);

      if (!response.data?.success) {
        throw new Error("Failed to delete QR code");
      }

      set((state) => ({
        qrHistory: state.qrHistory.filter((qr) => qr.id !== id),
        toast: { message: "Deleted successfully", type: "success" }
      }));

      setTimeout(() => set({ toast: null }), 3000);

      return { success: true };
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete QR code";

      set({ toast: { message: msg, type: "error" } });

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
