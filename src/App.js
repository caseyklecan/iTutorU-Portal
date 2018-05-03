import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './App.css';
import {returnPendingTutors, returnTutorData, returnStudentData, returnPairData, checkLoginCredentials,
  returnUnregisteredStudents, returnSubjects, userType, isSignedIn, getLP } from './FirebaseManager';
import TutorTable from './TutorTable';
import StudentTable from './StudentTable';
import PairsTable from './PairsTable';
import SettingsPopup from './SettingsPopup';
import LearningPlan from './LearningPlan';

class App extends Component {
  constructor(props) {
    super(props);
    console.log("constructor");
    this.onClickLogin = this.onClickLogin.bind(this);
    this.loadData = this.loadData.bind(this);
  }

  state = {
      tutorData: [],
      studentData: [],
      pendingTutors: [],
      unregisteredStudents: [],
      subjects: [],
      pairData: [],
      arePendingTutors: true,
      areNewStudents: true,
      showSettings: false,
      loggedIn: null,
  }

  componentWillMount() {
    isSignedIn().then(res => {
      this.loadData();
      this.setState({ loggedIn: true })
    }).catch(res => {
      this.setState({ loggedIn: false })
    });
  }

  loadData() {
    console.log("LOAD DATA CALLED");
    returnTutorData().then(res => {
        this.setState({ tutorData: res});
    }),

    returnUnregisteredStudents().then(res => {
      this.setState({unregisteredStudents: res});
      console.log(this.state.unregisteredStudents);
      if (this.state.unregisteredStudents.length > 0) {
        this.setState({areNewStudents: true});
      }
    }),

    returnStudentData().then(res => {
      this.setState({ studentData: res});
    }),

    returnPendingTutors().then(res => {
      this.setState({pendingTutors: res});
      if (res.length === 0) {
        this.setState({arePendingTutors : false})
      }
    }),

    returnSubjects().then(res => {
      this.setState({subjects: res});
    }),

    returnPairData().then(res => {
        this.setState({ pairData: res });
    });

    this.setState({loggedIn: true});
    console.log("STATE SET LOGGED IN TRUE");
  }

  onClickLogin(email, password) {
    checkLoginCredentials(email, password).then(user => {
        userType(user.uid).then(type => {
        if (type === 'admin') {
            this.loadData();
            //this.setState({loggedIn: true});
        }})
    });
  }

  showSettings() {
    this.setState({showSettings: true})
  }

  closePopup = (dataFromPopup) => {
    if (dataFromPopup === false) {
      this.setState({showSettings: false});
    }
  }

  render() {
    if (this.state.loggedIn) {
      return (
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">iTutorU Admin</h1>
            <button onClick={() => this.showSettings()} className="green">Settings</button>
          </header>
           {this.state.showSettings ?
             <SettingsPopup subjects={this.state.subjects} call={this.closePopup} />
             : null
           }

           {this.state.unregisteredStudents.length > 0 ?
            <div className="content">
              <h4><center>New Students</center></h4>
              <StudentTable data = {this.state.unregisteredStudents} subjects = {this.state.subjects} registering = {true} />
            </div>
            : null
          }

          <div className="content">
            <Tabs>
              <TabList>
                <Tab>Pending Tutors</Tab>
                <Tab>Active Tutors</Tab>
                <Tab>Active Students</Tab>
                <Tab>Tutor-Student Pairs</Tab>
                <Tab>Rejected Tutors</Tab>
              </TabList>

              <TabPanel>
                <h2>Pending tutors</h2>
                {this.state.arePendingTutors ? <TutorTable data={this.state.pendingTutors} subjects = {this.state.subjects} pending = {true} /> : <h4>No pending tutors at this time.</h4> }
              </TabPanel>

              <TabPanel>
                <h2>Active Tutors</h2>
                <TutorTable data={this.state.tutorData} subjects = {this.state.subjects} pending = {false} />
              </TabPanel>

              <TabPanel>
                <h2>Active Students</h2>
                <StudentTable data = {this.state.studentData} subjects = {this.state.subjects} registering = {false} />
              </TabPanel>

              <TabPanel>
                  <h2>Tutor-Student Pairs</h2>
                  <PairsTable data = {this.state.pairData} />
              </TabPanel>

              <TabPanel>
                <h2>Rejected Tutors</h2>
                <TutorTable data = {this.state.tutorData} rejected = {true} />
              </TabPanel>
            </Tabs>
          </div>

        </div>
      );
    }
    else if (this.state.loggedIn == null) {
      return(
        <div>
          <h1><center>Loading..</center></h1>
        </div>
      );
    }
    else {
      return (
        <div className="App">
          <header className="App-header">
            <h1 className="App-title-before">iTutorU Admin</h1>
          </header>
          <div className="login">
              <label>Email:<br />
              <input type="text" name="email" id="emailInput" />
              </label><br />
              <label>Password:<br />
              <input type="password" name="password" id="passInput" />
              </label> <br />
              <input type="button" className="closeButton" value="Log In" onClick={() => {
                var email = document.getElementById("emailInput").value;
                var pass = document.getElementById("passInput").value;
                this.onClickLogin(email, pass);
              }}/>
          </div>
        </div>
      )
    }
  }
}

export default App;
