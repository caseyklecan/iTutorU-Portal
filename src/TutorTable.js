import React, { Component } from 'react';
import TableRow from './TableRow';
import './App.css';

class TutorTable extends Component {

  renderRows() {
    var tutor_list = []
    var len = this.props.data.length;

    if (this.props.pending) {
      //pending tutors table
      for (var i = 0; i < len; i++) {
        var tutor = this.props.data[i];
        if (tutor.childData.name != "null"){
          if (tutor.childData.frozen && this.props.pending) tutor_list.push(tutor);

        }
      }
    }
    else if (this.props.rejected) {
      for (var i = 0; i < len; i++) {
        var tutor = this.props.data[i];
        if (tutor.childData.rejected) {
          tutor_list.push(tutor);
        }
      }
    }
    else {
      for (var i = 0; i < len; i++) {
        var tutor = this.props.data[i];
        if (tutor.childData.name != "null"){
          if (!tutor.childData.frozen && !this.props.pending) tutor_list.push(tutor);

        }
      }
    }



    if (this.props.rejected && tutor_list.length === 0) {
      if (tutor_list.length === 0) {
        return <h3>No rejected tutors.</h3>
      }
    }
    else {
      return(
        tutor_list.map((item) => {
          return <TableRow
            name={item.childData.name}
            subjects={item.childData.subjects}
            city={item.childData.city}
            uid = {item.childKey}
            pending = {this.props.pending}
            allSubjects = {this.props.subjects}
            allData={item}
          />
        }
        )
      );
    }

  }

  render() {
    return (
      <table>
        <tbody>
        <tr>
          <th>Tutor</th>
          <th>Subject(s)</th>
          <th>City</th>
          <th>Options</th>
        </tr>
        {this.renderRows()}
        </tbody>
      </table>
    );
  }
}

export default TutorTable;
