import React, { Component } from 'react';
import { Modal } from 'react-overlays';
import {getStudentsOfTutor} from './FirebaseManager';


let rand = ()=> (Math.floor(Math.random() * 20) - 10);

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

const dialogStyle = function() {
  // we use some psuedo random coords so nested modals
  // don't sit right on top of each other.
  let top = 50;
  let left = 50;

  return {
    position: 'absolute',
    width: 400,
    top: top + '%', left: left + '%',
    transform: `translate(-${top}%, -${left}%)`,
    border: '1px solid #e5e5e5',
    backgroundColor: 'white',
    boxShadow: '0 5px 15px rgba(0,0,0,.5)',
    padding: 20,
    borderRadius: 10,
  };
};


class Popup extends React.Component {
  state = {
    showModal: true,
    students: [],
  }

  onClickClose() {
    this.setState({showModal : false})
  }

  componentWillMount() {
    if (!this.props.pending) {
    getStudentsOfTutor(this.props.data.childKey).then(res => {
      this.setState({ students: res})
    });
  }
  }

  showStudents() {
    return this.state.students.map((name) =>
       <li>{name}</li>
    );
  }

  showData(type) {
    if (type === "Tutor") {

      if (this.props.pending == true) {
        return (
          <div>
          <h2>{this.props.data.childData.name}</h2>
          <h4>Email: {this.props.data.childData.email}</h4>
          <h4>Phone Number: {this.props.data.childData.phone}</h4>
          </div>
        );

      }
      else {


        return (
          <div>
          <h2>{this.props.data.childData.name}</h2>
          <h4>Type: {this.props.type}</h4>
          <h4>Subject(s): {this.props.data.childData.subjects}</h4>
          <h4>City: {this.props.data.childData.city}</h4>
          <h4>Degree: {this.props.data.childData.degree}</h4>

          <h3>Students</h3>
          {this.showStudents()}


          </div>
        );
      }


    }
    else if (type == "Student"){
      return (
        <div>
        <h4>{this.props.data.studentName}</h4>
        <h4>Type: {this.props.type}</h4>
        <h4>Subject(s): {this.props.data.subjects}</h4>
        <h4>City: {this.props.data.city}</h4>
        <h4>Grade: {this.props.data.grade}</h4>
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

  render() {
    return (
        <Modal
          aria-labelledby='modal-label'
          style={modalStyle}
          backdropStyle={backdropStyle}
          show={true}
          onHide={this.close}
          >
        <div style ={dialogStyle()}>
          <button onClick={()=>this.props.call(false)}>Close</button>
          {this.showData(this.props.type)}

        </div>
      </Modal>
    );
  }
}

export default Popup;
