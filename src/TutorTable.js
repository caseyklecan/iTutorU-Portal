import React, { Component } from 'react';
import TableRow from './TableRow';
import './App.css';

class TutorTable extends Component {

  renderRows() {
    var tutor_list = []
    var len = this.props.data.length;
    for (var i = 0; i < len; i++) {
      var tutor = this.props.data[i];
      tutor_list.push(tutor);
    }


    return(
      tutor_list.map((item) => {
        return <TableRow
          name={item.childData.name}
          subjects={item.childData.subjects}
          email={item.childData.email}
          uid = {item.childKey}
          pending = {this.props.pending}
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
