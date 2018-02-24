import React, { Component, Button } from 'react';
import Popup from './Popup';

export default class TableRow extends Component {

  state = {
    showPopup: false,
    buttonText: "View"
  }

  onClickView() {
    console.log("PRESSED BUTTON");
    if (this.state.buttonText === "View") {
      this.setState({buttonText: "Hide", showPopup: true})

    }
    else {
      this.setState({buttonText: "View", showPopup: false})
    }
  }

  render() {
    return (
      <tr>
        <td>{this.props.name}</td>
        <td>{this.props.subjects}</td>
        <td>{this.props.email}</td>
        <button className="view" onClick={()=>this.onClickView()}>{this.state.buttonText}</button>
        {this.state.showPopup ? <Popup data={this.props.allData}/> : null}
        <button className="option">Approve</button>
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
    console.log("PRESSED BUTTON");
    if (this.state.buttonText === "View") {
      this.setState({buttonText: "Hide", showPopup: true})

    }
    else {
      this.setState({buttonText: "View", showPopup: false})
    }
  }

  render() {
    return (
      <tr>
        <td>{this.props.studentName}</td>
        <td>{this.props.subjects}</td>
        <td>{this.props.grade}</td>
        <button className="view" onClick={()=>this.onClickView()}>{this.state.buttonText}</button>
        {this.state.showPopup ? <Popup data={this.props.allData}/> : null}
        <button className="option">Match</button>
      </tr>
    );
  }
}
