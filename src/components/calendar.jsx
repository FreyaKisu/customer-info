import React, { Component } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import moment from "moment";

class Calendar extends Component {
  constructor(params) {
    super(params);
    this.state = { gettrainings: [] };
  }

  componentDidMount() {
    this.listCalendar();
  }

  // Get the trainings of customers
  listCalendar = () => {
    fetch("https://customerrest.herokuapp.com/gettrainings")
      .then(response => response.json())
      .then(responseData => {
        console.log(responseData);
        window.responseData = responseData;
        this.setState({ gettrainings: responseData }).then(() => {
          console.log(this.state.gettrainings);
        });
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
          console.log(d.customer.firstname);
          return d.customer.firstname;
        }
      },
      {
        Header: "Last name",
        id: "lastname",
        accessor: d => {
          console.log(d.customer.lastname);
          return d.customer.lastname;
        }
      },
      {
        Header: "Address",
        id: "streetaddress",
        accessor: d => {
          console.log(d.customer.streetaddress);
          return d.customer.streetaddress;
        }
      },
      {
        Header: "Post code",
        id: "postalcode",
        accessor: d => {
          console.log(d.customer.postcode);
          return d.customer.postcode;
        }
      },
      {
        Header: "City",
        id: "city",
        accessor: d => {
          console.log(d.customer.city);
          return d.customer.city;
        }
      },
      {
        Header: "E-mail",
        id: "email",
        accessor: d => {
          console.log(d.customer.email);
          return d.customer.email;
        }
      },
      {
        Header: "Phone number",
        id: "phone",
        accessor: d => {
          console.log(d.customer.phone);
          return d.customer.phone;
        }
      }
    ];

    return (
      <div>
        <ReactTable
          filterable={true}
          defaultPageSize={10}
          data={this.state.gettrainings}
          columns={columns}
        />
      </div>
    );
  }
}

export default Calendar;
