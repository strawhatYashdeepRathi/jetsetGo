import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
// import moment from "moment";
import CardContent from "@mui/material/CardContent";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

import "./BookingPage.css";
import { Autocomplete, TextField, Button, Tooltip } from "@mui/material";
import ConnectingAirportsRoundedIcon from "@mui/icons-material/ConnectingAirportsRounded";
import Navbar from "../navbar/Navbar";
import { Link } from "react-router-dom";

function BookingPage() {
  const url = "https://api.npoint.io/4829d4ab0e96bfab50e7";
  const [oneway, setOneway] = useState(true);
  const [depDate, setDepDate] = useState();
  const [arrDate, setArrDate] = useState();
  const [fromloc, setFromloc] = useState();
  const [toloc, setToloc] = useState();
  const [passengerCount, setPassengerCount] = useState(1);
  const [data, setData] = useState([]);
  const [flightOptions, setFlightOptions] = useState([]);

  const fetchInfo = () => {
    return fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((d) => setData(d))
      .catch((error) => {
        console.error("Error fetching data:", error.message);
      });
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  useEffect(() => {
    let reqDestinations = new Set();
    data?.data?.result?.forEach((ele) => {
      reqDestinations.add(
        JSON.stringify({
          label: ele?.displayData?.source?.airport?.cityName,
          code: ele?.displayData?.source?.airport?.cityCode,
        })
      );
      // reqDestinations.add(JSON.stringify({"label": ele?.displayData?.source?.airport?.airportName, "code": ele?.displayData?.source?.airport?.airportCode}))
      reqDestinations.add(
        JSON.stringify({
          label: ele?.displayData?.destination?.airport?.cityName,
          code: ele?.displayData?.destination?.airport?.cityCode,
        })
      );
      // reqDestinations.add(JSON.stringify({"label": ele?.displayData?.destination?.airport?.airportName, "code": ele?.displayData?.destination?.airport?.airportCode}))
    });
    let finaldata = Array.from(reqDestinations).map(JSON.parse);
    setFlightOptions(finaldata);
  }, [data]);

  return (
    <>
      <Navbar></Navbar>
      <div className="BookingPage-wrapper">
        <div className="BookingPage-inner-container">
          <Card
            className="BookingPage-card-wrapper"
            sx={{
              minWidth: 275,
              height: "70vh",
              backgroundColor: "#ffffff7a",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <CardContent className="Booking-cardcontent">
              <div className="BookingPage-toggle-btns">
                <Button
                  variant={oneway ? "contained" : "outlined"}
                  onClick={() => setOneway(true)}
                  className="BookingPage-dual-btn"
                >
                  One Way
                </Button>
                <Button
                  variant={!oneway ? "contained" : "outlined"}
                  onClick={() => setOneway(false)}
                  className="BookingPage-dual-btn"
                >
                  Round Trip
                </Button>
              </div>
              <div className="BookingPage-inp-wrapper">
                <Autocomplete
                  disablePortal
                  freeSolo
                  id="combo-box-demo"
                  // error={true}
                  getOptionDisabled={(option) => option.label === toloc}
                  onBlur={(e) => {
                    console.log("selected from", e.target.value);
                    setFromloc(e.target.value);
                  }}
                  options={flightOptions}
                  sx={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField {...params} label="From" />
                  )}
                />
                <ConnectingAirportsRoundedIcon className="ConnectingAirportsRoundedIcon" />
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  freeSolo
                  options={flightOptions}
                  sx={{ width: 300 }}
                  getOptionDisabled={(option) => option.label === fromloc}
                  onBlur={(e) => {
                    setToloc(e.target.value);
                  }}
                  renderInput={(params) => <TextField {...params} label="To" />}
                />
              </div>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <div className="Booking-Page-Date-wrapper">
                  <DatePicker
                    sx={{ width: 300 }}
                    label="Date of Departure"
                    value={depDate}
                    onChange={(newValue) => setDepDate(newValue)}
                    disablePast
                  />
                  <div id="blank-space"></div>
                  {!oneway && (
                    <DatePicker
                      sx={{ width: 300 }}
                      label="Date of Arrival"
                      value={arrDate}
                      onChange={(newValue) => setArrDate(newValue)}
                      disablePast
                    />
                  )}
                </div>
              </LocalizationProvider>
              <div className="BookingPage-count-wrapper">
                <div className="BookingPage-count-btn">
                  <RemoveCircleOutlineIcon
                    className="BookingPage-count-minus counter"
                    onClick={() => {
                      if (passengerCount > 1) {
                        setPassengerCount(passengerCount - 1);
                      }
                    }}
                  />
                  <p className="BookingPage-count-num counter">
                    {passengerCount}
                  </p>
                  <ControlPointIcon
                    className="BookingPage-count-plus counter"
                    onClick={() => setPassengerCount(passengerCount + 1)}
                  />
                </div>
              </div>
              <div className="BookingPage-get-flights-wrapper">
                <Tooltip
                  followCursor
                  title={
                    !fromloc || !toloc || !depDate || (!oneway && !arrDate)
                      ? "fill all required fields"
                      : ""
                  }
                >
                  <span>
                    <Button
                      variant="outlined"
                      className="BookingPage-dual-btn"
                      disabled={
                        !fromloc || !toloc || !depDate || (!oneway && !arrDate)
                      }
                      onClick={() => document.getElementById("get-flights").click()}
                      style={{
                        color: `${
                          !fromloc ||
                          !toloc ||
                          !depDate ||
                          (!oneway && !arrDate)
                            ? ""
                            : "white !important"
                        }`,
                      }}
                    >
                      <Link
                        to={{
                          pathname: "/availableflights",
                        }}
                        state={{
                          fromloc,
                          toloc,
                          oneway,
                          data,
                          passengerCount,
                        }}
                        id="get-flights"
                      >
                        Get Flights
                      </Link>
                    </Button>
                  </span>
                </Tooltip>
                  <span>
                    <Link
                    to={{
                      pathname: "/availableflights",
                    }}
                    state={{
                      fromloc,
                      toloc,
                      oneway,
                      data,
                      passengerCount,
                      showAll: true,
                    }}>
                        See all connecting flights
                    </Link>
                  </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

export default BookingPage;
