import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import moment from "moment";
import Modal from "@mui/material/Modal";

import "./Availableflights.css";
import Navbar from "../navbar/Navbar";
import { useLocation } from "react-router-dom";
import { Button, Typography, Box } from "@mui/material";
import FilterModal from "./FilterModal";

const modalstyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function Availableflights() {
  const location = useLocation();
  const { fromloc, toloc, oneway, data, passengerCount, showAll } =
    location.state || {};
  const spicejetImg =
    "https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/cf/6c/1a/cf6c1a8c-45be-3fd9-abf7-0e636c3c9efb/AppIcon-0-0-1x_U007emarketing-0-0-0-5-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/1024x1024bb.png";
  const airIndiaImg =
    "https://presentations.gov.in/wp-content/uploads/2020/06/Preview-2.png?x39644";
  const [flights, setFlights] = useState([]);
  const [modalType, setModalType] = useState("");
  const [filteredOpts, setFilteredopts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [sortorder, setSortOrder] = useState("low to high");
  const [sortby, setSortBy] = useState("");

  useEffect(() => {
    let reqFields = [];
    if (showAll) {
      reqFields = JSON.parse(JSON.stringify(data?.data?.result));
    } else {
      data?.data?.result.map((ele, i) => {
        if (
          ele?.displayData?.source?.airport?.cityName === fromloc &&
          ele?.displayData?.destination?.airport?.cityName === toloc
        ) {
          reqFields.push(ele);
        }
        // can add logic for when user selects a to and fro option to show planes going to destination on one screen then ones that
        // come back on selected date ( *** insufficient data for that *** )
      });
    }
    setFlights(reqFields);
  }, []);

  const handleHeaderClick = (modalName) => {
    setModalType(modalName);
    setShowModal(!showModal);
  };

  const handleClose = () => {
    setShowModal(false);
    // filtering(false)
  };

  const handleFilters = (opts) => {
    setFilteredopts(opts);
  };

  const handleSortBy = (ev) => {
    setSortBy(ev);
  };

  const handleOrder = (ord) => {
    setSortOrder(ord);
  };

  return (
    <>
      <Navbar />
      <div className="Availableflights-wrapper">
        <div className="Availableflights-inner-container">
          <Card
            sx={{
              minWidth: 275,
              width: "90%",
              height: "70vh",
              backgroundColor: "#ffffff8c",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div className="avFlights-card-header-wrapper">
              <Button
                variant="contained"
                className="avFlights-card-header-btns"
                onClick={(e) => {
                  handleHeaderClick("filter");
                }}
              >
                Filters
              </Button>
              <Modal
                open={showModal}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={modalstyle} className="Available-box-model">
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    Filter By:
                  </Typography>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    <FilterModal
                      names={
                        modalType == "filter"
                          ? ["Air India", "JetSpice"]
                          : ["price", "duration"]
                      }
                      tagName={modalType == "filter" ? "Airlines" : "Sort by"}
                      handleFilters={handleFilters}
                      filteredOpts={filteredOpts}
                      handleOrder={handleOrder}
                      handleSortBy={handleSortBy}
                      sortorder={sortorder}
                      sortby={sortby}
                      filtering={modalType == "filter" ? true : false}
                    />
                  </Typography>
                  <div className="filter-btn-container">
                    <Button
                      className="modal-filter-btn"
                      onClick={() => {
                        handleClose();
                      }}
                      variant="contained"
                    >
                      {modalType == "filter" ? "Filter" : "Sort"}
                    </Button>
                  </div>
                </Box>
              </Modal>
              <Button
                variant="contained"
                className="avFlights-card-header-btns"
                onClick={(e) => {
                  handleHeaderClick("sort");
                }}
              >
                Sort by
              </Button>
            </div>
            {
              !flights.length && (
                <div className="oops-error-no-flight">OOPS, no connecting flights. Please select different locations</div>
              )
            }
            <CardContent className="avFlights-ticket-Cardscontent-wrapper">
              <div className="avFlights-ticket-Cards-wrapper">
                {flights
                  .filter((ele, i) => {
                    return filteredOpts.length
                      ? filteredOpts.includes(
                          ele.displayData?.airlines[0]?.airlineName
                        )
                      : true;
                  })
                  .sort((a, b) => {
                    if (sortby == "price") {
                      return sortorder === "low to high"
                        ? a.fare - b.fare
                        : b.fare - a.fare;
                    } else if (sortby == "duration") {
                      const [hoursA, minutesA] =
                        a.displayData.totalDuration.split(" ");

                      const [hoursB, minutesB] =
                        b.displayData.totalDuration.split(" ");
                      return sortorder === "low to high"
                        ? moment
                            .duration({
                              hours: parseInt(hoursA.replace("h", "")),
                              minutes: parseInt(minutesA.replace("m", "")),
                            })
                            .asSeconds() -
                            moment
                              .duration({
                                hours: parseInt(hoursB.replace("h", "")),
                                minutes: parseInt(minutesB.replace("m", "")),
                              })
                              .asSeconds()
                        : moment
                            .duration({
                              hours: parseInt(hoursB.replace("h", "")),
                              minutes: parseInt(minutesB.replace("m", "")),
                            })
                            .asSeconds() -
                            moment
                              .duration({
                                hours: parseInt(hoursA.replace("h", "")),
                                minutes: parseInt(minutesA.replace("m", "")),
                              })
                              .asSeconds();
                    } else {
                      return 0;
                    }
                  })
                  .map((ticket, i) => {
                    return (
                      <Card className="avFlights-ticket-Card" id={i}>
                        <CardContent className="avFlights-ticket-Cards-content-wrapper">
                          <div className="avFlights-ticket-wrapper">
                            <div className="avFlights-ticket-top-container">
                              <div className="avFlights-ticket-logo-name-box">
                                <img
                                  style={{ width: "40px", height: "40px" }}
                                  src={
                                    ticket.displayData.airlines[0]
                                      .airlineCode == "AB"
                                      ? spicejetImg
                                      : airIndiaImg
                                  }
                                />
                                <p>
                                  {ticket.displayData.airlines[0].airlineName}
                                </p>
                              </div>
                              <div className="avFlights-ticketfrom-and-to-wrapper">
                                <div className="avFlights-from-content-wrap">
                                  <p>
                                    {ticket.displayData.source.airport.cityCode}
                                    ,
                                  </p>
                                  <p>
                                    {ticket.displayData.source.airport.cityName}
                                    ,
                                  </p>
                                  <p>
                                    {
                                      ticket.displayData.source.airport
                                        .countryName
                                    }
                                  </p>
                                </div>
                                <div>
                                  <FlightTakeoffIcon />
                                </div>
                                <div className="avFlights-from-content-wrap">
                                  <p>
                                    {
                                      ticket.displayData.destination.airport
                                        .cityCode
                                    }
                                    ,
                                  </p>
                                  <p>
                                    {
                                      ticket.displayData.destination.airport
                                        .cityName
                                    }
                                    ,
                                  </p>
                                  <p>
                                    {
                                      ticket.displayData.destination.airport
                                        .countryName
                                    }
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="avFlights-ticket-bottom-container">
                              <div>
                                <p className="avFlights-ticket-deptime">
                                  {moment(
                                    ticket.displayData.source.depTime
                                  ).format("LT")}
                                </p>
                              </div>
                              <div>
                                <p className="avFlights-ticket-duration">
                                  {ticket.displayData.totalDuration}
                                </p>
                              </div>
                              <div>
                                <p className="avFlights-ticket-deptime">
                                  {moment(
                                    ticket.displayData.destination.arrTime
                                  ).format("LT")}
                                </p>
                              </div>
                              <div>
                                <Button
                                  className="avFlights-book-btn"
                                  variant="contained"
                                >
                                  Book {passengerCount}X for ₹
                                  {ticket.fare * passengerCount}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

export default Availableflights;
