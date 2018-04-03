import React, { Component } from 'react';
import { StudentTableRow } from './TableRow';
import './App.css';

class StudentTable extends Component {
  renderRows() {
    var student_list = []
    var len = this.props.data.length;
    for (var i = 0; i < len; i++) {
      var student = this.props.data[i];
      student_list.push(student);
    }


    return(
      student_list.map((item) => {
        return <StudentTableRow
          studentName={item.childData.studentName}
          subjects={item.childData.subject}
          grade={item.childData.grade}
          allData={item}
        />
      }
      )
    );
  }

  render() {
    return (
      <table>
        <tbody>
        <tr>
          <th>Student</th>
          <th>Subject(s)</th>
          <th>Grade</th>
          <th>Options</th>
        </tr>
        {this.renderRows()}
        </tbody>
      </table>
    );
  }
}

export default StudentTable;
