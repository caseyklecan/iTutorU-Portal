import React, { Component } from 'react';
import './App.css';

class App extends Component {



  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">iTutorU Admin</h1>
        </header>

        <div className="search">
            <input type="text" className="searchTerm" placeholder="Who are you looking for?"/>
            <button type="submit" className="searchButton">
              Search
           </button>
         </div>

        <div className="Content">
          <p>
            For now, the button below approves all pending tutors.
          </p>
          <button className="approve" onClick={approveAll}>
            Approve Pending Tutors
          </button>

          <table className="tutorTable">
            <tr>
              <th>Tutor</th>
              <th>Subject(s)</th>
              <th># Students</th>
            </tr>
            <tr>
              <td>Casey Klecan</td>
              <td>math, computer science</td>
              <td>2</td>
            </tr>
            <tr>
              <td>Casey Klecan</td>
              <td>math, computer science</td>
              <td>2</td>
            </tr>
          </table>

          <table className="tutorTable">
            <tr>
              <th>Student</th>
              <th>Subject(s)</th>
              <th>Tutor</th>
            </tr>
            <tr>
              <td>Megan Wood</td>
              <td>math</td>
              <td>Casey Klecan</td>
            </tr>
            <tr>
              <td>Courtney Wood</td>
              <td>computer science</td>
              <td>Casey Klecan</td>
            </tr>
          </table>
        </div>

      </div>
    );
  }
}

export default App;

function approveAll() {
  // todo connect to backend, approve all tutors
}
