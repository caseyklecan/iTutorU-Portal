import React, { Component } from 'react';
import {ApprovedPopup, ViewUserPopup, PendingPopup, SetSubjectsPopup, LearningPlanPopup} from './Popup';
import './App.css';
import MessagesPopup from './MessagesPopup';
import { getConversation, registerStudent, getStudentsOfTutor, returnStudent, approveTutor, rejectTutor, updateCheckboxes } from './FirebaseManager';

export default class TableRow extends Component {
  //FOR TUTORS
  state = {
    showPopup: false,
    buttonText: this.props.pending ? "Contact" : "View",
    pending: this.props.pending,
    approved: false,
    subjects: '',
    students: [],

    /* only add all these to the database if one is checked */
    checkboxes: {interviewed: false, checkedRefs: false, madeHiringDecision: false, sentFingerprintDocs: false, cleared: false, sentW9: false, sentWelcome: false}
  }

  componentWillMount() {

    if (this.props.subjects.length > 1) {
      for (var i = 0; i < this.props.subjects.length; i++) {
        this.state.subjects += this.props.subjects[i];
        if (i != this.props.subjects.length - 1) this.state.subjects += ", ";
      }
    }
    else {
      this.state.subjects = this.props.subjects;
    }
    this.setState(this.state);

    //get students for approved tutor
    if (!this.props.pending) {
      getStudentsOfTutor(this.props.allData.childKey).then(res => {
        this.setState({ studentIDs: res});
        res.map((studentID) => {
          returnStudent(studentID).then(res2 => {
            console.log(res2.val());
            this.state.students.push(res2.val().studentName);
          })
        })
      },
      this.setState(this.state),
      console.log(this.state.students),
    );
    }
    else {
      //see if checkboxes exist
      if (this.props.allData.childData.checkboxes) {
        this.setState({checkboxes: this.props.allData.childData.checkboxes});
      }
    }
  }

  closePopup = (dataFromPopup) => {
    if (dataFromPopup === false) {
      this.setState({showPopup: false});
      this.setState({showResultPopup: false});
    }
  }

  onClickView() {
    if (this.state.showPopup === false) {
      this.setState({showPopup : true});
    }
  }

  onClickApprove() {
    this.setState({showResultPopup: true, approved: true})
    approveTutor(this.props.allData.childKey);
  }

  onClickReject() {
    {/*this.setState({pending:false, approved: false}) delete from database*/}
    this.setState({showResultPopup: true, approved: false});
    rejectTutor(this.props.allData.childKey);
  }

  handleCheck(event, title, val) {
    if (title === "interviewed") {
      this.state.checkboxes.interviewed = val;
    }
    else if (title === "checkedRefs") {
      this.state.checkboxes.checkedRefs = val;
    }
    else if (title === "sentFingerprintDocs") {
      this.state.checkboxes.sentFingerprintDocs = val;
    }
    else if (title === "cleared") {
      this.state.checkboxes.cleared = val;
    }
    else if (title === "sentW9") {
      this.state.checkboxes.sentW9 = val;
    }
    this.setState(this.state);
    updateCheckboxes(this.props.allData.childKey, this.state.checkboxes);

  }

  showCheckList() {
    return (
      <form>
        <div className="checkboxDiv">
          {this.state.checkboxes.interviewed ?
            <input className="checkbox" type="checkbox" name="checkbox" value="interviewed" onChange={(event) => this.handleCheck(event, "interviewed", false)} checked />
            :
            <input className="checkbox" type="checkbox" name="checkbox" value="interviewed" onChange={(event) => this.handleCheck(event, "interviewed", true)} />
          }
          <label className="checkboxLabel">
            Interviewed
          </label>
        </div>

        <div className="checkboxDiv">
          {this.state.checkboxes.checkedRefs ?
            <input className="checkbox" type="checkbox" name="checkbox" value="checkedRefs" onChange={(event) => this.handleCheck(event, "checkedRefs", false)} checked />
            :
            <input className="checkbox" type="checkbox" name="checkbox" value="checkedRefs" onChange={(event) => this.handleCheck(event, "checkedRefs", true)} />
          }
          <label className="checkboxLabel">
            Checked References
          </label>
        </div>


        <div className="checkboxDiv">
          {this.state.checkboxes.madeHiringDecision ?
            <input className="checkbox" type="checkbox" name="checkbox" value="madeHiringDecision" onChange={(event) => this.handleCheck(event, "madeHiringDecision", false)} checked />
            :
            <input className="checkbox" type="checkbox" name="checkbox" value="madeHiringDecision" onChange={(event) => this.handleCheck(event, "madeHiringDecision", true)} />
          }
          <label className="checkboxLabel">
            Made Hiring Decision
          </label>
        </div>


        <div className="checkboxDiv">
          {this.state.checkboxes.sentFingerprintDocs ?
            <input className="checkbox" type="checkbox" name="checkbox" value="sentFingerprintDocs" onChange={(event) => this.handleCheck(event, "sentFingerprintDocs", false)} checked />
            :
            <input className="checkbox" type="checkbox" name="checkbox" value="madeHiringDecision" onChange={(event) => this.handleCheck(event, "sentFingerprintDocs", true)} />
          }
          <label className="checkboxLabel">
            Sent Documentation for Fingerprinting
          </label>
        </div>


        <div className="checkboxDiv">
          {this.state.checkboxes.cleared ?
            <input className="checkbox" type="checkbox" name="checkbox" value="cleared" onChange={(event) => this.handleCheck(event, "cleared", false)} checked />
            :
            <input className="checkbox" type="checkbox" name="checkbox" value="cleared" onChange={(event) => this.handleCheck(event, "cleared", true)} />
          }
          <label className="checkboxLabel">
            Cleared to Tutor
          </label>
        </div>

        <div className="checkboxDiv">
          {this.state.checkboxes.sentW9 ?
            <input className="checkbox" type="checkbox" name="checkbox" value="sentW9" onChange={(event) => this.handleCheck(event, "sentW9", false)} checked />
            :
            <input className="checkbox" type="checkbox" name="checkbox" value="sentW9" onChange={(event) => this.handleCheck(event, "sentW9", true)} />
          }
          <label className="checkboxLabel">
            Sent W9 Form
          </label>
        </div>

      </form>
    );
  }

  render() {
    //pending tutors table
    if (this.props.pending) {
      return (
        <tr>
          <td>{this.props.name}</td>
          <td>{this.state.subjects}</td>
          <td>{this.props.city}</td>
          <button className="view" onClick={()=>this.onClickView()}>{this.state.buttonText}</button>
          {this.state.showPopup ? <PendingPopup data={this.props.allData} call={this.closePopup} /> : null}
          <button className="view" onClick={() => this.onClickApprove()}>Approve</button>
          <button className="approve" onClick={() => this.onClickReject()}>Reject</button>
          {this.state.showResultPopup && this.state.approved ? <ApprovedPopup text="Tutor is approved!" call={this.closePopup} /> : null}
          {this.state.showResultPopup && !this.state.approved ? <ApprovedPopup text="Applicant is rejected." call={this.closePopup} /> : null}
          {this.showCheckList()}
        </tr>
      );
    }
    else {
      return (
        <tr>
          <td>{this.props.name}</td>
          <td>{this.state.subjects}</td>
          <td>{this.props.city}</td>
          <button className="view" onClick={()=>this.onClickView()}>{this.state.buttonText}</button>
          {this.state.showPopup ? <ViewUserPopup data={this.props.allData} subjects = {this.state.subjects} call={this.closePopup} type="Tutor" students = {this.state.students} /> : null}
        </tr>
      );
    }

  }
}


export class StudentTableRow extends Component {
  state = {
    showPopup: false,
    buttonText: "View/Edit",
    registered: false,
    subjects: [],
    subjectstring: '',
    showSubjectsPopup: false,
    showLPPopup: false,
  }

  componentWillMount() {
    console.log(this.props);
    if (!this.props.registering) {
      if (Array.isArray(this.props.subjects)) {
        if (this.props.subjects.length > 1) {
          for (var i = 0; i < this.props.subjects.length; i++) {
            this.state.subjectstring += this.props.subjects[i];
            if (i != this.props.subjects.length - 1) this.state.subjectstring += ", ";
          }
        }
        else {
          this.state.subjectstring = this.props.subjects;
        }
      }
      else {
        this.state.subjectstring = this.props.subjects;
      }
      //this.state.subjectstring += " ";
      this.setState(this.state);
    }

  }


  onClickView() {

    this.setState({ showPopup: true})


  }

  onClickRegister() {
    registerStudent(this.props.studentID);
    this.setState({registered: true});
  }

  closePopup = (dataFromPopup) => {
    if (dataFromPopup === false) {
      this.setState({showPopup: false, showSubjectsPopup: false, showLPPopup: false});
    }
  }

  editSubjects() {
    if (this.props.registering) {
      //open popup and pass in subject info
      console.log("subjects: " + this.props.subjects);
      this.setState({showPopup: true})
    }
    else {
      this.setState({showSubjectsPopup: true})
    }

  }

  editLP() {
    this.setState({showLPPopup: true})
  }

  render() {
    //pending student
    if (this.props.registering) {
      if (!this.state.registered) {
        return (
          <tr>
            <td>{this.props.parentName}</td>
            <td>{this.props.studentName}</td>
            <td>{this.props.email}</td>
            <td>{this.props.address}</td>
            <td>{this.props.phone}</td>
            <button className="view" onClick={()=>this.editSubjects()}>Set Subject(s)</button>
            <button className="approve" onClick={()=>this.onClickRegister()}>Remove</button>

            {this.state.showPopup ? <SetSubjectsPopup subjects = {this.props.subjects} id = {this.props.studentID} allSubjects = {this.props.allSubjects} grade = {this.props.grade} otherInfo={this.props.otherInfo} call={this.closePopup} type="NewStudent" className="popup"/> : null}
          </tr>
        );
      }
      else {
        //don't show row if they've been approved
        return (
          <tr>
          </tr>
        );
      }
    }
    else {
      //active student
      return (
        <tr>
          <td>{this.props.studentName}</td>
          <td>{this.state.subjectstring}</td>
          <td>{this.props.grade}</td>

          <button className="view" onClick={()=>this.onClickView()}>{this.state.buttonText}</button>
          <button className="view" onClick={()=>this.editSubjects()}>Edit Subjects</button>
          <button className="view" onClick={()=>this.editLP()}>View/Edit LP</button>
          {this.state.showPopup ? <ViewUserPopup data={this.props.allData} subjects = {this.state.subjectstring} call={this.closePopup} type="Student" className="popup"/> : null}
          {this.state.showSubjectsPopup ? <SetSubjectsPopup subjects = {this.props.subjects} id={this.props.studentID} allSubjects={this.props.allSubjects} call={this.closePopup} type="student" className="popup"/> : null}
          {this.state.showLPPopup ? <LearningPlanPopup data = {this.props.allData} call={this.closePopup} className="popup"/> : null}
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
