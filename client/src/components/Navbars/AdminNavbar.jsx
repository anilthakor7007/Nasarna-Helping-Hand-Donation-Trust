import { Link } from "react-router-dom";
import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Form,
  FormGroup,
  Navbar,
  Nav,
  Container,
  Media,
} from "reactstrap";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/auth-slice/authSlice";
import { toast } from "react-toastify";

const AdminNavbar = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const toggle = () => setDropdownOpen(!dropdownOpen);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    role: ""
  });

  useEffect(() => {
    const name = localStorage.getItem("user") || "";
    const email = localStorage.getItem("email") || "";
    const role = localStorage.getItem("role") || "";

    setProfileData({ name, email, role });
    setLoading(false);
  }, []);

  
  const handleLogout = () => {
    const toastId = toast.info(
      <div>
        <p>Are you sure you want to logout?</p>
        <button
          onClick={() => confirmLogout(toastId)}
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
          onClick={() => toast.dismiss(toastId)}
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
        autoClose: false, // Disable auto-close to keep the confirmation toast visible
        closeOnClick: false,
        draggable: false,
        closeButton: false,
        hideProgressBar: true,
      }
    );
  };
  
  const confirmLogout = (toastId) => {
    dispatch(logout());
    localStorage.clear();
    setProfileData({ name: "", email: "", role: "" });
  
    toast.success("Logged out successfull!", {
      autoClose: 2000, 
      hideProgressBar: true,
    });
    toast.dismiss(toastId);
    navigate("/login", { replace: true });
  };
  

  return (
    <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
      <Container fluid>
        <Link
          className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
          to="/"
        >
          {props.brandText}
        </Link>
        <Form className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">
          <FormGroup className="mb-0">
            {/* Add search form elements if needed */}
          </FormGroup>
        </Form>
        <Nav className="align-items-center d-none d-md-flex" navbar>
          <Dropdown nav isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle nav>
              <Media className="align-items-center">
                <span className="avatar avatar-sm rounded-circle">
                  <img
                    alt="..."
                    src={require("../../assets/img/theme/user.jpg")}
                  />
                </span>
                <Media className="ml-2 d-none d-lg-block">
                  <span className="mb-0 text-sm font-weight-bold">
                    {profileData.name}
                  </span>
                </Media>
              </Media>
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem className="noti-title" header tag="div">
                <h6 className="text-overflow m-0">Welcome!</h6>
              </DropdownItem>
              <DropdownItem to="/admin/user-profile" tag={Link}>
                <i className="ni ni-single-02" />
                <span>My profile</span>
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem onClick={handleLogout}>
                <i className="ni ni-user-run" />
                <span>Logout</span>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default AdminNavbar;
