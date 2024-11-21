import React, { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import AuthNavbar from "components/Navbars/AuthNavbar";
import AuthFooter from "components/Footers/AuthFooter";

const Auth = () => {
  const mainContent = useRef(null);
  const location = useLocation();

  // Adding background color when the component mounts
  useEffect(() => {
    document.body.classList.add("bg-default");
    return () => {
      document.body.classList.remove("bg-default");
    };
  }, []);

  // Reset scroll position when location changes
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  return (
    <>
      <div className="main-content" ref={mainContent}>
        <AuthNavbar />
        <div className="header bg-gradient-green py-7 py-lg-8">
          <Container>
            <div className="header-body text-center mb-7">
              <Row className="justify-content-center">
                <Col lg="5" md="6">
                  <h1 className="text-white">
                    Welcome! <br /> To Nasarna Children Trust
                  </h1>
                </Col>
              </Row>
            </div>
          </Container>
          <div className="separator separator-bottom separator-skew zindex-100"></div>
        </div>
        {/* Render the nested routes defined in AppRoutes */}
        <Container className="mt--8 pb-5">
          <Row className="justify-content-center">
            <Outlet />
          </Row>
        </Container>
      </div>
      <AuthFooter />
    </>
  );
};

export default Auth;
