// src/components/Donors.js
import React, { useEffect, useState } from "react";
import DonationModal from "./DonationModal";
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
  Dropdown,
} from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCauses,
  createCause,
  updateCause,
  deleteCause,
  donateToCause,
  updateCauseStatus,
} from "../../store/causes-slice/causesSlice";
import { toast } from "react-toastify";
import Header from "components/Headers/Header";
import PaginationComponent from "components/comman/Pagination";

const Causes = () => {
  const dispatch = useDispatch();
  // const { donors, status } = useSelector((state) => state.donors);
  const { causes, status } = useSelector((state) => state.causes);
  const [selectedCause, setSelectedCause] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const openCreateModal = () => setCreateModalOpen(true);
  const closeCreateModal = () => setCreateModalOpen(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editCause, setEditCause] = useState(null);
  const [editCauseId, setEditCauseId] = useState(null);
  const [newCause, setNewCause] = useState({
    name: "",
    goal: "",
    description: "",
    status: "active",
  });
  const [causeId, setCauseId] = useState(null);
  const [errors, setErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const [role, setRole] = useState("");

  useEffect(() => {
    // Retrieve role from local storage
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  const [showDModal, setShowDModal] = useState(false);

  const openDModal = (causeId) => {
    setCauseId(causeId);
    setShowDModal(true);
  };
  const closeDModal = () => {
    setShowDModal(false);
    setCauseId(null); // Reset causeId when modal is closed
  };

  const filteredCauses = causes
    .filter(
      (cause) =>
        !cause.isDelete &&
        cause.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  console.log("delete filter causes", filteredCauses);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const activeCauses = causes
    .filter((cause) => !cause.isDeleted)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCauses = filteredCauses.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCauses());
    }
  }, [status, dispatch]);
  console.log("fetched causes", causes);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = (id) => {
    toast.info(
      <div>
        <p>Are you sure you want to Delete Cause?</p>
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
    dispatch(deleteCause(id));
  };

  const handleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "completed" : "active";
    console.log("Selected Cause ID:", id);
    console.log("New Status:", newStatus);

    dispatch(updateCauseStatus({ id, status: newStatus }));
  };

  const handleEdit = (id) => {
    const causeToEdit = activeCauses.find((cause) => cause._id === id);
    setEditCauseId(id);
    setEditCause({ ...causeToEdit });
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditCause(null);
    setEditModalOpen(false);
  };
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
    setEditCause((prevCause) => ({ ...prevCause, [name]: value }));
  };

  const handleEditCause = (e) => {
    e.preventDefault();
    if (!errors.name && !errors.goal && !errors.description) {
      dispatch(updateCause({ editCauseId, editCause }));
      closeEditModal();
    } else {
      toast.error("Please fix the validation errors before submitting.");
    }
  };

  const handleViewDetails = (id) => {
    const cause = activeCauses.find((cause) => cause._id === id);
    setSelectedCause(cause);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedCause(null);
    setModalOpen(false);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCause((prevCause) => ({ ...prevCause, [name]: value }));

    // Perform real-time validation
    validateField(name, value);
  };
  const validateField = (fieldName, value) => {
    let errorMessage = "";

    switch (fieldName) {
      case "name":
        errorMessage =
          value.length < 3 ? "Name must be at least 3 characters." : "";
        break;
      case "goal":
        errorMessage =
          !/^\d+$/.test(value) || value <= 0
            ? "Goal must be a positive number."
            : "";
        break;
      case "description":
        errorMessage =
          value.length < 10
            ? "Description must be at least 10 characters."
            : "";
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: errorMessage }));
  };

  const handleCreateCause = (e) => {
    e.preventDefault();
    dispatch(createCause(newCause));
    if (!errors.name && !errors.goal && !errors.description) {
      // Handle form submission logic here
      console.log("Form submitted:", newCause);
      // Reset the form after submission
      setNewCause({ name: "", goal: "", description: "" });
      setErrors({ name: "", goal: "", description: "" });
      closeCreateModal();
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
                <h3 className="mb-0">Causes List</h3>
                <div className="d-flex align-items-center">
                  <Input
                    type="text"
                    placeholder="Search by Name"
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
                      Create Cause
                    </Button>
                  )}
                </div>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    {/* <th scope="col">DonerId</th> */}
                    <th scope="col">Name</th>
                    <th scope="col">Goal(&#x20B9;)</th>
                    <th scope="col">Raised(&#x20B9;)</th>
                    <th scope="col">Status</th>
                    <th scope="col">Make Donation</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCauses.map((cause) => (
                    <tr key={cause._id}>
                      {/* <td>{cause._id || "N/A"}</td> */}
                      <td>{cause.name || "N/A"}</td>
                      <td>{cause.goal || "N/A"}</td>
                      <td>{cause.raised || "N/A"}</td>
                      <td>
                        <Badge color="" className="badge-dot mr-4">
                          <i
                            className={
                              cause.status === "active"
                                ? "bg-success"
                                : "bg-warning"
                            }
                          />
                          {cause.status}
                        </Badge>
                      </td>
                      <td>
                        <button
                          className="btn btn-success px-4 py-2 rounded-pill shadow-sm"
                          onClick={() => openDModal(cause._id)}
                          disabled={cause.status === "completed"} // Disable if status is "completed"
                        >
                          Make Donation
                        </button>
                        {showDModal &&
                          causeId === cause._id &&
                          cause.status !== "completed" && (
                            <DonationModal
                              causeId={cause._id}
                              onClose={closeDModal}
                            />
                          )}
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
                            {/* Always show the View option */}
                            <DropdownItem
                              onClick={() => handleViewDetails(cause._id)}
                            >
                              View
                            </DropdownItem>

                            {/* Show Edit, Delete, and Status Change options only if role is admin */}
                            {role === "admin" && (
                              <>
                                <DropdownItem
                                  onClick={() => handleEdit(cause._id)}
                                >
                                  Edit
                                </DropdownItem>
                                <DropdownItem
                                  onClick={() => handleDelete(cause._id)}
                                >
                                  Delete
                                </DropdownItem>
                                <DropdownItem
                                  onClick={() =>
                                    handleStatus(cause._id, cause.status)
                                  }
                                >
                                  {cause.status === "active"
                                    ? "Mark as Completed"
                                    : "Mark as Active"}
                                </DropdownItem>
                              </>
                            )}
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <PaginationComponent
                totalItems={activeCauses.length}
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
        <ModalHeader toggle={closeModal}>Cause Details</ModalHeader>
        <ModalBody>
          {selectedCause && (
            <div>
              <h5>CauseId: {selectedCause._id}</h5>
              <h5>Name: {selectedCause.name}</h5>
              <p>Goal: {selectedCause.goal}</p>
              <p>Raised: {selectedCause.raised}</p>
              <p>Status: {selectedCause.status}</p>
              <p>
                Created: {new Date(selectedCause.createdAt).toLocaleString()}
              </p>
              <p>Status: {selectedCause.status}</p>
              <p>Description: {selectedCause.description}</p>
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
        <ModalHeader toggle={closeCreateModal}>Create Cause</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleCreateCause}>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                type="text"
                name="name"
                id="name"
                value={newCause.name}
                onChange={handleInputChange}
                required
                invalid={!!errors.name}
              />
              <FormFeedback>{errors.name}</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for="goal">Goal</Label>
              <Input
                type="number"
                name="goal"
                id="goal"
                value={newCause.goal}
                onChange={handleInputChange}
                required
                invalid={!!errors.goal}
              />
              <FormFeedback>{errors.goal}</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                type="text"
                name="description"
                id="description"
                value={newCause.description}
                onChange={handleInputChange}
                required
                invalid={!!errors.description}
              />
              <FormFeedback>{errors.description}</FormFeedback>
            </FormGroup>
            <Button
              color="primary"
              type="submit"
              disabled={!!errors.name || !!errors.goal || !!errors.description}
            >
              Create Cause
            </Button>
          </Form>
        </ModalBody>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={editModalOpen} toggle={closeEditModal}>
        <ModalHeader toggle={closeEditModal}>Edit Cause</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleEditCause}>
            <FormGroup>
              <Label for="editName">Name</Label>
              <Input
                type="text"
                name="name"
                id="editName"
                value={editCause?.name || ""}
                onChange={handleEditInputChange}
                invalid={!!errors.name}
                required
              />
              <FormFeedback>{errors.name}</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for="editGoal">Goal</Label>
              <Input
                type="number"
                name="goal"
                id="editGoal"
                value={editCause?.goal || ""}
                onChange={handleEditInputChange}
                invalid={!!errors.goal}
                required
              />
              <FormFeedback>{errors.goal}</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for="editDescription">Description</Label>
              <Input
                type="text"
                name="description"
                id="editDescription"
                value={editCause?.description || ""}
                onChange={handleEditInputChange}
                invalid={!!errors.description}
                required
              />
              <FormFeedback>{errors.description}</FormFeedback>
            </FormGroup>
            <Button color="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default Causes;
