// src/components/Header.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDonors } from '../../store/donor-slice/donorSlice';
import { Container, Row, Col, Card, CardBody, CardTitle } from 'reactstrap';
import dayjs from 'dayjs';

import {
  fetchCauses,
} from "../../store/causes-slice/causesSlice";

const Header = () => {
  const dispatch = useDispatch();
  const { donors } = useSelector((state) => state.donors);
  const { causes, status } = useSelector((state) => state.causes);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCauses());
    }
  }, [status, dispatch]);

  const filteredCauses = causes.filter((cause) => !cause.isDelete);
  const totalGoal = filteredCauses.reduce((sum, cause) => sum + (cause.goal || 0), 0).toLocaleString('en-IN');
  const totalRaised = filteredCauses.reduce((sum, cause) => sum + (cause.raised || 0), 0).toLocaleString('en-IN');

  useEffect(() => {
    dispatch(fetchDonors());
  }, [dispatch]);

  const totalDonors = donors.length;
  const newDonors = donors.filter(donor => dayjs().diff(dayjs(donor.createdAt), 'day') <= 7).length;

  return (
    <div className="header bg-gradient-green pb-8 pt-5 pt-md-8">
      <Container fluid>
        <div className="header-body">
          <Row className="align-items-stretch">
            <Col lg="6" xl="3">
              <Card className="card-stats h-100 mb-4 mb-xl-0">
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        Total Donors
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">{totalDonors || "N/A"}</span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                        <i className="fas fa-chart-bar" />
                      </div>
                    </Col>
                  </Row>
                  <p className="mt-3 mb-0 text-muted text-sm">
                    <span className="text-nowrap">Till Now</span>
                  </p>
                </CardBody>
              </Card>
            </Col>

            <Col lg="6" xl="3">
              <Card className="card-stats h-100 mb-4 mb-xl-0">
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                        New Donors
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">{newDonors || "N/A"}</span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                        <i className="fas fa-users" />
                      </div>
                    </Col>
                  </Row>
                  <p className="mt-3 mb-0 text-muted text-sm">
                    <span className="text-nowrap">Since last week</span>
                  </p>
                </CardBody>
              </Card>
            </Col>

            <Col lg="6" xl="3">
  <Card className="card-stats h-100 mb-4 mb-xl-0">
    <CardBody>
      <Row className="align-items-center">
        <Col xs="8">
          <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
            Total Donation Goal
          </CardTitle>
        </Col>
        <Col xs="4" className="text-right">
          <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
            <i className="fas fa-money-bill-wave" />
          </div>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col className="text-left">
          <span className="h2 font-weight-bold mb-0">
            {totalGoal || "N/A"} &#8377;
          </span>
        </Col>
      </Row>
    </CardBody>
  </Card>
</Col>

<Col lg="6" xl="3">
  <Card className="card-stats h-100 mb-4 mb-xl-0">
    <CardBody>
      <Row className="align-items-center  mt-3">
        <Col xs="8">
          <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
            Total Donation Raised
          </CardTitle>
        </Col>
        <Col xs="4" className="text-right">
          <div className="icon icon-shape bg-info text-white rounded-circle shadow">
            <i className="fas fa-percent" />
          </div>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col className="text-left">
          <span className="h2 font-weight-bold mb-0">
            {totalRaised || "N/A"} &#8377;
          </span>
        </Col>
      </Row>
    </CardBody>
  </Card>
</Col>

          </Row>
        </div>
      </Container>
    </div>
  );
};

export default Header;
