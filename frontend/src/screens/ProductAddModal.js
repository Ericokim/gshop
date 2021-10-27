// import axios from "axios";
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
// import Message from "../components/Message";
// import Loader from "../components/Loader";
import { createProduct, Refresh } from "../actions/productActions";
import { USER_UPDATE_FAIL, USER_UPDATE_RESET } from "../constants/userConstants";

const ProductAddModal = ({ show, hide }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState({
    preview: "../images/image_placeholder.jpg",
    raw: "",
  });
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  // const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();

  const productCreate = useSelector((state) => state.productCreate);
  const { loading, error, success } = productCreate;

  useEffect(() => {
    if (success) {
      dispatch({ type: USER_UPDATE_RESET });
    } else {
      error && dispatch({ type: USER_UPDATE_FAIL });
    }
  }, []);

  const resetField = () => {
    setName("");
    setPrice("");
    setImage("");
    setBrand("");
    setCategory("");
    setCountInStock("");
    setDescription("");
  };

  // const uploadFileHandler = async (e) => {
  //   // const file = e.target.files[0];
  //   const formData = new FormData();
  //   formData.append("image", image.raw);
  //   setUploading(true);

  //   try {
  //     const config = {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     };

  //     const { data } = await axios.post("/api/upload", formData, config);

  //     setImage(data);
  //     setUploading(false);
  //   } catch (error) {
  //     console.error(error);
  //     setUploading(false);
  //   }
  // };

  const onFileChange = (e) => {
    if (e.target.files.length) {
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0].name,
      });
    }
  };

  const removeImage = () => {
    setImage({
      preview: "../images/image_placeholder.jpg",
      raw: "",
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = {
      name,
      price,
      image: image.raw,
      brand,
      category,
      description,
      countInStock,
    };
    if (image.raw === "") {
      alert("Please select an image");
    } else {
      console.log(formData);
      dispatch(createProduct(formData))
        .then(() => dispatch(Refresh()))
        .finally(() => hide());
    }
  };

  return (
    <Modal
      show={show}
      onHide={hide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Add Product</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={submitHandler} id="AddProduct">
          <Form.Group controlId="image">
            <Form.Label>Image</Form.Label>
            <Row>
              <Col lg={12}>
                <Figure>
                  <Figure.Image
                    src={image.preview}
                    width={251}
                    height={180}
                    alt="dummy"
                  />

                  <Figure.Caption>
                    {image.raw ? (
                      <span>
                        <Button
                          className="btn-file mr-2"
                          variant="success"
                          size="sm"
                        >
                          Change
                          <input
                            type="file"
                            id="upload-button"
                            onChange={onFileChange}
                          />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => removeImage()}
                        >
                          <i className="fas fa-times mr-2" />
                          Remove
                        </Button>
                      </span>
                    ) : (
                      <Button className="btn-file" variant="success" size="sm">
                        {/* <i className="fas fa-plus mr-2"></i> */}
                        Add Photo
                        <input
                          type="file"
                          id="upload-button"
                          onChange={onFileChange}
                        />
                      </Button>
                    )}
                  </Figure.Caption>
                </Figure>
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
      </Modal.Body>

      <Modal.Footer>
        {loading && (
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

        <Button form="AddProduct" type="submit" size="sm" variant="success">
          {loading ? "Loading..." : "Create"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductAddModal;
