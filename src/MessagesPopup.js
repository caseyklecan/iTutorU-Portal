import React, { Component } from 'react';
import { Modal } from 'react-overlays';
import { getConversation, getMessage, returnStudent, returnTutor } from './FirebaseManager';
import './App.css';



let rand = ()=> (Math.floor(Math.random() * 20) - 10);

const modalStyle = {
  position: 'fixed',
  zIndex: 1040,
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
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
    console.log("PROPS");
    console.log(this.props);
    //console.log("STATE: " + JSON.stringify(this.props));
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
            //console.log("MESSAGES LENGTH: " + this.state.messages.length);
            var firstName = '';
            var secondName = '';

            firstName=this.state.studentName;
            secondName=this.state.tutorName;

            this.setState({ firstName });
            this.setState({ secondName });
          }

        })
      }

      console.log("messages: " + JSON.stringify(messages));

    });


    this.setState({ studentName: this.props.data.studentInfo.studentName });
    this.setState({ tutorName: this.props.data.tutorInfo.name});




  }

  showData() {
    //map through all messages
    console.log("messages:");
    console.log(this.state.messages);
    if (this.state.messageData.length > 0) {


      return (this.state.messageData.map((item) => {
        console.log(item);
        //var firstID = this.state.messageData[0].from;
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
          <div className="popup-data">
            {this.showData()}
          </div>
          <button onClick={()=>{
            this.props.call(false);
            console.log("registered click");
          }} className="closeButton">Close</button>
        </div>
      </Modal>
    );
  }
}

export default MessagesPopup;
