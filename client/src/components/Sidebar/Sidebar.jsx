import { useState } from "react";
import { NavLink as NavLinkRRD, Link, useNavigate } from "react-router-dom";
import { PropTypes } from "prop-types";
import { useDispatch } from "react-redux"; 
import { toast } from 'react-toastify'; 
import { logout } from '../../store/auth-slice/authSlice';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Collapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Media,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
} from "reactstrap";

const Sidebar = (props) => {
  // console.log(props);
  const [collapseOpen, setCollapseOpen] = useState(false); 
  const dispatch = useDispatch(); // Initialize dispatch
  const navigate = useNavigate(); // Use navigate for redirection

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };

  // toggles collapse between opened and closed (true/false)
  const toggleCollapse = () => {
    setCollapseOpen((data) => !data);
  };

  // closes the collapse
  const closeCollapse = () => {
    setCollapseOpen(false);
  };

  // creates the links that appear in the left menu / Sidebar
  const createLinks = (routes) => {
    return routes.map((prop, key) => {
      const path = (prop.layout || '') + (prop.path || ''); 
      // console.log(prop.layout);
      return (
        <NavItem key={key}>
          <NavLink
            to={path}
            tag={NavLinkRRD}
            onClick={closeCollapse}
          >
            <i className={prop.icon} />
            {prop.name}
          </NavLink>
        </NavItem>
      );
    });
  };

  const handleLogout = () => {
    // Show confirmation dialog before logout
    toast.info(
      <div>
        <p>Are you sure you want to logout?</p>
        <button
          onClick={() => confirmLogout()}
          style={{
            marginRight: "10px",
            padding: "5px 10px",
            border: "none",
            backgroundColor: "#d9534f",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Yes
        </button>
        <button
          onClick={() => toast.dismiss()}
          style={{
            padding: "5px 10px",
            border: "none",
            backgroundColor: "#5bc0de",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
        hideProgressBar: true,
      }
    );
  };

  const confirmLogout = () => {
    // Perform logout actions
    dispatch(logout());
    
    // Remove role and token from localStorage
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    
    // Show success toast
    toast.success("Logout successful!", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
    });
    
    // Redirect to login page
    navigate("/login");
  };
  

  const { bgColor, routes, logo } = props;
  let navbarBrandProps;
  if (logo && logo.innerLink) {
    navbarBrandProps = {
      to: logo.innerLink,
      tag: Link,
    };
  } else if (logo && logo.outterLink) {
    navbarBrandProps = {
      href: logo.outterLink,
      target: "_blank",
    };
  }

  return (
    <>
      <Navbar
        className="navbar-vertical fixed-left navbar-light bg-white"
        expand="md"
        id="sidenav-main"
      >
        <Container fluid>
          {/* Toggler */}
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleCollapse}
          >
            <span className="navbar-toggler-icon" />
          </button>
          {/* Brand */}
          {logo ? (
            <NavbarBrand className="pt-0" {...navbarBrandProps}>
              <img
                alt={logo.imgAlt}
                className="navbar-brand-img"
                src={logo.imgSrc}
              />
            </NavbarBrand>
          ) : null}
          {/* User */}
          <Nav className="align-items-center d-md-none">
            <UncontrolledDropdown nav>
              <DropdownToggle nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle">
                    <img
                      alt="..."
                      src={require("../../assets/img/theme/user.jpg")}
                    />
                  </span>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">Welcome!</h6>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-single-02" />
                  <span>My profile</span>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem href="#pablo" onClick={(e) => e.preventDefault()}>
                  <i className="ni ni-user-run" />
                  <span onClick={handleLogout}>Logout</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
          {/* Collapse */}
          <Collapse navbar isOpen={collapseOpen}>
            {/* Collapse header */}
            <div className="navbar-collapse-header d-md-none">
              <Row>
                {logo ? (
                  <Col className="collapse-brand" xs="6">
                    {logo.innerLink ? (
                      <Link to={logo.innerLink}>
                        <img alt={logo.imgAlt} src={logo.imgSrc} />
                      </Link>
                    ) : (
                      <a href={logo.outterLink}>
                        <img alt={logo.imgAlt} src={logo.imgSrc} />
                      </a>
                    )}
                  </Col>
                ) : null}
                <Col className="collapse-close" xs="6">
                  <button
                    className="navbar-toggler"
                    type="button"
                    onClick={toggleCollapse}
                  >
                    <span />
                    <span />
                  </button>
                </Col>
              </Row>
            </div>
            {/* Form */}
            <Form className="mt-4 mb-3 d-md-none">
              <InputGroup className="input-group-rounded input-group-merge">
                <Input
                  aria-label="Search"
                  className="form-control-rounded form-control-prepended"
                  placeholder="Search"
                  type="search"
                />
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <span className="fa fa-search" />
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </Form>
            {/* Navigation */}
            <Nav navbar>{createLinks(routes)}</Nav>
            {/* Divider */}
            <hr className="my-3" />
          </Collapse>
        </Container>
      </Navbar>
    </>
  );
};

Sidebar.defaultProps = {
  routes: [{}],
};

Sidebar.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object),
  logo: PropTypes.shape({
    innerLink: PropTypes.string,
    outterLink: PropTypes.string,
    imgSrc: PropTypes.string.isRequired,
    imgAlt: PropTypes.string.isRequired,
  }),
};

export default Sidebar;
