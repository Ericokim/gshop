import React, { useState, useEffect } from "react";
import { Alert } from "react-bootstrap";

const Message = ({ variant, children }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Alert
      variant={variant}
      show={show}
      onClose={() => setShow(false)}
      dismissible
    >
      {children}
    </Alert>
  );
};

Message.defaultProps = {
  variant: "info",
};

export default Message;
