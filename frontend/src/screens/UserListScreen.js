import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useConfirmationDialog } from "../components/ConfirmationDialog";
import { listUsers, deleteUser, Refresh } from "../actions/userActions";
import UserEditModal from "./UserEditModal";

const UserListScreen = ({ history }) => {
  const [show, setShow] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    id: "",
    name: "",
    email: "",
    isAdmin: "",
  });
  const handleClose = () => setShow(false);

  const handleShow = (user) => {
    setShow(true);
    setCurrentUser({
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  };

  const { getConfirmation } = useConfirmationDialog();
  const dispatch = useDispatch();

  const userList = useSelector((state) => state.userList);
  const { loading, error, users } = userList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDelete = useSelector((state) => state.userDelete);
  const { success: successDelete } = userDelete;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listUsers());
    } else {
      history.push("/login");
    }
  }, [dispatch, history, successDelete, userInfo]);

  const deleteHandler = async (id, user) => {
    const confirmed = await getConfirmation({
      title: `Delete: ${user}`,
      message: "Are you sure?",
    });

    if (confirmed) {
      dispatch(deleteUser(id));
    }
  };
  const refresh = () => {
    dispatch(Refresh());
  };

  return (
    <div>
      <Row className="align-items-center">
        <Col>
          <h1>Users</h1>
        </Col>
        <Col className="text-right">
          <Button
            variant="dark"
            className="my-3 ml-1"
            size="sm"
            title="Refresh"
            onClick={refresh}
          >
            <i className="fas fa-sync"></i>
          </Button>
        </Col>
      </Row>

      {users && users.length === 0 ? (
        <Message>
          <Row>
            <Col>No Users found</Col>
            <Col className="text-right">
              <Link to="/">
                <b>
                  <i className="fas fa-arrow-left"></i> Go Back
                </b>
              </Link>
            </Col>
          </Row>
        </Message>
      ) : (
        <Fragment>
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <Table striped bordered hover responsive className="table-sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>CREATED AT</th>
                  <th>ADMIN</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td>
                      <a href={`mailto:${user.email}`}>{user.email}</a>
                    </td>
                    <td>{user.createdAt.substring(0, 10)}</td>
                    <td>
                      {user.isAdmin ? (
                        <i
                          className="fas fa-check"
                          style={{ color: "green" }}
                        ></i>
                      ) : (
                        <i
                          className="fas fa-times"
                          style={{ color: "red" }}
                        ></i>
                      )}
                    </td>
                    <td>
                      <Button
                        variant="light"
                        className="btn-sm"
                        title="Edit"
                        onClick={() => handleShow(user)}
                      >
                        <i className="fas fa-edit"></i>
                      </Button>
                      <Button
                        variant="danger"
                        className="btn-sm"
                        title="Delete"
                        onClick={() => deleteHandler(user._id, user.name)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Fragment>
      )}

      <UserEditModal show={show} hide={handleClose} currentUser={currentUser} />
    </div>
  );
};

export default UserListScreen;
