import React, { Component } from "react";
import ReactTable from "react-table";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import SaveIcon from "@material-ui/icons/Save";
import "react-table/react-table.css";
import * as moment from "moment";

let date = moment().format("11-11-2018");

class Customerlist extends Component {
  constructor(params) {
    super(params);
    this.state = { customers: [], showSnack: false };
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
        this.setState({ customers: responseData.content});
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
        Header: "Id",
        accessor: "id",
        Cell: this.renderEditable
      },
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
      }
    ];

    return (
      <div>
        <ReactTable
          filterable={true}
          defaultPageSize={10}
          data={this.state.customers}
          columns={columns}
        />
      </div>
    );
  }
}

export default Customerlist;
