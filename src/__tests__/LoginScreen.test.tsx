import { render } from "@testing-library/react-native";
import React from "react";

import LoginScreen from "../screens/LoginScreen";

describe("LoginScreen", () => {
  it("renders correctly", () => {
    const { getByText } = render(<LoginScreen />);

    expect(getByText("DailyFit")).toBeTruthy();
  });
});