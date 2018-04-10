import React from 'react';
import { Modal } from 'react-overlays';

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

class SettingsPopup extends React.Component {


  state = {
    showModal: true,
    subjects: this.props.subjects,
    checkedSubjects: [],
    newSubject: '',
  }

  onClickClose() {
    this.props.call(false);
    this.setState({showModal : false})
  }

  showSubjects() {
    return (
      <div>
        <h4>Add/Remove Subjects</h4>
        <form>
        {this.state.subjects.map((sub) => {
          return (
            <div className="checkboxDiv">
              <input className="checkbox" type="checkbox" name="checkbox" value={sub} onChange={(event) => this.handleCheck(event, sub)} />
              <label className="checkboxLabel">
                {sub}
              </label>

            </div>
          );

        })}
        <label>
          New Subject:
          <input for="add-button" type="text" value={this.state.newSubject} onChange={(event) => this.handleAddNewSubject(event)} />
        </label>
          <button type="button" onClick={() => this.addSubject()} name="add-button" className="closeButton">Add</button>
          <button type="button" onClick= {()=>this.deleteSubjects()} className="deleteButton">Delete Selected Subjects</button>
        </form>
      </div>
    );

  }

  handleCheck(event, sub) {
    this.state.checkedSubjects.push(sub);
  }

  deleteSubjects() {
    this.state.checkedSubjects.map((item) => {
      var ind = this.state.subjects.indexOf(item);
      if (ind != -1) {
        this.state.subjects.splice(ind, 1);
      }
      this.setState(this.state);
    });
    {/*  todo: connect with firebase */}
  }

  addSubject() {

    this.state.subjects.push(this.state.newSubject);
    this.state.newSubject = "";
    this.setState(this.state);

    {/* TODO: handle connect with firebase */}

  }

  handleAddNewSubject(event) {
    this.setState({newSubject: event.target.value});
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
        {this.showSubjects()}
        <button onClick={()=>this.onClickClose()} className="closeButton">Close</button>
      </div>
    </Modal>
    );
  }
}

export default SettingsPopup;
