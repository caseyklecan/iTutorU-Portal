import React, { Component } from 'react';
import { returnTutorData, returnStudentData, unFreezeTutor, unFreezeStudent, initialize} from './FirebaseManager';
import TutorTable from './TutorTable';
import StudentTable from './StudentTable';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom';
import Popup from './Popup'


class App extends Component {

  state = {
      tutorData: {},
      studentData: {},
      initialized: false
    }

    componentWillMount() {
      if (this.state.initialized == false) {
      initialize().then(res =>
        returnTutorData().then(res => {
          this.setState({ tutorData: res});
          console.log("WE HAVE DATA IT IS " + this.state.tutorData);
        }),

        returnStudentData().then(res => {
          this.setState({ studentData: res});
        })
      );
    }
      this.setState({initialized: true})
    }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">iTutorU Admin</h1>
        </header>

        <div className="search">
            <input type="text" className="searchTerm" placeholder="Who are you looking for?"/>
         </div>

        <div className="Content">
          <p>
            For now, the button below approves all pending tutors.
          </p>
          <button className="approveAll" onClick={approveAll}>
            Approve Pending Tutors
          </button>

          <TutorTable className="tutorTable" data={this.state.tutorData} />

          <StudentTable className="tutorTable" data = {this.state.studentData} />


        </div>

      </div>
    );
  }
}

export default App;

function approveAll() {
  // todo connect to backend, approve all tutors
}

function approveTutor() {
  // todo approve the selected tutor

}
