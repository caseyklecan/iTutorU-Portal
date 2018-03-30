import React, { Component } from 'react';
import { PairsTableRow } from './TableRow';
import './App.css';
import {returnStudent, returnTutor} from './FirebaseManager';

class PairsTable extends Component {


  componentWillMount() {
    //need to keep track of student and tutor id's and names
    // console.log("props: " + this.props.data);
    // var len = this.props.data.length;
    // for (var i = 0; i < len; i++) {
    //   var item = { studentID: this.props.data[i].studentID, tutorID: this.props.data[i].tutorID, studentName: this.props.data[i].student};
    //   this.state.pairs_list.push(item);
    //   this.setState(this.state);
    // }
  }

/*
  componentWillMount() {
    var pairs_list = [];
    var len = this.props.data.length;
    console.log("data: " + JSON.stringify(this.props.data));
    for (var i = 0; i < len; i++) {
      var pair = this.props.data[i];
      console.log("pair: " + JSON.stringify(pair));
      var studentInfo = {}
      var tutorInfo = {}
      returnStudent(pair.student).then(res => {
        studentInfo = res;
        console.log("returning student: " + JSON.stringify(res) + "\n\n" + JSON.stringify(studentInfo));
        returnTutor(pair.tutor).then(res => {

          tutorInfo = res;

          console.log("student: " + JSON.stringify(studentInfo) + "tutor: " + JSON.stringify(tutorInfo));
          pairs_list.push({studentID: pair.student, tutorID: pair.tutor, studentInfo: studentInfo, tutorInfo: tutorInfo});
          this.setState({pairs_list: pairs_list});
        });

      });


    }
  }
*/

  renderRows() {
    //move all these calls to app



    if (this.props.data.length != 0) {
      return this.props.data.map(item => {
        console.log("tutor id: " + item.tutorID);
        console.log("tutor: " + item.tutor);
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
