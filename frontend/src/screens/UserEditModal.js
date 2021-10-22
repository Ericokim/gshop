import React, { useState, useEffect } from "react";
import { Form, Button, Modal, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { updateUser, Refresh } from "../actions/userActions";
import { USER_UPDATE_RESET } from "../constants/userConstants";

const UserEditModal = ({ show, hide, currentUser }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error } = userDetails;

  const userUpdate = useSelector((state) => state.userUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = userUpdate;

  useEffect(() => {
    const { name, email, isAdmin } = currentUser;
    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET });
    }
    setName(name);
    setEmail(email);
    setIsAdmin(isAdmin);
  }, [currentUser]);

  const resetField = () => {
    setName("");
    setEmail("");
    setIsAdmin("");
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = {
      id: currentUser.id,
      name,
      email,
      isAdmin,
    };

    dispatch(updateUser(formData))
      .then(() => dispatch(Refresh()))
      .finally(() => hide());
  };

  return (
    <Modal
      show={show}
      onHide={hide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit User</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* {loadingUpdate && <Loader size="sm"></Loader>} */}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler} id="userEdit">
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="isadmin">
              <Form.Check
                size="lg"
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                label="Is Admin"
              />
            </Form.Group>
          </Form>
        )}
      </Modal.Body>

      <Modal.Footer>
        {loadingUpdate && (
          <Spinner
            as="span"
            animation="grow"
            role="status"
            variant="info"
            aria-hidden="true"
          />
        )}
        <Button size="sm" variant="danger" onClick={() => hide(resetField())}>
          Cancel
        </Button>

        <Button form="userEdit" type="submit" size="sm" variant="success">
          {loadingUpdate ? "Loading..." : "Update"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserEditModal;
