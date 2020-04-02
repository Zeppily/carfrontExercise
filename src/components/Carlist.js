import React, { useState, useEffect } from "react";
import ReactTable from "react-table-v6";
import "react-table-v6/react-table.css";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import Addcar from "./Addcar";
import Editcar from './Editcar';

export default function Carlist() {
  const [cars, setCars] = useState([]);
  // Snackbar (false to put it hidden)
  const [open, setOpen] = useState(false);
  const [msg, setMessage] = useState("");

  useEffect(() => {
    getCars();
  }, []);

  const getCars = () => {
    fetch("https://carstockrest.herokuapp.com/cars")
      .then(response => response.json())
      .then(data => {
        setCars(data._embedded.cars);
      })
      .catch(err => console.error(err));
  };

  // _ for not using a parameter so the then statement will be executed regardless
  // SetOpen true to confirm delete notification on screen (snackbar)
  const deleteCar = link => {
    if (window.confirm("Do you want to delete this car?")) {
      fetch(link, { method: "DELETE" })
        .then(_ => getCars())
        .then(_ => {
          setMessage("Car deleted");
          setOpen(true);
        })
        .catch(err => console.error(err));
    }
  };

  const addCar = car => {
    fetch("https://carstockrest.herokuapp.com/cars", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(car)
    })
      .then(_ => getCars())
      .then(_ => {
        setMessage("New car added");
        setOpen(true);
      })
      .catch(err => console.error(err));
  };

  const updateCar = (link,car) =>{
    fetch(link, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(car)
      })
      .then(_ => getCars())
      .then(_ => {
        setMessage("Car updated");
        setOpen(true);
      })
      .catch(err => console.error(err));
  }
  const handleClose = () => {
    setOpen(false);
  };

  const columns = [
    {
      Header: "Brand",
      accessor: "brand"
    },
    {
      Header: "Model",
      accessor: "model"
    },
    {
      Header: "Color",
      accessor: "color"
    },
    {
      Header: "Fuel",
      accessor: "fuel"
    },
    {
      Header: "Year",
      accessor: "year"
    },
    {
      Header: "Price (Euro)",
      accessor: "price"
    },
    {
        Cell: row => (<Editcar updateCar={updateCar} car={row.original} />)
    },
    {
      accessor: "_links.self.href",
      Cell: row => (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => deleteCar(row.value)}
        >
          Delete
        </Button>
      )
    }
  ];

  return (
    <div>
      <Addcar addCar={addCar} />
      <ReactTable data={cars} columns={columns} defaultPageSize={15} />
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        message={msg}
      />
    </div>
  );
}
