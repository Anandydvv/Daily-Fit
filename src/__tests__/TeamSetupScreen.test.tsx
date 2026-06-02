import { render } from "@testing-library/react-native";
import React from "react";

import TeamSetupScreen from "../screens/TeamSetupScreen";

describe("TeamSetupScreen", () => {
  it("renders correctly", () => {
    const { getByText } = render(<TeamSetupScreen />);

    expect(getByText("Team Setup")).toBeTruthy();
  });
});