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
import {
  fetchDonors,
} from "../../store/donor-slice/donorSlice";
import {
  fetchIndividualDonorData,
} from "../../store/causes-slice/causesSlice";
import { toast } from "react-toastify";
import Header from "components/Headers/Header";
import PaginationComponent from "components/comman/Pagination";

const Donations = ({props}) => {
  const dispatch = useDispatch();
  const { donors, status } = useSelector((state) => state.donors);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [selectedIndi, setSelectedIndi] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { donorData } = useSelector((state) => state.causes);



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



  const donorIds = activeDonors.map((donor)=>donor._id);
  console.log("donor ids array",donorIds);

  useEffect(() => {
    dispatch(fetchIndividualDonorData(donorIds));
}, [dispatch]);



console.log("individual causes", donorData);

  const handleDonationViewDetails = (id) => {
    const donor = donorData.find((donor) => donor.donorId === id);
    setSelectedDonor(donor);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedDonor(null);
    setModalOpen(false);
  };

 

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0 d-flex justify-content-between align-items-center">
                <h3 className="mb-0">Donation List</h3>
                <div className="d-flex align-items-center">
                  <Input
                    type="text"
                    placeholder="Search by Name or Email or city"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mr-4"
                  />
             
               
                        <UncontrolledDropdown>
                          <DropdownToggle
                            className="btn-icon-only text-light"
                            href="#pablo"
                            role="button"
                            size="sm"
                            color=""
                            onClick={(e) => e.preventDefault()}
                          >
                            <i className="fas fa-hamburger" />
                          </DropdownToggle>
                          <DropdownMenu className="dropdown-menu-arrow" right>
                            <DropdownItem
                              onClick={''}
                            >
                              Print PDF
                            </DropdownItem>
                            <DropdownItem onClick={''}>
                              Share PDF
                            </DropdownItem>
                            <DropdownItem
                              onClick={''}
                            >
                              Download PDF
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                


                </div>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">DonerId</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    {/* <th scope="col">Status</th> */}
                    {/* <th scope="col">Total Donation</th> */}
                    <th scope="col">Actions</th>
                    
                  </tr>
                </thead>
                <tbody>
                  {currentDonors.map((donor) => (
                    <tr key={donor._id}>
                      <td>{donor._id || "N/A"}</td>
                      <td>{donor.userId?.name || "N/A"}</td>
                      <td>{donor.userId?.email || "N/A"}</td>
                      {/* <td>{donorData?.totalDonation}</td> */}
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
                              onClick={() => handleDonationViewDetails(donor._id)}
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
          
          { selectedDonor &&  (
            <div>
              <h5>Total Donation  (&#8377;) : {selectedDonor.totalDonation}  </h5>
              {selectedDonor.donations.map((donation, index) => (
          <div key={index}>
            <p>
              <strong>Cause Name:</strong> {donation.causeName}
            </p>
            <p>
              <strong>Donated Amount:</strong> &#8377;{donation.donatedAmount}
            </p>
            <hr />
          </div>
        ))}
              
              
            </div>
          )}
    
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={closeModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>

   
    </>
  );
};

export default Donations;



// import React, { useEffect, useState } from "react";
// import {
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Button,
// } from "reactstrap";
// import { useSelector, useDispatch } from "react-redux";
// import { fetchIndividualDonorData } from "../../store/causes-slice/causesSlice";

// const DonorModal = ({ donorId, isOpen, toggle }) => {
//   const dispatch = useDispatch();
//   const { donorData } = useSelector((state) => state.causes);
//   const [selectedDonor, setSelectedDonor] = useState(null);

//   // Fetch individual donor data when donorId changes
//   useEffect(() => {
//     if (donorId) {
//       dispatch(fetchIndividualDonorData([donorId]));
//     }
//   }, [donorId, dispatch]);

//   // Update selected donor when donorData updates
//   useEffect(() => {
//     if (donorData && donorId) {
//       const donor = donorData.find((data) => data.donorId === donorId);
//       setSelectedDonor(donor);
//     }
//   }, [donorData, donorId]);

//   return (
//     <Modal isOpen={isOpen} toggle={toggle}>
//       <ModalHeader toggle={toggle}>Donor Details</ModalHeader>
//       <ModalBody>
//         {selectedDonor ? (
//           <div>
//             <h5>Total Donation (&#8377;): {selectedDonor.totalDonation}</h5>
//             {selectedDonor.donations.map((donation, index) => (
//               <div key={index}>
//                 <p>
//                   <strong>Cause Name:</strong> {donation.causeName}
//                 </p>
//                 <p>
//                   <strong>Donated Amount:</strong> &#8377;{donation.donatedAmount}
//                 </p>
//                 <hr />
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p>Loading donor details...</p>
//         )}
//       </ModalBody>
//       <ModalFooter>
//         <Button color="secondary" onClick={toggle}>
//           Close
//         </Button>
//       </ModalFooter>
//     </Modal>
//   );
// };

// export default DonorModal;
