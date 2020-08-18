import * as React from "react";

export const RootBox: React.FC<any> = (props) => {
  return (
    <box
      label="root-box"
      width="100%"
      height="100%"
      border={{ type: "line" }}
      style={{ border: { fg: "blue" } }}
      {...props}
    />
  );
};
