import React, { useEffect, useState, useMemo } from "react";
import { fetchTrustees } from "../../store/trustee-slice/trusteeSlice";
import { fetchDonorCountsForTrustees } from "../../store/donor-slice/donorSlice";
import { Button, Card, CardHeader, Table, Row, Col, Input } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import "bootstrap-icons/font/bootstrap-icons.css";


const TrusteeDonorCounts = () => {
  const dispatch = useDispatch();
  const { donorCounts } = useSelector((state) => state.donors);
  const { trustees } = useSelector((state) => state.trustees);
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleShowAll = (e) => {
    e.preventDefault();
    setShowAll(!showAll);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    dispatch(fetchTrustees());
  }, [dispatch]);

  // Memoize trusteeIds to prevent infinite loop in second useEffect
  const trusteeIds = useMemo(() => {
    return trustees
      ?.filter((trustee) => trustee.userId && trustee.userId._id)
      .map((trustee) => trustee.userId._id);
  }, [trustees]);

  useEffect(() => {
    if (trusteeIds && trusteeIds.length > 0) {
      dispatch(fetchDonorCountsForTrustees(trusteeIds));
    }
  }, [dispatch, JSON.stringify(trusteeIds)]);

  const filteredDonorCounts = useMemo(() => {
    return donorCounts.filter((trustee) =>
      trustee.trusteeName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [donorCounts, searchQuery]);

  if (!donorCounts || donorCounts.length === 0) {
    return <p>No data available</p>;
  }

  return (
    <>
      <Card className="shadow">
        <CardHeader className="border-0">
          <Row className="align-items-center">
            <Col md="6">
              <h3 className="mb-0">Trustees Details</h3>
            </Col>
            <Col md="6" className="d-flex justify-content-end align-items-center">
              <Input
                type="text"
                placeholder="Search by Trustee Name"
                value={searchQuery}
                onChange={handleSearchChange}
                className="mr-2"
                style={{ maxWidth: "200px" }}
              />
              <Button
                color="primary"
                onClick={handleShowAll}
                size="sm"
              >
                {showAll ? "Show Top 5" : "See All"}
              </Button>
            </Col>
          </Row>
        </CardHeader>
        <Table className="align-items-center table-flush table-auto w-full" responsive>
          <thead className="thead-light">
            <tr>
              <th scope="col">No</th>
              <th scope="col">Trustee Name</th>
              <th scope="col">Donors</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(filteredDonorCounts) &&
              [...filteredDonorCounts]
                .sort((a, b) => b.donorCount - a.donorCount)
                .slice(0, showAll ? filteredDonorCounts.length : 5)
                .map((trustee, index) => (
                  <tr key={trustee._id}>
                    <td>{index + 1}</td>
                    <td>{trustee.trusteeName || "Unknown"}</td>
                    <td>{trustee.donorCount || 0}</td>
                  </tr>
                ))}
          </tbody>
        </Table>
      </Card>
    </>
  );
};

export default TrusteeDonorCounts;
