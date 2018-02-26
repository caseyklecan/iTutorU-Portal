import React, { Component } from 'react';
import { Modal } from 'react-overlays';


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
  }

  onClickClose() {
    this.setState({showModal : false})
  }

  showData(type) {
    if (type === "Tutor") {
      return (
        <div>
        <h4>{this.props.data.childData.name}</h4>
        <h4>Type: {this.props.type}</h4>
        <h4>Subject(s): {this.props.data.childData.subjects}</h4>
        <h4>City: {this.props.data.childData.city}</h4>
        <h4>Degree: {this.props.data.childData.degree}</h4>
        </div>
      );

    }
    else {
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
  }

  render() {
    console.log("IN POPUP, data = " + JSON.stringify(this.props));
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
