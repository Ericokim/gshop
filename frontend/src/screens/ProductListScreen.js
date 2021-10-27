import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table, Button, Row, Col, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useConfirmationDialog } from "../components/ConfirmationDialog";
import {
  listProducts,
  deleteProduct,
  Refresh,
} from "../actions/productActions";
import ProductAddModal from "./ProductAddModal";
import ProductEditModal from "./ProductEditModal";

const ProductListScreen = ({ history, match }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    id: "",
    name: "",
    price: "",
    image: "",
    brand: "",
    category: "",
    description: "",
    countInStock: "",
  });
  const handleAddClose = () => {
    setShowAdd(false);
  };
  const handleClose = () => setShowEdit(false);

  const handleShow = (product) => {
    setShowEdit(true);
    setCurrentProduct({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      brand: product.brand,
      category: product.category,
      description: product.brand,
      countInStock: product.countInStock,
    });
  };

  const { getConfirmation } = useConfirmationDialog();

  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listProducts());
    } else {
      history.push("/login");
    }
  }, [dispatch, history, userInfo, successDelete]);

  // const createProductHandler = () => {
  //   setShowAdd(true);
  // };

  const deleteHandler = async (id, product) => {
    const confirmed = await getConfirmation({
      title: `Delete: ${product}`,
      message: "Are you sure?",
    });

    if (confirmed) {
      dispatch(deleteProduct(id));
    }
  };

  const refresh = () => {
    dispatch(Refresh());
  };

  return (
    <div>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-right">
          <Button
            // variant="dark"
            className="my-3"
            size="sm"
            // title="Create Product"
            onClick={() => setShowAdd(true)}
          >
            <i className="fas fa-plus mr-2"></i> Create Product
          </Button>

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
      {/* {loadingDelete && <Loader />} */}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {successDelete && (
        <Message variant="success">Product removed successfully</Message>
      )}

      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          {products && products.length === 0 ? (
            <Message>
              <Row>
                <Col>No Products found</Col>
                <Col className="text-right">
                  <Link to="/">
                    <b>
                      <i className="fas fa-arrow-left"></i> Go Back{" "}
                    </b>
                  </Link>
                </Col>
              </Row>
            </Message>
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <Table striped bordered hover responsive className="table-sm">
              <thead>
                <tr>
                  <th>IMAGE</th>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>PRICE</th>
                  <th>CATEGORY</th>
                  <th>BRAND</th>
                  <th>STOCK</th>
                  <th>No.REVIEWS</th>
                  <th>CREATED</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <Image
                        width={42}
                        height={42}
                        src={product.image}
                        fluid
                        rounded
                      />
                    </td>
                    <td>{product._id}</td>
                    <td>{product.name}</td>
                    <td>${product.price}</td>
                    <td>{product.category}</td>
                    <td>{product.brand}</td>
                    <td>{product.countInStock}</td>
                    <td>{product.numReviews}</td>
                    <td>{product.createdAt.substring(0, 10)}</td>
                    <td>
                      <Button
                        variant="light"
                        className="btn-sm"
                        title="Edit"
                        onClick={() => handleShow(product)}
                      >
                        <i className="fas fa-edit"></i>
                      </Button>

                      <Button
                        variant="danger"
                        className="btn-sm"
                        title="Delete"
                        onClick={() => deleteHandler(product._id, product.name)}
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

      <ProductAddModal show={showAdd} hide={handleAddClose} />
      <ProductEditModal
        show={showEdit}
        hide={handleClose}
        currentProduct={currentProduct}
      />
    </div>
  );
};

export default ProductListScreen;
