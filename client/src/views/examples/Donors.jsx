// src/components/Donors.js
import React, { useEffect, useState } from "react";
import {
  Badge,
  Card,
  CardHeader,
  Table,
  Container,
  Row,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
} from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import DonorModal  from "./Donations"
import {
  fetchDonors,
  deleteDonor,
  toggleDonorStatus,
  createDonor,
  updateDonor,
} from "../../store/donor-slice/donorSlice";
import { toast } from "react-toastify";
import Header from "components/Headers/Header";
import PaginationComponent from "components/comman/Pagination";

const Donors = () => {
  const dispatch = useDispatch();
  const { donors, status } = useSelector((state) => state.donors);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const openCreateModal = () => setCreateModalOpen(true);
  const closeCreateModal = () => setCreateModalOpen(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editDonor, setEditDonor] = useState(null);
  const [editDonorId, setEditDonorId] = useState(null);
  const createdBy = localStorage.getItem('userId');
  const [newDonor, setNewDonor] = useState({
    name: "",
    email: "",
    createdBy: createdBy,
    phone: "",
    role:"donor",
    address: "",
    city: "",
    gender: "",
    pincode: "",
    status: "active",
  });
  console.log(createdBy);
  const [errors, setErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDonors = donors
  ?.filter(donor => {
    if (!donor.isDeleted) {
      if (searchQuery !== '' && searchQuery !== undefined) {
        return (
          donor.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          donor.userId?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          donor.city?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      } else {
        return (
          donor.userId?.name?.toLowerCase() || 
          donor.userId?.email?.toLowerCase() || 
          donor.city?.toLowerCase()
        );
      }
    }
    return false;
  })
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const activeDonors = donors
    .filter((donor) => !donor.isDeleted)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDonors = filteredDonors.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchDonors());
    }
  }, [status, dispatch]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = (id) => {
    toast.info(
      <div>
        <p>Are you sure you want to Delete Donor?</p>
        <button
          onClick={() => confirmDelete(id)}
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
        closeOnClick: true,
        draggable: false,
        closeButton: true,
        hideProgressBar: true,
      }
    );
  };

  const confirmDelete = (id) => {
    dispatch(deleteDonor(id));
  };

  const handleStatus = (id) => {
    dispatch(toggleDonorStatus(id));
  };

  const handleEdit = (id) => {
    const donorToEdit = activeDonors.find((donor) => donor._id === id);
    setEditDonorId(id);
    setEditDonor({ ...donorToEdit });
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditDonor(null);
    setEditModalOpen(false);
  };
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
  
    setEditDonor((prevDonor) => {
    
      if (name === "name" || name === "email") {
        return {
          ...prevDonor,
          userId: {
            ...prevDonor.userId,
            [name]: value, 
          },
        };
      }
  
      // For other fields, update them directly
      return {
        ...prevDonor,
        [name]: value,
      };
    });
  };
  

  const handleEditDonor = (e) => {
    e.preventDefault();
    dispatch(updateDonor({ id: editDonorId, ...editDonor }));
    closeEditModal();
  };

  const handleViewDetails = (id) => {
    const donor = activeDonors.find((donor) => donor._id === id);
    setSelectedDonor(donor);
    setModalOpen(true);
  };
  const handleDonationViewDetails = (id) => {
    <DonorModal 
    
    />
   
  };

  const closeModal = () => {
    setSelectedDonor(null);
    setModalOpen(false);
  };

  const validateField = (name, value) => {
    let error = "";

    if (!value) {
      error = "This field is required";
    } else {
      switch (name) {
        case "email":
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) error = "Please enter a valid email";
          break;
        case "phone":
          const phoneRegex = /^[0-9]{10}$/;
          if (!phoneRegex.test(value))
            error = "Please enter a valid 10-digit phone number";
          break;
        case "pincode":
          const pincodeRegex = /^[0-9]{6}$/;
          if (!pincodeRegex.test(value))
            error = "Please enter a valid 6-digit pincode";
          break;
        default:
          break;
      }
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDonor({ ...newDonor, [name]: value });

    // Validate each field on change
    validateField(name, value);
  };

  const handleCreateDonor = async (e) => {
    e.preventDefault();
  
    // Check for any remaining validation errors before submitting
    const hasErrors = Object.values(errors).some((error) => error);
    if (hasErrors) {
      toast.error("Please correct the errors before submitting");
      return;
    }
  
    try {
      // Dispatch the createDonor action and wait for the result
      const result = await dispatch(createDonor(newDonor)).unwrap();
  
      // Handle success
      setNewDonor({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        gender: "",
        pincode: "",
        status: "active",
      });
      closeCreateModal();
    } catch (error) {
      // Handle failure
      console.error("Error creating donor:", error);
    }
  };
  

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0 d-flex justify-content-between align-items-center">
                <h3 className="mb-0">Donors List</h3>
                <div className="d-flex align-items-center">
                  <Input
                    type="text"
                    placeholder="Search by Name or Email or city"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mr-4"
                  />
                  <Button
                    style={{ width: "300px" }}
                    color="primary"
                    onClick={openCreateModal}
                  >
                    Create Donor
                  </Button>
                </div>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">DonerId</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Status</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDonors.map((donor) => (
                    <tr key={donor._id}>
                      <td>{donor._id || "N/A"}</td>
                      <td>{donor.userId?.name || "N/A"}</td>
                      <td>{donor.userId?.email || "N/A"}</td>
                      <td>
                        <Badge color="" className="badge-dot mr-4">
                          <i
                            className={
                              donor.status === "active"
                                ? "bg-success"
                                : "bg-warning"
                            }
                          />
                          {donor.status}
                        </Badge>
                      </td>
                      <td className="text-right">
                        <UncontrolledDropdown>
                          <DropdownToggle
                            className="btn-icon-only text-light"
                            href="#pablo"
                            role="button"
                            size="sm"
                            color=""
                            onClick={(e) => e.preventDefault()}
                          >
                            <i className="fas fa-ellipsis-v" />
                          </DropdownToggle>
                          <DropdownMenu className="dropdown-menu-arrow" right>
                            <DropdownItem
                              onClick={() => handleViewDetails(donor._id)}
                            >
                              View
                            </DropdownItem>
                            <DropdownItem onClick={() => handleEdit(donor._id)}>
                              Edit
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => handleDelete(donor._id)}
                            >
                              Delete
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => handleStatus(donor._id)}
                            >
                              {donor.status === "active"
                                ? "Deactivate"
                                : "Activate"}
                            </DropdownItem>
                              <DropdownItem
                              onClick={() => handleDonationViewDetails(donor._id)}
                            >
                              View Donation Details
                              <DonorModal
                                donorId={selectedDonor}
                                // isOpen={modalOpen}
                                // toggle={toggle}
                              
                              
                              />
                            </DropdownItem>
                           

                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <PaginationComponent
                totalItems={activeDonors.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </Card>
          </div>
        </Row>
      </Container>

      {/* View Modal */}
      <Modal isOpen={modalOpen} toggle={closeModal}>
        <ModalHeader toggle={closeModal}>Donor Details</ModalHeader>
        <ModalBody>
          {selectedDonor && (
            <div>
              <h5>Name: {selectedDonor.userId?.name}</h5>
              <p>Email: {selectedDonor.userId?.email}</p>
              <p>Gender: {selectedDonor.gender}</p>
              <p>Phone: {selectedDonor.phone}</p>
              <p>Address: {selectedDonor.address}</p>
              <p>City: {selectedDonor.city}</p>
              <p>Pincode: {selectedDonor.pincode}</p>
              <p>Status: {selectedDonor.status}</p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={closeModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>

      {/* Create Modal */}
      <Modal isOpen={createModalOpen} toggle={closeCreateModal}>
        <ModalHeader toggle={closeCreateModal}>Create Donor</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleCreateDonor}>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                type="text"
                name="name"
                id="name"
                value={newDonor.name}
                onChange={handleInputChange}
                required
                invalid={!!errors.name}
              />
              <FormFeedback>{errors.name}</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                type="email"
                name="email"
                id="email"
                value={newDonor.email}
                onChange={handleInputChange}
                required
                invalid={!!errors.email}
              />
              <FormFeedback>{errors.email}</FormFeedback>
            </FormGroup>
            <FormGroup>
        <Label for="gender">Gender</Label>
        <div>
          <FormGroup check inline>
            <Label check>
              <Input
                type="radio"
                name="gender"
                value="male"
                checked={newDonor.gender === "male"}
                onChange={handleInputChange}
                required
              />
              Male
            </Label>
          </FormGroup>
          <FormGroup check inline>
            <Label check>
              <Input
                type="radio"
                name="gender"
                value="female"
                checked={newDonor.gender === "female"}
                onChange={handleInputChange}
                required
              />
              Female
            </Label>
          </FormGroup>
          <FormGroup check inline>
            <Label check>
              <Input
                type="radio"
                name="gender"
                value="other"
                checked={newDonor.gender === "other"}
                onChange={handleInputChange}
                required
              />
              Other
            </Label>
          </FormGroup>
        </div>
        <FormFeedback>{errors.gender}</FormFeedback>
      </FormGroup>

            <FormGroup>
              <Label for="phone">Phone</Label>
              <Input
                type="text"
                name="phone"
                id="phone"
                value={newDonor.phone}
                onChange={handleInputChange}
                required
                invalid={!!errors.phone}
              />
              <FormFeedback>{errors.phone}</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for="address">Address</Label>
              <Input
                type="text"
                name="address"
                placeholder="eg. Home number, Area, Socity"
                id="address"
                value={newDonor.address}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="city">City</Label>
              <Input
                type="text"
                name="city"
                id="city"
                value={newDonor.city}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="pincode">Pincode</Label>
              <Input
                type="text"
                name="pincode"
                id="pincode"
                value={newDonor.pincode}
                onChange={handleInputChange}
                required
                invalid={!!errors.pincode}
              />
              <FormFeedback>{errors.pincode}</FormFeedback>
            </FormGroup>
            <Button color="primary" type="submit">
              Create Donor
            </Button>
          </Form>
        </ModalBody>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={editModalOpen} toggle={closeEditModal}>
        <ModalHeader toggle={closeEditModal}>Edit Donor</ModalHeader>
        <ModalBody>
          {editDonor && (
            <Form onSubmit={handleEditDonor}>
              <FormGroup>
                <Label for="name">Name</Label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  value={editDonor.userId?.name}
                  onChange={handleEditInputChange}
                  required
                  invalid={!!errors.name}
                />
                <FormFeedback>{errors.name}</FormFeedback>
              </FormGroup>
              <FormGroup>
                <Label for="email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  value={editDonor.userId?.email}
                  onChange={handleEditInputChange}
                  required
                  invalid={!!errors.email}
                />
                <FormFeedback>{errors.email}</FormFeedback>
              </FormGroup>
              <FormGroup>
                <Label for="gender">Gender</Label>
                <div>
                  <FormGroup check inline>
                    <Label check>
                      <Input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={editDonor.gender === "male"}
                        onChange={handleEditInputChange}
                        required
                      />
                      Male
                    </Label>
                  </FormGroup>
                  <FormGroup check inline>
                    <Label check>
                      <Input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={editDonor.gender === "female"}
                        onChange={handleEditInputChange}
                        required
                      />
                      Female
                    </Label>
                  </FormGroup>
                  <FormGroup check inline>
                    <Label check>
                      <Input
                        type="radio"
                        name="gender"
                        value="other"
                        checked={editDonor.gender === "other"}
                        onChange={handleEditInputChange}
                        required
                      />
                      Other
                    </Label>
                  </FormGroup>
                </div>
                <FormFeedback>{errors.gender}</FormFeedback>
              </FormGroup>

              <FormGroup>
                <Label for="phone">Phone</Label>
                <Input
                  type="text"
                  name="phone"
                  id="phone"
                  value={editDonor.phone}
                  onChange={handleEditInputChange}
                  required
                  invalid={!!errors.phone}
                />
                <FormFeedback>{errors.phone}</FormFeedback>
              </FormGroup>
              <FormGroup>
                <Label for="address">Address</Label>
                <Input
                  type="text"
                  name="address"
                  id="address"
                  value={editDonor.address}
                  onChange={handleEditInputChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="city">City</Label>
                <Input
                  type="text"
                  name="city"
                  id="city"
                  value={editDonor.city}
                  onChange={handleEditInputChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="pincode">Pincode</Label>
                <Input
                  type="text"
                  name="pincode"
                  id="pincode"
                  value={editDonor.pincode}
                  onChange={handleEditInputChange}
                  required
                  invalid={!!errors.pincode}
                />
                <FormFeedback>{errors.pincode}</FormFeedback>
              </FormGroup>
              <Button color="primary" type="submit">
                Update Donor
              </Button>
            </Form>
          )}
        </ModalBody>
      </Modal>
    </>
  );
};

export default Donors;
