import React, { Component } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import moment from "moment";

class Calendar extends Component {
  constructor(params) {
    super(params);
    this.state = {
      gettrainings: [],
      inputDate: "",
      filteredTrainings: [],
      selectsValue: "month",
      user: ""
    };
  }

  componentDidMount() {
    this.listCalendar();
    this.setState({
      // put here firebase auth
      user: this.props.user
    });
  }

  selectChange = e => {
    if (this.state.inputDate === "") {
      return false;
    }

    this.setState(
      {
        selectsValue: e.target.value
      },
      () => {
        // IF YOU WANT TO READ STATE AFTER SETTINGIT, USE THIS

        this.filterWith();
      }
    );
  };

  changeDate = e => {
    if (e.target.value) {
      console.log("Change date");
      this.setState(
        {
          inputDate: e.target.value
        },
        () => {
          this.filterWith();
        }
      );
    } else {
      console.log("Show all");

      this.setState({
        inputDate: ""
      });

      this.showAll();
    }
  };

  filterWith() {
    if (this.state.selectsValue === "day") {
      this.filterWithDate();
    }

    if (this.state.selectsValue === "week") {
      this.filterWithWeek();
    }
    if (this.state.selectsValue === "month") {
      this.filterWithMonth();
    }
  }

  showAll() {
    this.setState({
      filteredTrainings: this.state.gettrainings
    });
  }

  filterWithDate = () => {
    var output = [];

    this.state.gettrainings.forEach(training => {
      if (
        moment(training.date, "x").format("YYYY-MM-DD") === this.state.inputDate
      ) {
        output.push(training);
      }
    });

    this.setState({
      filteredTrainings: output
    });
  };

  filterWithWeek = () => {
    var output = [];

    this.state.gettrainings.forEach(training => {
      if (
        moment(training.date, "x").week() ===
        moment(this.state.inputDate).week()
      ) {
        output.push(training);
      }
    });

    this.setState({
      filteredTrainings: output
    });
  };

  filterWithMonth = () => {
    var output = [];

    this.state.gettrainings.forEach(training => {
      if (
        moment(training.date, "x").format("YYYY-MM") ===
        moment(this.state.inputDate).format("YYYY-MM")
      ) {
        output.push(training);
      }
    });

    this.setState({
      filteredTrainings: output
    });
  };

  // Get the trainings of customers
  listCalendar = () => {
    fetch("https://customerrest.herokuapp.com/gettrainings")
      .then(response => response.json())
      .then(responseData => {
        var output = [];

        responseData.forEach(training => {
          if (training.customer.email === this.state.user) {
            output.push(training);
          }
        });

        window.responseData = output;

        console.log(output);

        this.setState({ gettrainings: output });

        this.showAll();
      });
  };

  renderEditable = cellInfo => {
    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          const data = [...this.state.gettrainings];
          data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          this.setState({ gettrainings: data });
        }}
        dangerouslySetInnerHTML={{
          __html: this.state.gettrainings[cellInfo.index][cellInfo.column.id]
        }}
      />
    );
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
        Header: "First name",
        id: "firstname",
        accessor: d => {
          if (d.customer) {
            return d.customer.firstname;
          }
        }
      },
      {
        Header: "Last name",
        id: "lastname",
        accessor: d => {
          if (d.customer) {
            return d.customer.lastname;
          }
        }
      },
      {
        Header: "Address",
        id: "streetaddress",
        accessor: d => {
          if (d.customer) {
            return d.customer.streetaddress;
          }
        }
      },
      {
        Header: "Post code",
        id: "postalcode",
        accessor: d => {
          if (d.customer) {
            return d.customer.postcode;
          }
        }
      },
      {
        Header: "City",
        id: "city",
        accessor: d => {
          if (d.customer) {
            return d.customer.city;
          }
        }
      },
      {
        Header: "E-mail",
        id: "email",
        accessor: d => {
          if (d.customer) {
            return d.customer.email;
          }
        }
      },
      {
        Header: "Phone number",
        id: "phone",
        accessor: d => {
          if (d.customer) {
            return d.customer.phone;
          }
        }
      }
    ];

    return (
      <div>
        <div id="calendarInputs">
          <input
            type="date"
            onChange={this.changeDate}
            placeholder="YYYY-MM-DD"
            maxLength="10"
          />
          <select onChange={this.selectChange} value={this.state.selectsValue}>
            <option value="month">Month</option>
            <option value="week">Week</option>
            <option value="day">Day</option>
          </select>
        </div>
        <ReactTable
          filterable={true}
          defaultPageSize={10}
          data={this.state.filteredTrainings}
          columns={columns}
        />
      </div>
    );
  }
}

export default Calendar;
