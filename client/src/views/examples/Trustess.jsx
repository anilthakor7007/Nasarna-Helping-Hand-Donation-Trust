// src/components/Trustees.js
import React, { useEffect } from "react";
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
import {
  fetchTrustees,
  deleteTrustee,
  toggleTrusteeStatus,
  createTrustee,
  updateTrustee,
} from "../../store/trustee-slice/trusteeSlice";
import { toast } from "react-toastify";
import Header from "components/Headers/Header";
import { useState } from "react";
import PaginationComponent from "components/comman/Pagination";

const Trustees = () => {
  const dispatch = useDispatch();
  const { trustees, status } = useSelector((state) => state.trustees);
  const [selectedTrustee, setSelectedTrustee] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const openCreateModal = () => setCreateModalOpen(true);
  const closeCreateModal = () => setCreateModalOpen(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTrustee, setEditTrustee] = useState(null);
  const [editTrusteeId, setEditTrusteeId] = useState(null);
  const [newTrustee, setNewTrustee] = useState({
    name: "",
    email: "",
    role: "trustee",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    status: "active",
  });
  const [errors, setErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    // Retrieve role from local storage
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  // const role = localStorage.getItem("role");

  // console.log(trustees);
  // const filteredTrustees = trustees.filter(trustee =>
  //   !trustee.isDeleted &&
  //   (trustee.userId?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //   trustee.userId?.email.toLowerCase().includes(searchQuery.toLowerCase()))
  // ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const filteredTrustees = trustees
    ?.filter((trustee) => {
      if (!trustee?.isDeleted) {
        if (searchQuery !== "" && searchQuery !== undefined) {
          return (
            trustee.userId?.name
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            trustee.userId?.email
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase())
          );
        } else {
          return (
            trustee.userId?.name?.toLowerCase() ||
            trustee.userId?.email?.toLowerCase()
          );
        }
      }
      return false;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  // const filteredTrustees = trustees
  // .filter(trustee => !trustee.isDeleted)
  // .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTrustees = filteredTrustees.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTrustees());
    }
  }, [status, dispatch]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = (id) => {
    toast.info(
      <div>
        <p>Are you sure you want to Delete Trustee?</p>
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
        closeOnClick: false,
        draggable: false,
        closeButton: false,
        hideProgressBar: true,
      }
    );
  };

  const confirmDelete = (id) => {
    dispatch(deleteTrustee(id));
  };

  const handleStatus = (id) => {
    // console.log("toggle status", id);
    dispatch(toggleTrusteeStatus(id));
  };

  const handleEdit = (id) => {
    const trusteeToEdit = filteredTrustees.find(
      (trustee) => trustee._id === id
    );
    setEditTrusteeId(id);
    // console.log("edit this trustee", trusteeToEdit);
    setEditTrustee({ ...trusteeToEdit });
    setEditModalOpen(true);
  };
  const closeEditModal = () => {
    setEditTrustee(null);
    setEditModalOpen(false);
  };
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;

    setEditTrustee((prevTrustee) => {
      // Check if the field is part of userId (i.e., name or email)
      if (name === "name" || name === "email") {
        return {
          ...prevTrustee,
          userId: {
            ...prevTrustee.userId,
            [name]: value,
          },
        };
      }

      return {
        ...prevTrustee,
        [name]: value,
      };
    });
  };

  const handleEditTrustee = (e) => {
    e.preventDefault();
    dispatch(updateTrustee({ id: editTrusteeId, ...editTrustee }));
    closeEditModal();
  };

  const handleViewDetails = (id) => {
    const trustee = filteredTrustees.find((trustee) => trustee._id === id);
    setSelectedTrustee(trustee);
    setModalOpen(true);
  };
  const closeModal = () => {
    setSelectedTrustee(null);
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
    setNewTrustee({ ...newTrustee, [name]: value });

    // Validate each field on change
    validateField(name, value);
  };

  const handleCreateTrustee = (e) => {
    e.preventDefault();

    // Check for any remaining validation errors before submitting
    const hasErrors = Object.values(errors).some((error) => error);
    if (hasErrors) {
      toast.error("Please correct the errors before submitting");
      return;
    }

    dispatch(createTrustee(newTrustee));
    setNewTrustee({
      name: "",
      email: "",
      role: "trustee",
      phone: "",
      address: "",
      city: "",
      pincode: "",
      status: "active",
    });
    closeCreateModal();
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0 d-flex justify-content-between align-items-center">
                <h3 className="mb-0">Trustees List</h3>
                <div className="d-flex align-items-center">
                  <Input
                    type="text"
                    placeholder="Search by Name or Email"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mr-4"
                  />
                  {role === "admin" && (
                    <Button
                      style={{ width: "300px" }}
                      color="primary"
                      onClick={openCreateModal}
                    >
                      Create Trustee
                    </Button>
                  )}
                </div>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Status</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTrustees.map((trustee) => (
                    <tr key={trustee.id}>
                      <td>{trustee.userId?.name || "N/A"}</td>
                      <td>{trustee.userId?.email || "N/A"}</td>
                      <td>
                        <Badge color="" className="badge-dot mr-4">
                          <i
                            className={
                              trustee.status === "active"
                                ? "bg-success"
                                : "bg-warning"
                            }
                          />
                          {trustee.status}
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
                            {/* Conditionally render based on the role */}
                            {role !== "trustee" && (
                              <>
                                <DropdownItem
                                  onClick={() => handleDelete(trustee._id)}
                                >
                                  Delete
                                </DropdownItem>
                                <DropdownItem
                                  onClick={() => handleEdit(trustee._id)}
                                >
                                  Edit
                                </DropdownItem>
                                <DropdownItem
                                  onClick={() => handleStatus(trustee._id)}
                                >
                                  Change Status
                                </DropdownItem>
                              </>
                            )}
                            {/* This item is shown to all roles */}
                            <DropdownItem
                              onClick={() => handleViewDetails(trustee._id)}
                            >
                              View All Details
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
            <PaginationComponent
              totalItems={filteredTrustees.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </Row>
      </Container>

      {/* Modal for displaying trustee details */}
      <Modal isOpen={modalOpen} toggle={closeModal} className="modal-lg">
        <ModalHeader toggle={closeModal}>Trustee Details</ModalHeader>
        {selectedTrustee && (
          <ModalBody>
            <p>
              <strong>Id:</strong> {selectedTrustee.userId?._id || "N/A"}
            </p>
            <p>
              <strong>Name:</strong> {selectedTrustee.userId?.name || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {selectedTrustee.userId?.email || "N/A"} 
            </p>
            <p>
              <strong>Address:</strong> {selectedTrustee.address || "N/A"}
            </p>
            <p>
              <strong>City:</strong> {selectedTrustee.city || "N/A"}
            </p>
            <p>
              <strong>Phone:</strong> {selectedTrustee.phone || "N/A"}
            </p>
            <p>
              <strong>Pincode:</strong> {selectedTrustee.pincode || "N/A"}
            </p>
            <p>
              <strong>Status:</strong> {selectedTrustee.status}
            </p>
            <p>
              <strong>Role:</strong> {selectedTrustee.userId?.role || "N/A"}
            </p>
            {/* <p><strong>Created At:</strong> {new Date(selectedTrustee.createdAt).toLocaleString()}</p>
            <p><strong>Updated At:</strong> {new Date(selectedTrustee.updatedAt).toLocaleString()}</p> */}
          </ModalBody>
        )}
        <ModalFooter>
          <Button color="secondary" onClick={closeModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>

      <Modal
        isOpen={createModalOpen}
        toggle={closeCreateModal}
        className="modal-lg"
      >
        <ModalHeader toggle={closeCreateModal}>Create New Trustee</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleCreateTrustee}>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                type="text"
                name="name"
                value={newTrustee.name}
                onChange={handleInputChange}
                invalid={!!errors.name}
                required
              />
              {errors.name && <FormFeedback>{errors.name}</FormFeedback>}
            </FormGroup>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                type="email"
                name="email"
                value={newTrustee.email}
                onChange={handleInputChange}
                invalid={!!errors.email}
                required
              />
              {errors.email && <FormFeedback>{errors.email}</FormFeedback>}
            </FormGroup>
            <FormGroup>
              <Label for="phone">Phone</Label>
              <Input
                type="text"
                name="phone"
                value={newTrustee.phone}
                onChange={handleInputChange}
                invalid={!!errors.phone}
                required
              />
              {errors.phone && <FormFeedback>{errors.phone}</FormFeedback>}
            </FormGroup>
            <FormGroup>
              <Label for="address">Address</Label>
              <Input
                type="text"
                name="address"
                value={newTrustee.address}
                onChange={handleInputChange}
                invalid={!!errors.address}
                required
              />
              {errors.address && <FormFeedback>{errors.address}</FormFeedback>}
            </FormGroup>
            <FormGroup>
              <Label for="city">City</Label>
              <Input
                type="text"
                name="city"
                value={newTrustee.city}
                onChange={handleInputChange}
                invalid={!!errors.city}
                required
              />
              {errors.city && <FormFeedback>{errors.city}</FormFeedback>}
            </FormGroup>
            <FormGroup>
              <Label for="pincode">Pincode</Label>
              <Input
                type="text"
                name="pincode"
                value={newTrustee.pincode}
                onChange={handleInputChange}
                invalid={!!errors.pincode}
                required
              />
              {errors.pincode && <FormFeedback>{errors.pincode}</FormFeedback>}
            </FormGroup>
            <Button
              color="primary"
              type="submit"
              disabled={Object.values(errors).some((error) => error)}
            >
              Create Trustee
            </Button>
          </Form>
        </ModalBody>
      </Modal>

      {/* Modal for editing trustee details */}
      <Modal
        isOpen={editModalOpen}
        toggle={closeEditModal}
        className="modal-lg"
      >
        <ModalHeader toggle={closeEditModal}>Edit Trustee</ModalHeader>
        {editTrustee && (
          <ModalBody>
            <Form onSubmit={handleEditTrustee}>
              <FormGroup>
                <Label for="name">Name</Label>
                <Input
                  type="text"
                  name="name"
                  value={editTrustee.userId?.name || ""}
                  onChange={handleEditInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={editTrustee.userId?.email || ""}
                  onChange={handleEditInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="phone">Phone</Label>
                <Input
                  type="text"
                  name="phone"
                  value={editTrustee.phone || ""}
                  onChange={handleEditInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="address">Address</Label>
                <Input
                  type="text"
                  name="address"
                  value={editTrustee.address || ""}
                  onChange={handleEditInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="city">City</Label>
                <Input
                  type="text"
                  name="city"
                  value={editTrustee.city || ""}
                  onChange={handleEditInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="pincode">Pincode</Label>
                <Input
                  type="text"
                  name="pincode"
                  value={editTrustee.pincode || ""}
                  onChange={handleEditInputChange}
                  required
                />
              </FormGroup>
              <Button color="primary" type="submit">
                Save Changes
              </Button>
            </Form>
          </ModalBody>
        )}
        <ModalFooter>
          <Button color="secondary" onClick={closeEditModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Trustees;
