import { create } from "zustand";
import { qrService } from "../services/qrService";

export const useQRStore = create((set) => ({
  currentQR: null,
  qrHistory: [],
  isLoading: false,
  error: null,

  generateQR: async (qrData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await qrService.generateQR(qrData);
      const qr = response.data?.data;

      const newQR = {
        id: qr._id,
        imageUrl: qr.qrCodeImage, // FIXED
        content: qr.data,
        type: qr.type,
        size: qr.size,
        createdAt: qr.generatedAt,
      };

      set((state) => ({
        currentQR: newQR,
        qrHistory: [newQR, ...state.qrHistory],
        isLoading: false,
        error: null,
      }));

      return newQR;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to generate QR code",
      });
      throw error;
    }
  },

  getQRHistory: async () => {
    set({ isLoading: true });

    try {
      const response = await qrService.getQRCodes();

      const list = response.data?.data?.qrCodes || []; // FIXED

      const history = list.map((qr) => ({
        id: qr._id,
        imageUrl: qr.qrCodeImage, // FIXED
        content: qr.data,
        type: qr.type,
        size: qr.size,
        createdAt: qr.generatedAt,
      }));

      set({
        qrHistory: history,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        qrHistory: [],
        error: error.response?.data?.message || "Failed to fetch QR history",
      });
    }
  },

  getQRCode: async (id) => {
    set({ isLoading: true });

    try {
      const response = await qrService.getQRCode(id);
      const qr = response.data?.data;

      const formattedQR = {
        id: qr._id,
        imageUrl: qr.qrCodeImage, // FIXED
        content: qr.data,
        type: qr.type,
        size: qr.size,
        createdAt: qr.generatedAt,
      };

      set({
        currentQR: formattedQR,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to fetch QR code",
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
  clearCurrentQR: () => set({ currentQR: null }),
}));
