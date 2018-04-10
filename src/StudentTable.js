import React, { Component } from 'react';
import { StudentTableRow } from './TableRow';
import './App.css';

class StudentTable extends Component {
  renderRows() {
    var student_list = []
    var len = this.props.data.length;
    for (var i = 0; i < len; i++) {
      var student = this.props.data[i];
      console.log(student);
      student_list.push(student);
    }

    //student that needs to register (returns table for new students)
    if (this.props.registering == true) {
      return(
        student_list.map((item) => {
          return <StudentTableRow
            studentName={item.studentName}
            parentName={item.parentName}
            phone={item.phone}
            address={item.address}
            studentID = {item.studentID}
            registering = {this.props.registering}
            subjects = {item.subjects}
            grade = {item.grade}
            allSubjects = {this.props.subjects}
            studentID = {item.studentID}
          />
        }
        )
      );
    }
    else {
      //student is already signed up (returns table in "students" tab)
      return(
        student_list.map((item) => {
          return <StudentTableRow
            studentName={item.childData.studentName}
            subjects={item.childData.subject}
            grade={item.childData.grade}
            allData={item}
            registering = {this.props.registering}
            allSubjects = {this.props.subjects}
          />
        }
        )
      );
    }

  }

  render() {
    if (this.props.registering == false) {
      //shows table headers for new students table
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
    else {
      //shows table headers for students tab
      return (
        <table>
          <tbody>
          <tr>
            <th>Parent</th>
            <th>Student</th>
            <th>Address</th>
            <th>Phone Number</th>
            <th>Options</th>
          </tr>
          {this.renderRows()}
          </tbody>
        </table>
      );
    }

  }
}

export default StudentTable;
