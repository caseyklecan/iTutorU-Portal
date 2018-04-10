import React from 'react';
import { Modal } from 'react-overlays';
import {getStudentsOfTutor, updateTutor, updateStudent, deleteFromFirebase, returnSubjects, updateSubjects} from './FirebaseManager';

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


class Popup extends React.Component {
  state = {
    showModal: true,
    students: [],
    isEditing: false,
    updatedInfoTutor: {ID: '', name: '', email: '', phone: '', city: '', degree: '', city: '', subjects: ''},
    updatedInfoStudent: {ID: '', name: '', city: '', subject: '', grade: ''},
    editText: "Edit",
    showDeleteButton: false,
    subjects: [],
    checkedSubjects: [],
    /* variables for info */
    props: {},
  }

  onClickClose() {
    this.setState({showModal : false})
  }

  componentWillMount() {
    console.log(this.props);
    if (this.props.type != "NewStudent") {
      this.setState({props: this.props.data.childData});
    }
    if (!this.props.pending && this.props.type === "Tutor") {
    getStudentsOfTutor(this.props.data.childKey).then(res => {
      this.setState({ students: res})
    });
   }

   console.log(this.props.type);
   if (this.props.type === 'NewStudent') {
     //load subjects
     console.log("loading subjects");
     returnSubjects().then(res => {
       this.state.subjects = res;
       this.setState(this.state);
     });

   }

   console.log("PROPS");
   console.log(this.props);
  }

  showStudents() {
    return this.state.students.map((name) =>
       <li>{name}</li>
    );
  }

  editInfo() {
    /* could only ever go in here if it's a student or approved tutor */

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
        this.state.updatedInfoStudent.grade = this.props.data.childData.grade;
        this.state.updatedInfoStudent.ID = this.props.data.childKey;
        this.state.updatedInfoStudent.name = this.props.data.childData.studentName;
        this.state.updatedInfoStudent.city = this.props.data.childData.address;
        this.state.updatedInfoStudent.subject = this.props.data.childData.subjects;
      }
      this.state.editText = "Done";
    }
    else {
      this.state.isEditing = false;
      this.state.editText = "Edit";
      this.state.showDeleteButton = false;
      /* finish editing - save updated info to database */
      if (this.props.type === "Tutor") {
        updateTutor(this.state.updatedInfoTutor);
        this.state.props.degree = this.state.updatedInfoTutor.degree;
        this.state.props.email = this.state.updatedInfoTutor.email;
        this.state.props.phone = this.state.updatedInfoTutor.phone;
        this.state.props.name = this.state.updatedInfoTutor.name;
        this.state.props.city = this.state.updatedInfoTutor.city;
        this.state.props.subjects = this.state.updatedInfoTutor.subjects;
      }
      else {
        console.log("NEW INFO: ");
        console.log(this.state.updatedInfoStudent);
        console.log("OLD");
        console.log(this.props);
        updateStudent(this.state.updatedInfoStudent);
        this.state.props.grade = this.state.updatedInfoStudent.grade;
        this.state.props.studentName = this.state.updatedInfoStudent.name;
        this.state.props.address = this.state.updatedInfoStudent.city;
        this.state.props.subjects = this.state.updatedInfoStudent.subjects;
      }
    }


    this.setState(this.state);
  }

  handleChangeTutorName(event) {
    console.log(this.state.updatedInfoTutor);
    console.log("handle change");

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

  deleteUser() {
    console.log("deleting user");
    if (this.props.type === "Tutor") {
      deleteFromFirebase(this.props.type, this.state.updatedInfoTutor.ID);
    }
    else {
      deleteFromFirebase(this.props.type, this.state.updatedInfoStudent.ID);
    }

    this.props.call(false);
  }


  showEditable(type) {
    console.log("showing editable")
    /* show all the same info except in editable text fields */
    /* have done button */
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
      console.log(this.props.allSubjects);
        /* editable student information */
        return (
          <form>
            <label>
              Name:
              <input type="text" value={this.state.updatedInfoStudent.name}  onChange={(event) => this.handleChangeStudentName(event)} />
            </label>
            <label>
              City:
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

  showData(type) {
    if (type === "Tutor") {

      if (this.props.pending === true) {
        /* PENDING TUTOR */
        return (
          <div>
          <h2>{this.props.data.childData.name}</h2>
          <h4>Email: {this.props.data.childData.email}</h4>
          <h4>Phone Number: {this.props.data.childData.phone}</h4>
          </div>
        );

      }
      else {

          /* TUTOR INFO POPUP */
        return (
          <div>
          <h2>{this.state.props.name}</h2>
          <h4>{this.props.type}</h4>
          <h4>Subject(s): {this.state.props.subjects}</h4>
          <h4>City: {this.state.props.city}</h4>
          <h4>Degree: {this.state.props.degree}</h4>
          <h4>Phone Number: {this.state.props.phone}</h4>

          <h3>Students</h3>
          {this.showStudents()}


          </div>
        );
      }


    }
    else if (type === "Student"){
      /* STUDENT POPUP */
      return (
        <div>
        <h4>{this.state.props.studentName}</h4>
        <h4>{this.props.type}</h4>
        <h4>Subject(s): {this.state.props.subject}</h4>
        <h4>City: {this.state.props.address}</h4>
        <h4>Grade: {this.state.props.grade}</h4>
        </div>
      );

    }
    else {
      return (
        <div>
          <h2>{this.props.text}</h2>
        </div>
      );
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
        <div className="popup">
          {/* show description of subjects */}
          <h3>{`Parent wrote: \"${this.props.subjects}\"`}</h3>
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
          <div className="popup">
            {!this.state.isEditing ? this.showData(this.props.type) : this.showEditable(this.props.type)}
            {this.state.showDeleteButton ? <button onClick={()=>this.deleteUser()} className="closeButton">Delete User</button> : null}
            {!this.props.pending ? <button onClick = {()=>this.editInfo()} className="closeButton">{this.state.editText}</button> : null}
            <button onClick={()=>this.props.call(false)} className="closeButton">Close</button>
          </div>
        </Modal>
      );
    }

  }
}

export default Popup;
