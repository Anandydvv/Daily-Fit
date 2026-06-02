import { render, waitFor } from "@testing-library/react-native";
import React from "react";
import HistoryScreen from "../screens/HistoryScreen";

jest.mock("@react-navigation/native", () => ({
  useFocusEffect: (callback: any) => callback(),
}));

jest.mock("expo-video", () => ({
  useVideoPlayer: jest.fn(() => ({})),
  VideoView: () => null,
}));

jest.mock("../database/database", () => ({
  getActivityResults: jest.fn(() => Promise.resolve([])),
  clearActivityResults: jest.fn(() => Promise.resolve()),
}));

describe("HistoryScreen", () => {
  it("renders empty history state", async () => {
    const { getByText } = render(<HistoryScreen />);

    await waitFor(() => {
      expect(getByText("Activity History")).toBeTruthy();
      expect(getByText("No activity records yet.")).toBeTruthy();
    });
  });
});
