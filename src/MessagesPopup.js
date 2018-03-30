import React, { Component } from 'react';
import { Modal } from 'react-overlays';
import { getConversation, getMessage, returnStudent, returnTutor } from './FirebaseManager';



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


class MessagesPopup extends React.Component {
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
    console.log("STATE: " + JSON.stringify(this.props));
    getConversation(this.props.data.studentID, this.props.data.tutorID).then(res => {
      console.log("got conversation");
      messages = res;
      this.setState({messages: messages});
      this.setState(this.state);
      for (var i = 0; i < messages.length; i++) {
        getMessage(messages[i]).then(res => {
          this.state.messageData.push(res);
          this.setState(this.state);
        })
      }

      console.log("messages: " + JSON.stringify(messages));

    });



    returnStudent(this.props.data.studentID).then(res => {
      this.setState({studentName: res.studentName});
    });

    returnTutor(this.props.data.tutorID).then(res => {
      this.setState({tutorName: res.name});
    });

    if (this.state.messageData.length > 0) {
      console.log("MESSAGES LENGTH: " + this.state.messages.length);
      var firstName = '';
      var secondName = '';
      var isFirst = true;
      var firstID = this.state.messageData[0].from;
      if (firstID === this.state.studentID) {
        firstName = this.state.studentName;
        secondName = this.state.tutorName;
      }
      else {
        firstName = this.state.tutorName;
        secondName = this.state.studentName;
      }

      console.log("first name: " + firstName);

      this.setState({firstName: firstName});
      this.setState({secondName: secondName});
    }


  }

  showData() {
    //map through all messages
    console.log("messages:");
    console.log(this.state.messages);
    if (this.state.messageData.length > 0) {


      return (this.state.messageData.map((item) => {
        console.log(item);
        var firstID = this.state.messageData[0].from;
        if (item.from === firstID) {
          return (
            <div>
              <h5>From: {this.state.firstName}</h5>
              <h5>Message: {item.text}</h5>
              <h5>Time: {item.time}</h5>
            </div>
          );
        }
        else {
          return (
            <div>
              <h5>From: {this.state.secondName}</h5>
              <h5>Message: {item.text}</h5>
              <h5>Time: {item.time}</h5>
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
        <div className="popup">

          {this.showData()}
          <button onClick={()=>this.props.call(false)} className="closeButton">Close</button>
        </div>
      </Modal>
    );
  }
}

export default MessagesPopup;
