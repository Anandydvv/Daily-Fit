import { render } from "@testing-library/react-native";
import React from "react";
import HumanPerformanceScreen from "../screens/activities/HumanPerformanceScreen";

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
}));

jest.mock("expo-sensors", () => ({
  Accelerometer: {
    setUpdateInterval: jest.fn(),
    addListener: jest.fn(() => ({
      remove: jest.fn(),
    })),
  },
  Gyroscope: {
    setUpdateInterval: jest.fn(),
    addListener: jest.fn(() => ({
      remove: jest.fn(),
    })),
  },
}));

jest.mock("../database/database", () => ({
  insertActivityResult: jest.fn(() => Promise.resolve()),
}));

describe("HumanPerformanceScreen", () => {
  it("renders the human performance lab screen", () => {
    const { getByText } = render(<HumanPerformanceScreen />);

    expect(getByText("Human Performance Lab")).toBeTruthy();
    expect(getByText("Compare Attempts")).toBeTruthy();
    expect(getByText("Save Result")).toBeTruthy();
  });
});
