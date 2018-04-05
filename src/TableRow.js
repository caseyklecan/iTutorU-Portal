import React, { Component } from 'react';
import Popup from './Popup';
import './App.css';
import MessagesPopup from './MessagesPopup';
import { getConversation, registerStudent } from './FirebaseManager';

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
    if (this.state.approved === true) {
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
  }


  render() {
    return (
      <tr>
        <td>{this.props.name}</td>
        <td>{this.props.subjects}</td>
        <td>{this.props.email}</td>
        <button className="view" onClick={()=>this.onClickView()}>{this.state.buttonText}</button>
        {this.state.showPopup ? <Popup data={this.props.allData} call={this.closePopup} type="Tutor" pending = {this.props.pending} /> : null}
        {this.props.pending ? <button className="approve" onClick={() => this.onClickApprove()}>Approve</button> : null }
        {this.state.approved ? <Popup text="Tutor is approved!" call={this.closePopup} pending ={this.props.pending} /> : null}
      </tr>
    );
  }
}


export class StudentTableRow extends Component {
  state = {
    showPopup: false,
    buttonText: "View",
    registered: false,
  }

  onClickView() {
    if (this.state.buttonText === "View") {
      this.setState({ showPopup: true})

    }
    else {
      this.setState({buttonText: "View", showPopup: false})
    }
  }

  onClickRegister() {
    registerStudent(this.props.studentID);
    this.setState({registered: true});
  }

  closePopup = (dataFromPopup) => {
    if (dataFromPopup === false) {
      this.setState({showPopup: false});
    }
  }

  render() {
    if (this.props.registering) {
      if (!this.state.registered) {
        return (
          <tr>
            <td>{this.props.parentName}</td>
            <td>{this.props.studentName}</td>
            <td>{this.props.address}</td>
            <td>{this.props.phone}</td>
            <button className="view" onClick={()=>this.onClickRegister()}>Remove</button>
          </tr>
        );
      }
      else {
        return (
          <tr>
          </tr>

        );

      }
    }
    else {
      return (
        <tr>
          <td>{this.props.studentName}</td>
          <td>{this.props.subjects}</td>
          <td>{this.props.grade}</td>

          <button className="view" onClick={()=>this.onClickView()}>{this.state.buttonText}</button>
          {this.state.showPopup ? <Popup data={this.props.allData} call={this.closePopup} type="Student" className="popup"/> : null}
          </tr>
      );
    }

  }
}

export class PairsTableRow extends Component {

  state = {
    buttonText: "Messages",
    messagesExist: false,
    showPopup: false,
  }

  componentWillMount() {
    console.log("CMPNNENT WILL MOUNT");
    console.log(this.props);

    getConversation(this.props.studentID, this.props.tutorID).then(res => {
      console.log("got conversation");
      console.log(res);
      if (res != null) {
        this.setState({messagesExist: true});
      }
    });
  }


  onClickMessages() {
      this.setState({ showPopup: true})
  }

  closePopup = (dataFromPopup) => {
    if (dataFromPopup === false) {
      this.setState({showPopup: false});
    }
  }


  render() {
    return (
      <tr>
        <td>{this.props.studentInfo.studentName}</td>
        <td>{this.props.tutorInfo.name}</td>
        {this.state.messagesExist ? <button className="view" onClick={()=>this.onClickMessages()}>{this.state.buttonText}</button> : <td>No Messages</td>}
        {this.state.showPopup ? <MessagesPopup data={this.props} call={this.closePopup}/> : null}
      </tr>
    );
  }
}
