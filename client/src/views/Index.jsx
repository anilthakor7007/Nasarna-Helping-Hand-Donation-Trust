import Header from "components/Headers/Header";
import TrusteeDonorCounts from "components/comman/TrusteeDonorCounts";
import CausesEvents from "components/comman/CausesEvents";

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Table,
  Container,
  Row,
  Col,
  Progress,
  Input,
} from "reactstrap";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDonors } from "store/donor-slice/donorSlice";

const Index = (props) => {
  const dispatch = useDispatch();
  const { donors } = useSelector((state) => state.donors);
  const [cityDonorCount, setCityDonorCount] = useState([]);
  const [showAll, setShowAll] = useState(false); // State to control "Show All" functionality
  const [searchQuery, setSearchQuery] = useState(""); // State to control the search query

  useEffect(() => {
    dispatch(fetchDonors());
  }, [dispatch]);

  useEffect(() => {
    if (donors.length > 0) {
      // Create an object to store donor count per city
      const cityCountMap = donors.reduce((acc, donor) => {
        const city = donor.city.toLowerCase(); // Convert city name to lowercase for consistency
        if (city) {
          // Increment count of donors from the same city
          acc[city] = acc[city] ? acc[city] + 1 : 1;
        }
        return acc;
      }, {});

      // Convert the city count object to an array of { city, count }
      const cityDonors = Object.entries(cityCountMap).map(([city, count]) => ({
        city: city.charAt(0).toUpperCase() + city.slice(1), // Capitalize the first letter for display
        count,
        percentage: ((count / donors.length) * 100).toFixed(2),
      }));

      // Sort the cities by donor count in descending order
      cityDonors.sort((a, b) => b.count - a.count);

      // Set the state with the city count data
      setCityDonorCount(cityDonors);
    }
  }, [donors]);

  // Handler for toggling the "Show All" functionality
  const handleShowAll = () => {
    setShowAll(!showAll);
  };

  // Filter the cities based on the search query
  const filteredCityDonorCount = cityDonorCount.filter((cityDonor) =>
    cityDonor.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Only show the top 5 cities or all cities based on the showAll state
  const displayedCityDonorCount = showAll
    ? filteredCityDonorCount
    : filteredCityDonorCount.slice(0, 5);

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col xl="12" className="mt-5">
            <TrusteeDonorCounts />
          </Col>
        </Row>
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="12">
            <CausesEvents />
          </Col>
          <Col xl="12" className="mt-5">
            <Card className="shadow">
              <CardHeader className="border-0">
              <Row className="align-items-center d-flex justify-content-between">
  <div className="col-auto">
    <h3 className="mb-0">Donors & Cities</h3>
  </div>
  <div className="col-auto d-flex align-items-center">
    {/* Search Bar */}
    <Input
      type="text"
      placeholder="Search by city..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="mb-0 mr-2 pt-0 pb-0" // Added margin-right for spacing
      style={{ width: "300px",  }} // Set the width here
    />
    {/* Show All Button */}
    <Button
      color="primary"
      onClick={handleShowAll} // Toggle show all functionality
      size="sm"
    >
      {showAll ? "Show Top 5" : "Show All"}
    </Button>
  </div>
</Row>

              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">No</th>
                    <th scope="col">Cities</th>
                    <th scope="col">Donors</th>
                    <th scope="col">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedCityDonorCount.map(
                    ({ city, count, percentage }, index) => (
                      <tr key={city}>
                        <td>{index + 1}</td>
                        <th scope="row">{city}</th>
                        <td>{count}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <span className="mr-2">{percentage}%</span>
                            <div>
                              <Progress max="100" value={percentage} />
                            </div>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;
