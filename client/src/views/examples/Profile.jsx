// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";
import UserHeader from "components/Headers/UserHeader";
import React, { useState, useEffect, useMemo } from "react";
import { fetchTrustees } from "store/trustee-slice/trusteeSlice";
import { useDispatch, useSelector } from "react-redux";
import UserprofileData from "../../components/comman/UserprofileData";

const Profile = ({ props }) => {
  // State to hold profile data
  const userId = localStorage.getItem("userId") || "";
  console.log("logedin user id", userId);
  const dispatch = useDispatch();
  
  const [profileData, setProfileData] = useState({
    name: "",
    aboutMe: "",
    address: "",
    city: localStorage.getItem('city'),
    country: "",
    postalCode: "",
    role: "",
  });
  const { trustees, status } = useSelector((state) => state.trustees);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTrustees());
    }
  }, [status, dispatch]);
  console.log(trustees);
  const filteredTrusteed = useMemo(() => {
    return trustees?.filter((trustee) => trustee.userId && trustee.userId._id);
  }, [trustees, userId]);

  const loggedInTrustee = filteredTrusteed?.find(
    (trustee) => trustee.userId._id === userId
  );

  console.log("login trustee data", loggedInTrustee);

  // Fetch profile data from localStorage on component mount
  useEffect(() => {
    const name = localStorage.getItem("user") || "";
    const email = localStorage.getItem("email") || "";
    const aboutMe = localStorage.getItem("aboutMe") || "";
    const address = localStorage.getItem("address") || "";
    const city = localStorage.getItem("city") || "";
    const country = localStorage.getItem("country") || "";
    const postalCode = localStorage.getItem("postalCode") || "";
    const role = localStorage.getItem("role") || "";

    setProfileData({
      name,
      aboutMe,
      address,
      city,
      country,
      postalCode,
      email,
      role,
    });
  }, []);

  return (
    <>
      <UserHeader />
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
            <Card className="card-profile shadow">
              <CardHeader>
                <Row className="justify-content-center">
                  <Col className="order-lg-2" lg="3">
                    <div
                      className="card-profile-image"
                      style={{ marginTop: "-50px" }}
                    >
                      <a href="#pablo" onClick={(e) => e.preventDefault()}>
                        <img
                          alt="..."
                          className="rounded-circle"
                          height="150px"
                          width="150px"
                          src={require("../../assets/img/theme/user.jpg")}
                        />
                      </a>
                    </div>
                    <div className="mt-7"></div>
                  </Col>
                </Row>
              </CardHeader>

              <CardBody className="pt-0 pt-md-4">
                <div className="text-center">
                  <h3>
                  {profileData.name && profileData.name !== ""
                      ? profileData.name.charAt(0).toUpperCase() +
                        profileData.name.slice(1)
                      : ""}{" "}
                    {/* {profileData.name} */}
                    <span className="font-weight-light"></span>
                  </h3>
                  <div className="h5 font-weight-300">
                    <i className="ni location_pin mr-2" />
                    {profileData.city && profileData.city !== ""
                      ? profileData.city
                       
                      : ""}{" "}
                   , India
                  </div>
                  <div className="h5 mt-4">
                    <i className="ni business_briefcase-24 mr-2" />
                    {profileData.role && profileData.role !== ""
                      ? profileData.role.charAt(0).toUpperCase() +
                        profileData.role.slice(1)
                      : ""}{" "}
                    - Nasarna Trust
                  </div>
                  <div>
                    <i className="ni education_hat mr-2" />
                    Nasarna helping hand
                  </div>
                  <hr className="my-4" />
                  <p>
                    Nasarna Children Trust is dedicated to uplifting the lives
                    of underprivileged and helpless children.{" "}
                  </p>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col className="order-xl-1" xl="8">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">My account</h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <h6 className="heading-small text-muted mb-4">
                    User information
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-name"
                          >
                            Full name
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-name"
                            placeholder="Full name"
                            type="text"
                            value={profileData.name}
                            readOnly
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Email address
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-email"
                            placeholder="Email address"
                            type="email"
                            value={profileData.email}
                            readOnly
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  <h6 className="heading-small text-muted mb-4">
                    Contact information
                  </h6>
                  {profileData.role === "trustee" ? (
                    <UserprofileData props={loggedInTrustee} />
                  ) : (
                    <div className="pl-lg-4">
                      <Row>
                        <Col md="12">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-address"
                            >
                              Address
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-address"
                              placeholder="Home Address"
                              type="text"
                              value={profileData.address}
                              readOnly
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-city"
                            >
                              City
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-city"
                              placeholder="City"
                              type="text"
                              value={profileData.city}
                              readOnly
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-country"
                            >
                              Country
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-country"
                              placeholder="Country"
                              type="text"
                              value={profileData.country}
                              readOnly
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-postal-code"
                            >
                              Postal code
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-postal-code"
                              placeholder="Postal code"
                              type="number"
                              value={profileData.postalCode}
                              readOnly
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <hr className="my-4" />
                      <h6 className="heading-small text-muted mb-4">
                        About me
                      </h6>
                      <div className="pl-lg-4">
                        <FormGroup>
                          <label>About Me</label>
                          <Input
                            className="form-control-alternative"
                            placeholder="A few words about you ..."
                            rows="4"
                            value={profileData.aboutMe}
                            type="textarea"
                            readOnly
                          />
                        </FormGroup>
                      </div>
                    </div>
                  )}
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Profile;
