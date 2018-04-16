import React, { Component } from 'react';
import { PairsTableRow } from './TableRow';
import './App.css';
import {returnStudent, returnTutor} from './FirebaseManager';

class PairsTable extends Component {
  renderRows() {
    if (this.props.data.length != 0) {
      return this.props.data.map(item => {
        if (item.tutor != null) {
        return <PairsTableRow
          tutorID={item.tutorID}
          studentID={item.studentID}
          studentInfo = {item.student}
          tutorInfo = {item.tutor}
        />
      }
      })
    }


  }

  render() {
    return (
      <table>
        <tbody>
        <tr>
          <th>Student</th>
          <th>Tutor</th>
          <th>Messages</th>
        </tr>
        {this.renderRows()}
        </tbody>
      </table>
    );
  }
}

export default PairsTable;
