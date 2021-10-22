import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { listProducts } from "../actions/productActions";

const HomeScreen = () => {
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);

  const { products, loading, error } = productList;

  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);

  return (
    <Fragment>
      <h1>Latest Products</h1>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          {products.length === 0 ? (
            <Message>
              <Row>
                <Col>No Data found</Col>
                <Col className="text-right"></Col>
              </Row>
            </Message>
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <Row>
              {products.map((product) => (
                <Col key={product._id} sm={12} md={6} lg={4} xl={3.2}>
                  <Product product={product} />
                </Col>
              ))}
            </Row>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default HomeScreen;
