import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import './Navbar.css';

function Navbar() {
  return (
    <div>
      <AppBar position="static" sx={{ background: "aliceblue", color: "black" }}>
        <Toolbar>
          <div className="navbar-airplane-icon-wrapper">
            <img src="/assets/airline.png" alt="flight-icon" className="navbar-airplane-icon-img" />
          </div>
          <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
            JetSetGo
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Navbar;
