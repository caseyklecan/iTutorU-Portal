import React, { Component } from 'react';
import {returnPendingTutors, returnTutorData, returnStudentData, unFreezeTutor, unFreezeStudent, initialize} from './FirebaseManager';
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
      pendingTutors: {},
      initialized: false,
      arePendingTutors: true
    }

    componentWillMount() {
      if (this.state.initialized == false) {
      initialize().then(res =>
        returnTutorData().then(res => {
          this.setState({ tutorData: res});
        }),

        returnStudentData().then(res => {
          this.setState({ studentData: res});
        }),

        returnPendingTutors().then(res => {
          this.setState({pendingTutors: res});
          if (res.length == 0) {
            this.setState({arePendingTutors : false})
          }
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


          <h2>Pending tutors</h2>
          {this.state.arePendingTutors ? <TutorTable className="tutorTable" data={this.state.pendingTutors} pending = {true} /> : <h4>No pending tutors at this time.</h4> }


          <h2>All Tutors</h2>
          <TutorTable className="tutorTable" data={this.state.tutorData} pending = {false} />


          <h2>All Students</h2>
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
