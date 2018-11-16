import React, { Component } from "react";
import ReactTable from "react-table";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import SaveIcon from "@material-ui/icons/Save";
import "react-table/react-table.css";
import moment from "react-moment";

class Traininglist extends Component {
  constructor(params) {
    super(params);
    this.state = { trainings: [], showSnack: false };
  }

  componentDidMount() {
    this.listTrainings();
  }

  // Get all customers
  listTrainings = () => {
    fetch("https://customerrest.herokuapp.com/api/trainings")
      .then(response => response.json())
      .then(responseData => {
        window.responseData = responseData;
        this.setState({ trainings: responseData.content });
      });
  };

  renderEditable = cellInfo => {
    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          const data = [...this.state.trainings];
          data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          this.setState({ trainings: data });
        }}
        dangerouslySetInnerHTML={{
          __html: this.state.trainings[cellInfo.index][cellInfo.column.id]
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
        Header: "Date",
        accessor: "date",
        Cell: this.renderEditable
      },
      {
        Header: "Duration",
        accessor: "duration",
        Cell: this.renderEditable
      },
      {
        Header: "Activity",
        accessor: "activity",
        Cell: this.renderEditable
      }
    ];

    return (
      <div>
        <ReactTable
          filterable={true}
          defaultPageSize={10}
          data={this.state.trainings}
          columns={columns}
        />
      </div>
    );
  }
}

export default Traininglist;
