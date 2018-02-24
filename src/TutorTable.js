import React, { Component } from 'react';
import TableRow from './TableRow';

class TutorTable extends Component {

  renderRows() {
    console.log("props.data: " + JSON.stringify(this.props));
    var tutor_list = []
    var len = this.props.data.length;
    console.log("len: " + len);
    for (var i = 0; i < len; i++) {
      var tutor = this.props.data[i];
      //console.log("got tutor, email = " + tutor['email']);
      tutor_list.push(tutor);
    }


    return(
      tutor_list.map((item) => {
        console.log("creating a row: " + item.name);
        return <TableRow
          name={item.name}
          subjects={item.subjects}
          email={item.email}
          allData={item}
        />
      }
      )
    );
  }

  render() {
    return (
      // const data = this.props();
      // const { data } = this.props;
      <table>
        <tbody>
        <tr>
          <th>Tutor</th>
          <th>Subject(s)</th>
          <th>Email</th>
          <th>Options</th>
        </tr>
        {this.renderRows()}
        </tbody>
      </table>
    );
  }
}

export default TutorTable;
