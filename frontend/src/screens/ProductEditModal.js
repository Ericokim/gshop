import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Modal,
  Spinner,
  Figure,
  Row,
  Col,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { Refresh } from "../actions/productActions";
import { USER_UPDATE_RESET } from "../constants/userConstants";

const ProductEditModal = ({ show, hide, currentProduct }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error } = productDetails;

  const userUpdate = useSelector((state) => state.userUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = userUpdate;

  useEffect(() => {
    const { name, price, image, brand, category, description, countInStock } =
      currentProduct;
    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET });
    }
    setName(name);
    setPrice(price);
    setImage(image);
    setBrand(brand);
    setCategory(category);
    setCountInStock(countInStock);
    setDescription(description);
  }, [currentProduct]);

  const resetField = () => {
    setName("");
    setPrice("");
    setImage("");
    setBrand("");
    setCategory("");
    setCountInStock("");
    setDescription("");
  };

  const uploadFileHandler = () => {
    console.log("object");
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = {
      id: currentProduct.id,
      name,
      price,
      image,
      brand,
      category,
      description,
      countInStock,
    };

    dispatch(console.log(formData))
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
        <Modal.Title>Edit Product</Modal.Title>
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
            <Form.Group controlId="image">
              <Form.Label>Image</Form.Label>
              <Row>
                <Col md={6}>
                  <Figure>
                    <Figure.Image
                      width={181}
                      height={180}
                      alt="171x180"
                      src={image}
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                    />
                  </Figure>
                </Col>
                <Col md={6}>
                  <Form.Control
                    type="text"
                    placeholder="Enter image url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                  ></Form.Control>
                  <Form.File
                    id="image-file"
                    label="Choose File"
                    custom
                    onChange={uploadFileHandler}
                  ></Form.File>
                  {uploading && <Loader />}
                </Col>
              </Row>
            </Form.Group>

            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Row>
              <Col>
                <Form.Group controlId="price">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="countInStock">
                  <Form.Label>Count In Stock</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter countInStock"
                    value={countInStock}
                    onChange={(e) => setCountInStock(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group controlId="brand">
                  <Form.Label>Brand</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter brand"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="category">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
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

export default ProductEditModal;
