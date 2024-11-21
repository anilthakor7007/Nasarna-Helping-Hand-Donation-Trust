import React from 'react';
import { fetchCauses } from "../../store/causes-slice/causesSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDonors } from "../../store/donor-slice/donorSlice";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Table,
  Row,
  Col,
  Input
} from "reactstrap";

const CausesEvents = () => {
  const dispatch = useDispatch();

  const { causes, status } = useSelector((state) => state.causes);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCauses());
    }
  }, [status, dispatch]);

  useEffect(() => {
    dispatch(fetchDonors())
  }, [dispatch]);

  // Filtered Causes based on search query
  const filteredCauses = causes.filter((cause) => {
    return (
      !cause.isDelete && 
      cause.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleShowAll = () => {
    setShowAll(!showAll);
  };

  const causesToShow = showAll ? filteredCauses : filteredCauses.slice(0, 5);

  return (
    <>
      <Card className="shadow">
        <CardHeader className="border-0">
          <Row className="align-items-center d-flex justify-content-between">
            <div className="col-auto">
              <h3 className="mb-0">Projects & Events</h3>
            </div>
            <div className="col-auto d-flex align-items-center">
              {/* Search Bar */}
              <Input
                type="text"
                placeholder="Search by project/event..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-0 mr-2"
                style={{ width: "300px" }} // Set the width here
              />
              {/* Show All Button */}
              <Button
                color="primary"
                onClick={handleShowAll}
                size="sm"
              >
                {showAll ? "Show Less" : "Show All"}
              </Button>
            </div>
          </Row>
        </CardHeader>

        {/* Displaying the number of causes shown */}
       

        <Table className="align-items-center table-flush" responsive>
          <thead className="thead-light">
            <tr>
              <th scope="col">Project/Event name</th>
              <th scope="col">Donation Goal( &#8377; )</th>
              <th scope="col">Donation Raised ( &#8377; )</th>
              <th scope="col">Donation Raised (%)</th>
            </tr>
          </thead>
          <tbody>
            {causesToShow.map((cause) => (
              <tr key={cause.id}>
                <th scope="row">{cause.name}</th>
                <td>{cause.goal.toLocaleString("en-IN")}</td>
                <td>{cause.raised.toLocaleString("en-IN")}</td>
                <td>
                  <i className="fas fa-arrow-up text-success mr-3" />{" "}
                  {((cause.raised / cause.goal) * 100).toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <CardBody>
          <Row>
            <Col>
              <p className='text-green'>
                Showing {causesToShow.length} out of {filteredCauses.length} causes
              </p>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  );
};

export default CausesEvents;
