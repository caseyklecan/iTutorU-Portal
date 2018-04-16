import React from 'react';
import { Modal } from 'react-overlays';
import {getStudentsOfTutor, updateTutor, updateStudent, returnSubjects, updateSubjects,
  returnStudent, updateLPNotes, getMessage, getConversation} from './FirebaseManager';
import LearningPlan from './LearningPlan';

const modalStyle = {
  position: 'fixed',
  zIndex: 1040,
  top: 0, bottom: 0, left: 0, right: 0
};

const backdropStyle = {
  ...modalStyle,
  zIndex: 'auto',
  backgroundColor: '#000',
  opacity: 0.5
};


export class PendingPopup extends React.Component {
  //for pending tutors to show contact info

  showData() {
    return (
      <div>
      <h2>{this.props.data.childData.name}</h2>
      <h4>Email: {this.props.data.childData.email}</h4>
      <h4>Phone Number: {this.props.data.childData.phone}</h4>
      </div>
    );
  }

  render() {
    return (
        <Modal
          aria-labelledby='modal-label'
          style={modalStyle}
          backdropStyle={backdropStyle}
          show={true}
          onHide={this.close}
          >
        <div className="popup">
          {this.showData()}
          <button onClick={()=>this.props.call(false)} className="closeButton">Close</button>
        </div>
      </Modal>
    );
  }
}

export class SetSubjectsPopup extends React.Component {
  state = {
    subjects: [],
    checkedSubjects: [],
    hasOtherInfo: true,
  }

  componentWillMount() {
    if (this.props.type === "student") {
      //add current subjects to checkedSubjects
      this.setState({checkedSubjects: this.props.subjects})
    }
    if (this.props.otherInfo === undefined) {
      this.setState({hasOtherInfo: false})
    }
  }

  handleCheck(event, sub) {
    console.log("checked " + sub);
    var index = this.state.checkedSubjects.indexOf(sub);
    if (index === -1) {
      this.state.checkedSubjects.push(sub);
    }
    else {
      this.state.checkedSubjects.splice(index, 1);
    }
    this.setState(this.state);
    console.log(this.state.checkedSubjects);
  }

  showSubjects() {
    return (
      <div className="popup-data">
      <form>

      {this.props.allSubjects.map((sub) => {
        return (
          <div className="checkboxDiv">
          {this.state.checkedSubjects.indexOf(sub) == -1 ?
            <input className="checkbox" type="checkbox" name="checkbox" value={sub} onChange={(event) => this.handleCheck(event, sub)} />
            :
            <input className="checkbox" type="checkbox" name="checkbox" value={sub} onChange={(event) => this.handleCheck(event, sub)} checked />
          }
            <label className="checkboxLabel">
              {sub}
            </label>
          </div>
        );

      })}

      </form>
      </div>
    );

  }

  saveSubjects() {

    updateSubjects(this.props.id, this.state.checkedSubjects);
    this.props.call(false);
  }


  render() {
    if (this.props.type === "NewStudent") {
      return (
        <Modal
          aria-labelledby='modal-label'
          style={modalStyle}
          backdropStyle={backdropStyle}
          show={true}
          onHide={this.close}
          >
        <div className="popup" style={{ height: '80%', width: '60%'}}>

          <h3>{`Parent wrote: \"${this.props.subjects}\"`}</h3>
          {this.state.hasOtherInfo ? <h4>{`Other info: \"${this.props.otherInfo}\"`}</h4> : null}
          <h4>Grade: {this.props.grade}</h4>
          <h4><center>Select matching subjects below:</center></h4>

          {this.showSubjects()}
          <button onClick={()=>this.saveSubjects()} className="closeButton">Close</button>
        </div>
      </Modal>
      );
    }
    else {
      return (
        <Modal
          aria-labelledby='modal-label'
          style={modalStyle}
          backdropStyle={backdropStyle}
          show={true}
          onHide={this.close}
          >
        <div className="popup" style={{ height: '80%', width: '60%'}}>

          <h3>{`Subjects: \"${this.props.subjects}\"`}</h3>
          <h4><center>Select new subjects below:</center></h4>

          {this.showSubjects()}
          <button onClick={()=>this.saveSubjects()} className="closeButton">Close</button>
        </div>
      </Modal>
      );
    }
  }


}


export class TextPopup extends React.Component {
  render() {
    return (
      <Modal
        aria-labelledby='modal-label'
        style={modalStyle}
        backdropStyle={backdropStyle}
        show={true}
        onHide={this.close}
        >
      <div className="popup" style={{ height: '40%', width: '20%', padding:'40'}}>

        <h3><center>{this.props.text}</center></h3>
        <button onClick={()=>this.props.call(false)} className="closeButton">Close</button>
      </div>
    </Modal>
    );

  }
}


export class ViewUserPopup extends React.Component {

  state = {
    studentIDs: [],
    studentNames: [],
    subjects: [],
    updatedInfoTutor: {ID: '', name: '', email: '', phone: '', city: '', degree: '', city: '', subjects: ''},
    updatedInfoStudent: {ID: '', name: '', city: '', subject: '', grade: '', paidSessions: 0},
    isEditing: false,
    editText: "Edit",
    props: {},
    paidSessions: 0,

  }
  componentWillMount() {
   this.state.props = this.props;
   if (this.props.type === "Student") {
     if (this.props.data.data.paidSessions != undefined) {
       this.setState({paidSessions: this.props.data.data.paidSessions});
     }
   }
 }

 showStudents() {
   if (this.props.students.length > 0) {
     return this.props.students.map((name) =>
        <li>{name}</li>
     );
   }
   else {
     return <h5>No Students Yet</h5>
   }

 }

 showSubjects() {
   console.log(this.props.subjects);
   return (
     this.props.data.childData.subjects.map((sub) => {
       return (
       <li>{sub}</li>
       );
     })
   );

 }

 showData(type) {
   //approved tutor
   console.log(this.state.props);
   if (type === "Tutor") {
     return (
       <div>
       <h4><center>{this.state.props.data.childData.name} ({this.state.props.type})</center></h4>

       <p>Subject(s):</p>
       <p style={{color:'gray'}}> {this.showSubjects()}</p>

       <p>City:</p>
       <p style={{color: 'gray'}}> {this.state.props.data.childData.city}</p>

       <p>Degree:</p>
       <p style={{color: 'gray'}}> {this.state.props.data.childData.degree}</p>


       <p>Phone Number:</p>
       <p style={{color: 'gray'}}> {this.state.props.data.childData.phone}</p>

       <p>Students:</p>
       {this.showStudents()}


       </div>
     );
   }
   else {
     return (
       <div>
        <h4><center>{this.state.props.data.data.studentName} ({this.state.props.type})</center></h4>

        <p>Subject(s):</p>
        <p style={{color:'gray'}}> {this.state.props.subjects}</p>

        <p>Address:</p>
        <p style={{color: 'gray'}}> {this.state.props.data.data.address}</p>

        <p>Grade:</p>
        <p style={{color: 'gray'}}> {this.state.props.data.data.grade}</p>

        {this.props.data.data.paidSessions != undefined ? <p>Paid Sessions: {this.state.paidSessions}</p> : <p>Paid Sessions: 0</p>}
       </div>
     );
   }
 }

 handleChangePaidSessions(num) {
   this.state.paidSessions = num;
   this.state.updatedInfoStudent.paidSessions = num;
   this.setState(this.state);
 }

 showEditable(type) {
   if (type === "Tutor") {
       /* editable tutor information */
       return (

         <form>
           <label>
             Name:
             <input type="text" value={this.state.updatedInfoTutor.name}  onChange={(event) => this.handleChangeTutorName(event)} />
           </label>
           <label>
             City:
             <input type="text" value={this.state.updatedInfoTutor.city} placeholder={this.props.data.childData.city} onChange={(event) => this.handleChangeTutorCity(event)} />
           </label>
           <label>
             Degree:
             <input type="text" value={this.state.updatedInfoTutor.degree} placeholder={this.props.data.childData.degree} onChange={(event) => this.handleChangeTutorDegree(event)} />
           </label>
           <label>
             Phone Number:
             <input type="text" value={this.state.updatedInfoTutor.phone} placeholder={this.props.data.childData.phone} onChange={(event) => this.handleChangeTutorPhone(event)} />
           </label>
         </form>

       );
   }
   else {
       /* editable student information */
       return (
         <form>
           <label>
             Name:
             <input type="text" value={this.state.updatedInfoStudent.name}  onChange={(event) => this.handleChangeStudentName(event)} />
           </label>
           <label>
             Address:
             <input type="text" value={this.state.updatedInfoStudent.city} onChange={(event) => this.handleChangeStudentCity(event)} />
           </label>
           <label>
             Grade:
             <input type="text" value={this.state.updatedInfoStudent.grade} onChange={(event) => this.handleChangeStudentGrade(event)} />
           </label>
           <label>Number of paid sessions:</label>
           <div className="radioDiv">
            <label className="radioDiv">
              0 <input className = "radio" type="radio" name="gender" value="zero" onChange={(event) => this.handleChangePaidSessions(0)}/>
            </label>
            <label className="radioDiv">
              4
              <input className="radio" type="radio" name="gender" value="four" onChange={(event) => this.handleChangePaidSessions(4)}/>
            </label>
            <label className="radioDiv">
              8
              <input className="radio" type="radio" name="gender" value="eight" onChange={(event) => this.handleChangePaidSessions(8)}/>
            </label>
           </div>
         </form>
       );

   }
 }

 editInfo() {
   /* edit state */
   if (!this.state.isEditing) {
     this.state.isEditing = true;
     this.state.showDeleteButton = true;
     if (this.props.type === "Tutor") {
       this.state.updatedInfoTutor.degree = this.props.data.childData.degree;
       this.state.updatedInfoTutor.email = this.props.data.childData.email;
       this.state.updatedInfoTutor.phone = this.props.data.childData.phone;
       this.state.updatedInfoTutor.ID = this.props.data.childKey;
       this.state.updatedInfoTutor.name = this.props.data.childData.name;
       this.state.updatedInfoTutor.city = this.props.data.childData.city;
       this.state.updatedInfoTutor.subjects = this.props.data.childData.subjects;
     }
     else {
       this.state.updatedInfoStudent.grade = this.props.data.data.grade;
       this.state.updatedInfoStudent.ID = this.props.data.key;
       this.state.updatedInfoStudent.name = this.props.data.data.studentName;
       this.state.updatedInfoStudent.city = this.props.data.data.address;
       this.state.updatedInfoStudent.subject = this.props.data.data.subjects;
     }
     this.state.editText = "Done";
   }
   else {
     this.state.isEditing = false;
     this.state.editText = "Edit";
     /* finish editing - save updated info to database */
     if (this.props.type === "Tutor") {
       updateTutor(this.state.updatedInfoTutor);
       this.state.props.data.childData.degree = this.state.updatedInfoTutor.degree;
       this.state.props.data.childData.email = this.state.updatedInfoTutor.email;
       this.state.props.data.childData.phone = this.state.updatedInfoTutor.phone;
       this.state.props.data.childData.name = this.state.updatedInfoTutor.name;
       this.state.props.data.childData.city = this.state.updatedInfoTutor.city;
       this.state.props.data.childData.subjects = this.state.updatedInfoTutor.subjects;
     }

     else {
       updateStudent(this.state.updatedInfoStudent);
       console.log(this.state.updatedInfoStudent);
       this.state.props.data.data.grade = this.state.updatedInfoStudent.grade;
       this.state.props.data.data.studentName = this.state.updatedInfoStudent.name;
       this.state.props.data.data.address = this.state.updatedInfoStudent.city;
       this.state.props.data.data.subjects = this.state.updatedInfoStudent.subjects;
     }

   }


   this.setState(this.state);

 }

 handleChangeTutorName(event) {
   this.state.updatedInfoTutor.name = event.target.value;
   this.setState(this.state);
 }

 handleChangeTutorCity(event) {
   this.state.updatedInfoTutor.city = event.target.value;
   this.setState(this.state);
 }

 handleChangeTutorDegree(event) {
   this.state.updatedInfoTutor.degree = event.target.value;
   this.setState(this.state);
 }

 handleChangeTutorPhone(event) {
   this.state.updatedInfoTutor.phone = event.target.value;
   this.setState(this.state);
 }

 handleChangeStudentCity(event) {
   this.state.updatedInfoStudent.city = event.target.value;
   this.setState(this.state);
 }

 handleChangeStudentName(event) {
   this.state.updatedInfoStudent.name = event.target.value;
   this.setState(this.state);
 }

 handleChangeStudentGrade(event) {
   this.state.updatedInfoStudent.grade = event.target.value;
   this.setState(this.state);
 }


  render() {
    return (
      <Modal
        aria-labelledby='modal-label'
        style={modalStyle}
        backdropStyle={backdropStyle}
        show={true}
        onHide={this.close}
        >
      <div className="popup">
        {!this.state.isEditing ? this.showData(this.props.type) : this.showEditable(this.props.type)}
        <button onClick = {()=>this.editInfo()} className="closeButton">{this.state.editText}</button>
        <button onClick={()=>this.props.call(false)} className="closeButton">Close</button>
      </div>
      </Modal>
    );
  }
}

export class LearningPlanPopup extends React.Component {
  state = {
    officeNotes: '',
  }

  componentWillMount() {
    if (this.props.data.data.officeNotes != undefined) {
      this.state.officeNotes = this.props.data.data.officeNotes;
      this.setState(this.state);
    }
  }

  handleUpdateNotes(event) {
    this.state.officeNotes = event.target.value;
    this.setState(this.state);
  }

  onClickClose() {
    this.props.call(false);
    var id = this.props.data.key;
    updateLPNotes(id, this.state.officeNotes);
  }

  render() {
    return (
      <Modal
        aria-labelledby='modal-label'
        style={modalStyle}
        backdropStyle={backdropStyle}
        show={true}
        onHide={this.close}
        >
      <div className="popup" style={{ height: '80%', width: '50%'}}>
      <div className="popup-data" style={{height: '90%'}}>
      <LearningPlan
          studentName={this.props.data.data.studentName}
          data={this.props.data.data.learningPlan}
          studentuid={this.props.data.key}
         />
           <h4>Notes from the office:</h4>
           <form>
             <input type="text" value={this.state.officeNotes} onChange={(event) => this.handleUpdateNotes(event)}/>
           </form>
      </div>

        <button onClick={()=>this.onClickClose()} className="closeButton">Close</button>
      </div>
      </Modal>


    );
  }
}

export class MessagesPopup extends React.Component {
  state = {
    showModal: true,
    messages:[],
    messageData: [],
    studentName: '',
    tutorName: '',
    firstName: '',
    secondName: '',
  }

  onClickClose() {
    this.setState({showModal : false})
  }

  componentWillMount() {
    var messages = [];
    getConversation(this.props.data.studentID, this.props.data.tutorID).then(res => {
      console.log("got conversation");
      messages = res;
      this.setState({messages: messages});
      this.setState(this.state);
      for (var i = 0; i < messages.length; i++) {
        getMessage(messages[i]).then(res => {
          this.state.messageData.push(res);
          this.setState(this.state);
          if (this.state.messageData.length == 1) {
            var firstName = '';
            var secondName = '';

            firstName=this.state.studentName;
            secondName=this.state.tutorName;

            this.setState({ firstName });
            this.setState({ secondName });
          }
        })
      }
    });
    this.setState({ studentName: this.props.data.studentInfo.studentName });
    this.setState({ tutorName: this.props.data.tutorInfo.name});
  }

  showData() {
    //map through all messages
    if (this.state.messageData.length > 0) {
      return (this.state.messageData.map((item) => {
        var leftID = this.props.data.studentID;
        if (item.from === leftID) {
          return (
            <div className="messageLeft">
              <p className="sender">{this.state.firstName}</p>
              <div className="messageBodyLeft">
                <p>{item.text}</p>
                <p className="time">{item.time}</p>
              </div>
            </div>
          );
        }
        else {
          return (
            <div className="messageRight">
              <p className="sender">{this.state.secondName}</p>
              <div className="messageBodyRight">
                <p>{item.text}</p>
                <p className="time">{item.time}</p>
              </div>
            </div>
          );
        }
      })
    );

    }
  }

  render() {
    return (
        <Modal
          aria-labelledby='modal-label'
          style={modalStyle}
          backdropStyle={backdropStyle}
          show={true}
          onHide={this.close}
          >
        <div className="popup" style={{ height: '80%'}}>
          <div className="popup-data-settings">
            {this.showData()}
          </div>
          <button onClick={()=>{
            this.props.call(false);
          }} className="closeButton">Close</button>
        </div>
      </Modal>
    );
  }
}
