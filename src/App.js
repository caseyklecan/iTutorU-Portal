import React, { Component } from 'react';
import {returnPendingTutors, returnTutorData, returnStudentData, initialize, returnEmail, returnPass} from './FirebaseManager';
import TutorTable from './TutorTable';
import StudentTable from './StudentTable';
import './App.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';


class App extends Component {

  constructor(props) {
    super(props);
    this.onClickLogin = this.onClickLogin.bind(this);
  }

  state = {
      tutorData: {},
      studentData: {},
      pendingTutors: {},
      initialized: false,
      arePendingTutors: true,
      loggedIn: false,
      correctEmail: "",
      correctPass: ""
    }

    componentWillMount() {
      if (this.state.initialized === false) {
      initialize().then(res =>
        returnTutorData().then(res => {
          this.setState({ tutorData: res});
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

        returnEmail().then(res => {
          this.setState({correctEmail: JSON.stringify(res)})
        }),

        returnPass().then(res => {
          this.setState({correctPass: JSON.stringify(res)})
        })
      );
    }
      this.setState({initialized: true})
    }

    onClickLogin(email, password) {
      if (JSON.stringify(email) === this.state.correctEmail && JSON.stringify(password) === this.state.correctPass) {
        this.setState({loggedIn: true, correctEmail: "", correctPass: ""})
      }
    }

  render() {
    if (this.state.loggedIn) {
      return (
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">iTutorU Admin</h1>
          </header>

          {/*<div className="search">
              <input type="text" className="searchTerm" placeholder="Who are you looking for?"/>
           </div>*/}

          <div className="content">
            <Tabs>
              <TabList>
                <Tab>Pending Tutors</Tab>
                <Tab>Active Tutors</Tab>
                <Tab>Students</Tab>
              </TabList>

              <TabPanel>
                <h2>Pending tutors</h2>
                {this.state.arePendingTutors ? <TutorTable className="tutorTable" data={this.state.pendingTutors} pending = {true} /> : <h4>No pending tutors at this time.</h4> }
              </TabPanel>

              <TabPanel>
                <h2>Active Tutors</h2>
                <TutorTable className="tutorTable" data={this.state.tutorData} pending = {false} />
              </TabPanel>

              <TabPanel>
                <h2>All Students</h2>
                <StudentTable className="tutorTable" data = {this.state.studentData} />
              </TabPanel>
            </Tabs>
          </div>

        </div>
      );
    } else {
      return (
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">iTutorU Admin</h1>
          </header>
          <div className="login">
            <form>
              <label>Email:<br />
              <input type="text" name="email" id="emailInput" />
              </label><br />
              <label>Password:<br />
              <input type="password" name="password" id="passInput" />
              </label> <br />
              <input type="submit" value="Log In" onClick={() => {
                var email = document.getElementById("emailInput").value;
                var pass = document.getElementById("passInput").value;
                this.onClickLogin(email, pass);
              }}/>
            </form>
          </div>
        </div>
      )
    }
  }
}

export default App;
