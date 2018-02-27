import React, { Component, Button } from 'react';
import Popup from './Popup';
import { Link , Route } from 'react-router-dom';
import ViewProfile from './ViewProfile';
import {approveTutor} from './FirebaseManager';

export default class TableRow extends Component {

  state = {
    showPopup: false,
    buttonText: this.props.pending ? "Contact" : "View",
    pending: this.props.pending,
    approved: false,
  }

  closePopup = (dataFromPopup) => {
    if (dataFromPopup === false) {
      this.setState({showPopup: false});
    }
    if (this.state.approved == true) {
      this.setState({approved: false});
    }
  }

  onClickView() {
    if (this.state.showPopup === false) {
      this.setState({showPopup : true});
    }
  }

  onClickApprove() {
    this.setState({pending: false, approved: true})
    {/*approveTutor(this.props.uid); (uncomment this later when we actually want to modify database));*/}
  }


  render() {
    return (
      <tr>
        <td>{this.props.name}</td>
        <td>{this.props.subjects}</td>
        <td>{this.props.email}</td>
        {/*}<Link to={'./profile/' + this.props.uid}>View</Link>*/}
        <button className="view" onClick={()=>this.onClickView()}>{this.state.buttonText}</button>
        {this.state.showPopup ? <Popup data={this.props.allData} call={this.closePopup} type="Tutor" pending = {this.props.pending} /> : null}
        {this.props.pending ? <button className="option" onClick={() => this.onClickApprove()}>Approve</button> : null }
        {this.state.approved ? <Popup text="Tutor is approved!" call={this.closePopup} pending ={this.props.pending} /> : null}
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
        <button className="option">Match</button>
        </tr>
    );
  }
}
