import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import { Button, Card, Col, Form, Modal, Row, Table } from "react-bootstrap";
import { getAllGrievancesAPI, updateGrievancesAPI } from "../services/AllAPI";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { SERVER_URL } from "../services/ServerUrl";
import "./Home.css";
function Home() {
  const [grievances, setGrievances] = useState([]);
  const [currentGrievance, setCurrentGrievance] = useState(null);
  const [showModal, setShowModal] = useState(false);
  //   states to update grievance
  const [status, setStatus] = useState("");
  const [action, setAction] = useState("");
  const [updatedDate, setUpdatedDate] = useState("");
  //   states for sorting
  const [filterStatus, setFilterStatus] = useState("");
  const [sortCreatedDate, setSortCreatedDate] = useState("asc");
  const [sortUpdatedDate, setSortUpdatedDate] = useState("asc");
  //set card or table view
  const [isCardView, setIsCardView] = useState(false);
  const navigate = useNavigate();

  // getting grievances
  const getGrievances = async () => {
    try {
      const response = await getAllGrievancesAPI();
      setGrievances(response.data);
    } catch (err) {
      console.log("Error fetching grievances", err);
      setGrievances([]);
    }
  };
  // to realtime update from user
  useEffect(() => {
    const socket = io(SERVER_URL, {
      transports: ["websocket", "polling"],
      autoConnect: true,
    });
    socket.on("new-grievance", (data) => {
      // console.log("New grievance received on client:", data);
      setGrievances((prev) => [data, ...prev]);
    });
    return () => {
      socket.disconnect(); // Clean up connection on unmount
    };
  }, []);
// verify admin and calling grievances
  useEffect(() => {
    const token = sessionStorage.getItem("SuperHeroToken");
    if (!token) {
      navigate("/");
    }
    getGrievances();
  }, []);

  // Show modal
  const handleViewGrievance = (grievance) => {
    setCurrentGrievance(grievance);
    setShowModal(true);
  };

  // Update grievance
  const handleUpdateStatus = async () => {
    const currentDate = new Date().toISOString();
    setUpdatedDate(currentDate);

    try {
      const updatedData = { status, action, updatedDate };
      const result = await updateGrievancesAPI(
        currentGrievance._id,
        updatedData
      );
      if (result.status === 200) {
        toast.success("Grievance Updated successfully");
        getGrievances();
        setShowModal(false);
      } else {
        toast.error("Unable to update status..");
      }
    } catch (err) {
      console.error("Error updating grievance", err);
    }
  };

  // Handle filtering and sorting
  const sortedFilteredGrievances = grievances
    ?.filter((grievance) => {
      // Filter by status
      if (filterStatus && grievance.status !== filterStatus) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      // Dynamic sorting based on selected field
      if (sortCreatedDate) {
        return sortCreatedDate === "asc"
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      }
      if (sortUpdatedDate) {
        return sortUpdatedDate === "asc"
          ? new Date(a.updatedDate) - new Date(b.updatedDate)
          : new Date(b.updatedDate) - new Date(a.updatedDate);
      }
      return 0; // No sorting applied
    });
  // formatting date
  const formatDate = (date) => {
    const dateObject = new Date(date);
    return dateObject.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div>
      <Header />
      <div className="super-hero-page m-sm-5 m-2">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Grievances</h2>
          <Button variant="warning" onClick={() => setIsCardView(!isCardView)}>
            {isCardView ? (
              <i class="fa fa-table"></i>
            ) : (
              <i class="fa-solid fa-id-card"></i>
            )}
          </Button>
        </div>
        <div className="row">
          <div className="col-sm-4">
            {/* Filter by Status */}
            <Form.Group className="mb-3">
              <Form.Label>Filter by Status</Form.Label>
              <Form.Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="viewed">Viewed</option>
                <option value="processing">Processing</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </Form.Select>
            </Form.Group>
          </div>
          <div className="col-sm-4">
            {/* Sort by Created Date */}
            <Form.Group className="mb-3">
              <Form.Label>Sort by Created Date</Form.Label>
              <Form.Select
                value={sortCreatedDate}
                onChange={(e) => {
                  setSortCreatedDate(e.target.value);
                  setSortUpdatedDate(null); // Reset other sort field
                }}
              >
                <option value="">No Sorting</option>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </Form.Select>
            </Form.Group>
          </div>
          <div className="col-sm-4">
            {/* Sort by Updated Date */}
            <Form.Group className="mb-3">
              <Form.Label>Sort by Updated Date</Form.Label>
              <Form.Select
                value={sortUpdatedDate}
                onChange={(e) => {
                  setSortUpdatedDate(e.target.value);
                  setSortCreatedDate(null); // Reset other sort field
                }}
              >
                <option value="">No Sorting</option>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </Form.Select>
            </Form.Group>
          </div>
        </div>
        {isCardView ? (
          <Row>
            {sortedFilteredGrievances.map((grievance, index) => (
              <Col key={grievance._id} sm={12} md={6} lg={4} className="mb-3">
                <Card className="grievanceCard">
                  <Card.Body>
                    <Card.Title>{grievance.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted  ">
                      Issue: {grievance.issue}
                    </Card.Subtitle>
                    <Card.Text className="description">
                      <strong>Description:</strong>{" "}
                      {grievance.description || "N/A"}
                    </Card.Text>
                    <Card.Text>
                      <strong>Status:</strong> {grievance.status}
                    </Card.Text>
                    <Card.Text>
                      <strong>Created:</strong> {formatDate(grievance.date)}
                    </Card.Text>
                    <Card.Text>
                      <strong>Supporting Document:</strong>{" "}
                      <img width={80} src={grievance.file} alt="" />
                    </Card.Text>
                    <Card.Text>
                      <strong>Updated:</strong>{" "}
                      {formatDate(grievance.updatedDate)}
                    </Card.Text>
                    <Button
                      variant="warning"
                      onClick={() => handleViewGrievance(grievance)}
                    >
                      View Details
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : sortedFilteredGrievances?.length > 0 ? (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Index</th>
                <th>User Name</th>
                <th>Issue</th>
                <th>Created Date</th>
                <th>Description</th>
                <th>Status</th>
                <th>Action</th>
                <th>Updated Date</th>
                <th>Supporting Doc</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sortedFilteredGrievances.map((grievance, index) => {
                return (
                  <tr key={grievance._id}>
                    <td>{index + 1}</td>
                    <td>{grievance.name}</td>
                    <td>{grievance.issue}</td>
                    <td>{formatDate(grievance.date)}</td>
                    <td className="limited-height">
                      <div className="content">{grievance.description}</div>
                    </td>
                    <td>{grievance.status}</td>
                    <td>{grievance.action}</td>
                    <td>{formatDate(grievance.updatedDate)}</td>
                    <td>
                      <img width={150} src={grievance.file} alt="" />
                    </td>
                    <td>
                      <Button
                        variant="warning"
                        onClick={() => handleViewGrievance(grievance)}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        ) : (
          <p>No grievances to display</p>
        )}
      </div>

      {/* Modal for Grievance Details */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Grievance Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentGrievance && (
            <div>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <strong>Name:</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={currentGrievance.name}
                    readOnly
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <strong>Issue:</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={currentGrievance.issue}
                    readOnly
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <strong>Status:</strong>
                  </Form.Label>
                  <Form.Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="viewed">Viewed</option>
                    <option value="processing">Processing</option>
                    <option value="resolved">Resolved</option>
                    <option value="rejected">Rejected</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <strong>Action:</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="write the taken action here"
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <strong>Supporting Document:</strong>
                  </Form.Label>
                  <img width={460} src={currentGrievance.file} alt="" />
                </Form.Group>
              </Form>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateStatus}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Home;
