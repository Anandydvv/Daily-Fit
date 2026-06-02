import { render } from "@testing-library/react-native";
import React from "react";
import HandFanScreen from "../screens/activities/HandFanScreen";

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
}));

jest.mock("../database/database", () => ({
  insertActivityResult: jest.fn(() => Promise.resolve()),
}));

describe("HandFanScreen", () => {
  it("renders the hand fan challenge screen", () => {
    const { getByText } = render(<HandFanScreen />);

    expect(getByText("Hand Fan Challenge")).toBeTruthy();
    expect(getByText("Compare Designs")).toBeTruthy();
    expect(getByText("Save Result")).toBeTruthy();
  });
});
