import React, { Component, Button } from 'react';
import Popup from './Popup';
import { Link , Route } from 'react-router-dom';
import ViewProfile from './ViewProfile';
import './App.css';

export default class TableRow extends Component {

  state = {
    showPopup: false,
    buttonText: "View"
  }

  closePopup = (dataFromPopup) => {
    if (dataFromPopup === false) {
      this.setState({showPopup: false});
    }
  }

  onClickView() {
    if (this.state.showPopup === false) {
      this.setState({showPopup : true});
    }
  }


  render() {
    console.log("data = " + JSON.stringify(this.props));
    return (
      <tr>
        <td>{this.props.name}</td>
        <td>{this.props.subjects}</td>
        <td>{this.props.email}</td>
        {/*}<Link to={'./profile/' + this.props.uid}>View</Link>*/}
        <button className="view" onClick={()=>this.onClickView()}>{this.state.buttonText}</button>
        {this.state.showPopup ? <Popup data={this.props.allData} call={this.closePopup} type="Tutor" /> : null}
        <button className="approve">Approve</button>
      </tr>
    );
  }
}


export class StudentTableRow extends Component {
  state = {
    showPopup: false,
    buttonText: "View"
  }

  onClickView() {
    if (this.state.buttonText === "View") {
      this.setState({ showPopup: true})

    }
    else {
      this.setState({buttonText: "View", showPopup: false})
    }
  }

  closePopup = (dataFromPopup) => {
    if (dataFromPopup === false) {
      this.setState({showPopup: false});
    }
  }

  render() {
    return (
      <tr>
        <td>{this.props.studentName}</td>
        <td>{this.props.subjects}</td>
        <td>{this.props.grade}</td>

        <button className="view" onClick={()=>this.onClickView()}>{this.state.buttonText}</button>
        {this.state.showPopup ? <Popup data={this.props.allData} call={this.closePopup} type="Student" /> : null}
        </tr>
    );
  }
}
