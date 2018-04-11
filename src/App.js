import React, { Component } from 'react';
import {returnPendingTutors, returnTutorData, returnStudentData, unFreezeTutor, unFreezeStudent, returnPairData, checkLoginCredentials, returnUnregisteredStudents, returnSubjects, getLoggedInUserPromise, userType } from './FirebaseManager';
import TutorTable from './TutorTable';
import StudentTable from './StudentTable';
import PairsTable from './PairsTable';
import SettingsPopup from './SettingsPopup';
import './App.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';


class App extends Component {

  constructor(props) {
    super(props);
    this.onClickLogin = this.onClickLogin.bind(this);
    this.loadData = this.loadData.bind(this);
  }

  state = {
      tutorData: {},
      studentData: {},
      pendingTutors: {},
      initialized: false,
      arePendingTutors: true,
      pairData: [],
      areNewStudents: true,
      unregisteredStudents: {},
      subjects: [],
      showSettings: false,
      loggedIn: false
    }

    componentWillMount() {

    }

    loadData() {
      returnTutorData().then(res => {
          this.setState({ tutorData: res});
        }),

        returnUnregisteredStudents().then(res => {
          console.log("FINISHED GETTING STUDENTS");
          console.log(res);
          console.log(res.length);
          this.setState({unregisteredStudents: res});

          if (this.state.unregisteredStudents.length > 0) {
            this.setState({areNewStudents: true});
          }

        }),

        returnStudentData().then(res => {
          this.setState({ studentData: res});
          console.log(res); /* has childData and childKey */
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
          //result is student->tutor pairs
          //console.log("res: " + JSON.stringify(res));
          console.log(res);
          console.log('HELLO');
          this.setState({ pairData: res });
          //this.state.pairData = res;
          //this.setState(this.state);
          console.log("set the state for pairs");
        });


        this.setState({initialized: true})
        this.setState({loggedIn: true})
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
            <button className="settings" onClick={() => this.showSettings()} className="approve">Settings</button>
          </header>

           {this.state.showSettings ?
             <SettingsPopup subjects={this.state.subjects} call={this.closePopup} />
             : null
           }

           {this.state.areNewStudents ?
            <div className="content">
              <h2><center>New Students</center></h2>
              <StudentTable className="tutorTable" data = {this.state.unregisteredStudents} subjects = {this.state.subjects} registering = {true} />
            </div>
            : null
          }


          <div className="content">
            <Tabs>
              <TabList>
                <Tab>Pending Tutors</Tab>
                <Tab>Active Tutors</Tab>
                <Tab>Students</Tab>
                <Tab>Tutor-Student Pairs</Tab>
              </TabList>

              <TabPanel>
                <h2>Pending tutors</h2>
                {this.state.arePendingTutors ? <TutorTable className="tutorTable" data={this.state.pendingTutors} subjects = {this.state.subjects} pending = {true} /> : <h4>No pending tutors at this time.</h4> }
              </TabPanel>

              <TabPanel>
                <h2>Active Tutors</h2>
                <TutorTable className="tutorTable" data={this.state.tutorData} subjects = {this.state.subjects}pending = {false} />
              </TabPanel>

              <TabPanel>
                <h2>All Students</h2>
                <StudentTable className="tutorTable" data = {this.state.studentData} subjects = {this.state.subjects} registering = {false} />
              </TabPanel>

              <TabPanel>
                  <h2>Tutor-Student Pairs</h2>
                  <PairsTable className="tutorTable" data = {this.state.pairData} />

              </TabPanel>
            </Tabs>
          </div>

        </div>
      );
    } else {
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
              <input type="button" value="Log In" onClick={() => {
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
