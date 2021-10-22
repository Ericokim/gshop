import React from "react";
import { Spinner } from "react-bootstrap";

const Loader = ({ size, variant, animation }) => {
  return (
    <Spinner
      role="status"
      style={{
        width: "60px",
        height: "60px",
        margin: "auto",
        display: "block",
      }}
      size={size}
      variant={variant}
      animation={animation}
    >
      <span className="sr-only">Loading...</span>
    </Spinner>
  );
};

Loader.defaultProps = {
  variant: "dark",
  animation: "border",
};

export default Loader;
