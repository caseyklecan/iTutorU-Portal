import React, { Component } from 'react';
import { StudentTableRow } from './TableRow';
import Popup from './Popup';

class StudentTable extends Component {
  constructor(props) {
    super(props);

  }

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
          studentName={item.studentName}
          subjects={item.subject}
          grade={item.grade}
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
