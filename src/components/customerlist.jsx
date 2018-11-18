import React, { Component } from "react";
import ReactTable from "react-table";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import SaveIcon from "@material-ui/icons/Save";
import "react-table/react-table.css";
import AddCustomers from "./addcustomer";
import AddTraining from "./addtraining";
import Confirm from "./confirm";

class Customerlist extends Component {
  constructor(params) {
    super(params);
    this.state = { customers: [], showSnack: false, showDeleteConfirm: false };
  }

  componentDidMount() {
    this.listCustomers();
  }

  // Get all customers
  listCustomers = () => {
    fetch("https://customerrest.herokuapp.com/api/customers")
      .then(response => response.json())
      .then(responseData => {
        window.responseData = responseData;

        //     console.log(responseData);

        this.setState({ customers: responseData.content });
      });
  };

  // Save a new customer and get updated listing (car comes from addcustomer.js)
  saveCustomer = customer => {
    fetch("https://customerrest.herokuapp.com/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customer)
    }).then(response => {
      this.listCustomers();
    });
  };

  addTraining = training => {
    return new Promise(function(resolve, reject) {
      fetch("https://customerrest.herokuapp.com/api/trainings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(training)
      }).then(r => {
        resolve(r);
      });
    });
  };

  // Delete a customer
  deleteCustomer = link => {
    fetch(link, { method: "DELETE" }).then(response => {
      this.listCustomers();
      this.setState({ showSnack: true });
    });
  };

  renderEditable = cellInfo => {
    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          const data = [...this.state.customers];
          data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          this.setState({ customers: data });
        }}
        dangerouslySetInnerHTML={{
          __html: this.state.customers[cellInfo.index][cellInfo.column.id]
        }}
      />
    );
  };

  handleClose = () => {
    this.setState({
      showSnack: false
    });
  };

  render() {
    const columns = [
      {
        Header: "First name",
        accessor: "firstname",
        Cell: this.renderEditable
      },
      {
        Header: "Last name",
        accessor: "lastname",
        Cell: this.renderEditable
      },
      {
        Header: "Address",
        accessor: "streetaddress",
        Cell: this.renderEditable
      },
      {
        Header: "Post code",
        accessor: "postcode",
        Cell: this.renderEditable
      },
      {
        Header: "City",
        accessor: "city",
        Cell: this.renderEditable
      },
      {
        Header: "E-mail",
        accessor: "email",
        Cell: this.renderEditable
      },
      {
        Header: "Phone number",
        accessor: "phone",
        Cell: this.renderEditable
      },
      {
        Header: "Add a new training",
        id: "add",
        accessor: d => {
          if (d) {
            return d.links.find(link => link.rel === "self").href;
          }
        },
        filterable: false,
        sortable: false,
        Cell: ({ value }) => (
          <AddTraining addTraining={this.addTraining} link={value} />
        )
      },
      {
        Header: "Delete customer",
        id: "delete",
        accessor: d => {
          if (d) {
            return d.links.find(link => link.rel === "self").href;
          }
        },
        filterable: false,
        sortable: false,
        Cell: ({ value }) => (
          <IconButton
            onClick={() =>
              this.setState({ showDeleteConfirm: true, deleteData: value })
            }
            aria-label="Delete"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        )
      }
    ];

    return (
      <div>
        <AddCustomers saveCustomer={this.saveCustomer} />
        <ReactTable
          filterable={true}
          defaultPageSize={10}
          data={this.state.customers}
          columns={columns}
        />
        {this.state.showDeleteConfirm && (
          <Confirm
            title="Are you sure you want to delete this customer?"
            onConfirmed={value => {
              if (value) {
                this.deleteCustomer(this.state.deleteData);
              }
              this.setState({ showDeleteConfirm: false });
            }}
          />
        )}
      </div>
    );
  }
}

export default Customerlist;
