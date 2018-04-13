import React from 'react';
import { Modal } from 'react-overlays';
import {getStudentsOfTutor, updateTutor, updateStudent, deleteFromFirebase, returnSubjects, updateSubjects, returnStudent} from './FirebaseManager';

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
  }

  componentWillMount() {
    if (this.props.type === 'NewStudent') {
      //load subjects
      console.log("loading subjects");
      returnSubjects().then(res => {
        this.state.subjects = res;
        this.setState(this.state);
      });

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
            <input className="checkbox" type="checkbox" name="checkbox" value={sub} onChange={(event) => this.handleCheck(event, sub)} />
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
        <h4>Grade: {this.props.grade}</h4>
        <h4><center>Select matching subjects below:</center></h4>

        {this.showSubjects()}
        <button onClick={()=>this.saveSubjects()} className="closeButton">Close</button>
      </div>
    </Modal>
    );
  }


}


export class ApprovedPopup extends React.Component {
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
    updatedInfoStudent: {ID: '', name: '', city: '', subject: '', grade: ''},
    isEditing: false,
    editText: "Edit",
    props: {},
  }
  componentWillMount() {
   this.state.props = this.props;
   console.log(this.props);
   if (this.props.type === "Tutor") {
     if (this.props.data.childData.subjects.length > 1) {
       for (var i = 0; i < this.props.data.childData.subjects.length; i++) {
         this.state.subjects += this.props.data.childData.subjects[i];
         if (i != this.props.data.childData.subjects.length - 1) this.state.subjects += ", ";
       }
       console.log(this.state.subjects);
     }
     else {
       this.state.subjects = this.props.subjects;
     }
   }
   /*
   else {
     console.log("STUDENT");
     console.log(this.props.data.childData.subjects.length);
     if (this.props.data.childData.subjects.length > 1) {
       for (var i = 0; i < this.props.data.childData.subjects.length; i++) {
         this.state.subjects += this.props.data.childData.subjects[i];
         if (i != this.props.data.childData.subjects.length - 1) this.state.subjects += ", ";
       }
     }
     else {
       this.state.subjects = this.props.subjects;
     }
   }
*/
   this.setState(this.state);
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

 showData(type) {
   //approved tutor
   console.log(this.state.props);
   if (type === "Tutor") {
     return (
       <div>
       <h2>{this.state.props.data.childData.name}</h2>
       <h4>{this.props.type}</h4>
       <h4>Subject(s): {this.state.subjects}</h4>
       <h4>City: {this.state.props.data.childData.city}</h4>
       <h4>Degree: {this.state.props.data.childData.degree}</h4>
       <h4>Phone Number: {this.state.props.data.childData.phone}</h4>

       <h3>Students</h3>
       {this.showStudents()}


       </div>
     );
   }
   else {
     return (
       <div>
       <h4>{this.state.props.data.data.studentName}</h4>
       <h4>{this.props.type}</h4>
       <h4>Subject(s): {this.props.subjects}</h4>
       <h4>Address: {this.state.props.data.data.address}</h4>
       <h4>Grade: {this.state.props.data.data.grade}</h4>
       </div>
     );
   }
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
