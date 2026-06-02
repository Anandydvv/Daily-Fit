import { render } from "@testing-library/react-native";
import React from "react";

import DashboardScreen from "../screens/DashboardScreen";

describe("DashboardScreen", () => {
  it("renders correctly", () => {
    const { getByText } = render(<DashboardScreen />);

    expect(getByText("STEMM Lab")).toBeTruthy();
  });
});