import React, { useState, useContext, createContext } from "react";
import { Modal, Button } from "react-bootstrap";

const AlertDismissible = ({ title, message, open, onConfirm, onDismiss }) => {
  return (
    <Modal
      show={open}
      onHide={onDismiss}
      backdrop="static"
      // centered
      keyboard={false}
      size="sm"
      aria-labelledby="example-modal-sizes-title-sm"
    >
      <Modal.Header>
        <b>{title}</b>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button onClick={onDismiss} size="sm" variant="outline-danger">
          Cancel
        </Button>
        <Button onClick={onConfirm} size="sm" variant="outline-success">
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const ConfirmationDialogContext = createContext({});

const ConfirmationDialogProvider = ({ children }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({});

  const openDialog = ({ title, message, actionCallback }) => {
    setDialogOpen(true);
    setDialogConfig({ title, message, actionCallback });
  };

  const resetDialog = () => {
    setDialogOpen(false);
    setDialogConfig({});
  };

  const onConfirm = () => {
    resetDialog();
    dialogConfig.actionCallback(true);
  };

  const onDismiss = () => {
    resetDialog();
    dialogConfig.actionCallback(false);
  };

  return (
    <ConfirmationDialogContext.Provider value={{ openDialog }}>
      <AlertDismissible
        open={dialogOpen}
        title={dialogConfig.title}
        message={dialogConfig.message}
        onConfirm={onConfirm}
        onDismiss={onDismiss}
      />
      {children}
    </ConfirmationDialogContext.Provider>
  );
};

const useConfirmationDialog = () => {
  const { openDialog } = useContext(ConfirmationDialogContext);

  const getConfirmation = ({ ...options }) =>
    new Promise((res) => {
      openDialog({ actionCallback: res, ...options });
    });

  return { getConfirmation };
};

export default AlertDismissible;
export { ConfirmationDialogProvider, useConfirmationDialog };
