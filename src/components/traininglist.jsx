import React, { Component } from "react";
import ReactTable from "react-table";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import "react-table/react-table.css";
import moment from "moment";
import Confirm from "./confirm";

class Traininglist extends Component {
  constructor(params) {
    super(params);
    this.state = { trainings: [], showSnack: false };
  }

  componentDidMount() {
    this.listTrainings();
  }

  // Get all trainings
  listTrainings = () => {
    fetch("https://customerrest.herokuapp.com/api/trainings")
      .then(response => response.json())
      .then(responseData => {
        window.responseData = responseData;
        this.setState({ trainings: responseData.content });
      });
  };

  // Delete a training
  deleteTraining = link => {
    fetch(link, { method: "DELETE" }).then(response => {
      this.listTrainings();
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
        id: "date",
        accessor: d => (
          <div
            dangerouslySetInnerHTML={{
              __html: moment(d.date)
                .local()
                .format("YYYY-MM-DD HH:mm")
            }}
          />
        )
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
      },
      {
        Header: "Delete training",
        id: "delete",
        accessor: d => d.links.find(link => link.rel === "self").href,
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
        <ReactTable
          filterable={true}
          defaultPageSize={10}
          data={this.state.trainings}
          columns={columns}
        />
        {this.state.showDeleteConfirm && (
          <Confirm
            title="Are you sure you want to delete this training?"
            onConfirmed={value => {
              if (value) {
                this.deleteTraining(this.state.deleteData);
              }
              this.setState({ showDeleteConfirm: false });
            }}
          />
        )}
      </div>
    );
  }
}

export default Traininglist;
