import React, { Component } from 'react';
import { addCard, onUpdateTasks, onCardMarkComplete, onChangeTitle, setLP } from './FirebaseManager';
import './App.css';

class LearningPlanItem extends Component {
  state = {
    editing: false,
    text: '',
    data: {},
    newItem: '',
  }

  componentWillMount() {
    this.setState({ data: this.props.lpitem });
  }

  onEditText(index, text) {
    this.state.data.list[index].description = text;
    this.setState(this.state);
  }

  // onItemMarkComplete(index) {
  //   var prev = this.state.data.list[index].complete;
  //   this.state.data.list[index].complete = !prev;
  //   this.setState(this.state);
  // }

  onAddListItem(description) {
    this.state.data.list.push({ description: description, complete: false });
    this.state.newItem = '';
    this.setState(this.state);
  }

  renderCard(item) {
    if (this.state.editing) {
      return(
        <div className="learningPlanCard">
        <input className="form-control title" value={item.title} onChange={(event) => this.props.onChangeTitle(event.target.value)}/>

            {item.list.map((listitem, index) => {
              return(
                <div className="learningPlanListItem">
                  <input className="form-control" value={listitem.description} onChange={(event) => this.onEditText(index, event.target.value)} />
                  <button type="button" className="btn btn-sm btn-danger" onClick={() => this.props.onRemoveTask(index)}>Delete</button>
                </div>
              );
            })}

            <div className="learningPlanListItem">
              <input className="form-control" placeholder="New task..." value={this.state.newItem} onChange={(event) => this.setState({ newItem: event.target.value }) }/>
              <button type="button" className="btn btn-sm btn-primary" onClick={() => this.onAddListItem(this.state.newItem)}>Add</button>
            </div>


          <button className="btn btn-md btn-success" onClick={() => {
            this.setState({ editing: false });
            this.props.doneEditing(this.state.data);
          }}>Save</button>
        </div>
      );
    }
    else if (item.complete) {
      console.log("item is complete");
      return(
        <div className="learningPlanCard complete">
          <h3>{item.title}</h3>
          {item.list.map((listitem, index) => {
            return(
              <div className="learningPlanListItem">
                <p>{listitem.description}</p>
              </div>
            );
          })}
        </div>
      );
    }
    else {
      return(
        <div className="learningPlanCard">
          <h3>{item.title}</h3>
          {item.list.map((listitem, index) => {
            return(
              <div className="learningPlanListItem">

                {listitem.complete? <input className="form-check-input" type="checkbox" onChange={(event) => this.props.onItemMarkComplete(index)} checked/>
                : <input className="form-check-input" type="checkbox" onChange={(event) => this.props.onItemMarkComplete(index)} />}
                <p>{listitem.description}</p>
              </div>
            );
          })}
          <div className="flex-row">
            <button className="btn btn-primary" onClick={() => this.setState({ editing: true })}>Edit Plan</button>
            <button className="btn btn-secondary" onClick={() => this.props.onCardMarkComplete()}>Mark Complete</button>
            <button className="btn btn-danger" onClick={() => this.props.deleteCard()}>Delete Learning Plan Item</button>
          </div>
        </div>
      );
    }
  }

  render() {
    if (this.props.edit) this.state.editing = true;
    return(
      this.renderCard(this.state.data)
    );
  }
}

class LearningPlan extends Component {

  state = {
        data: [],
        nextIndex: 1,
        currentlyEditing: null,
        studentuid: '',
  }

  componentWillMount() {
    this.setState({ data: this.props.data });
  }

  addCard() {
    var newCard = {
      title: "New Card",
      list: [],
      complete: false,
      index: this.state.nextIndex
    }

    this.state.data.push(newCard);
    this.state.currentlyEditing = this.state.nextIndex;
    this.state.nextIndex = this.state.nextIndex + 1;
    this.setState(this.state);

    addCard(this.props.studentuid, newCard, newCard.index);
  }

  pressedSave(index, card) {
    addCard(this.props.studentuid, card, index);
  }

  onCardMarkComplete(index) {
    this.state.data[index].complete = true;
    this.setState(this.state);

    //TODO fb
    onCardMarkComplete(this.props.studentuid, index);
  }

  onItemMarkComplete(cardIndex, itemIndex) {
    var prevValue = this.state.data[cardIndex].list[itemIndex].complete;

    this.state.data[cardIndex].list[itemIndex].complete = !prevValue;
    this.setState(this.state, function() {
      addCard(this.props.studentuid, this.state.data[cardIndex], cardIndex);
    });
  }

  onAddTask(cardIndex, task) {
    var task = {
      description: task,
      complete: false,
    }
    var ind = this.state.data[cardIndex].list.length;
    this.state.data[cardIndex].list.push(task);
    this.setState(this.state);
  }

  onRemoveTask(cardIndex, index) {
      this.state.data[cardIndex].list.splice(index, 1);
      this.setState(this.state);
  }

  onChangeTitle(index, title) {
      this.state.data[index].title = title;
      this.setState(this.state);
  }

  render() {
    return(
      <div className="learningPlan">
        <h2>{`${this.props.studentName}'s Learning Plan`}</h2>
        {this.state.data.map((item, index) => {
          return(
            <LearningPlanItem
              lpitem={item}
              onCardMarkComplete={() => this.onCardMarkComplete(index)}
              onItemMarkComplete={(itemIndex) => this.onItemMarkComplete(index, itemIndex)}
              onAddTask={(task) => this.onAddTask(index, task)}
              onRemoveTask={(i) => this.onRemoveTask(index, i)}
              edit={this.state.currentlyEditing === index ? true : false}
              doneEditing={(card) => {
                this.setState({ currentlyEditing: null });
                this.pressedSave(index, card);
              }}
              onChangeTitle={(title) => {
                this.onChangeTitle(index, title);
              }}
              deleteCard={() => {
                console.log(index);
                console.log(this.state.data);
                this.state.data.splice(index, 1);
                this.state.nextIndex--;
                for (var i = 0; i < this.state.data.length; i++) {
                  this.state.data[i].index = i;
                }
                this.setState(this.state, function() {
                  setLP(this.props.studentuid, this.state.data);
                  console.log(this.state);
                });
              }}
            />
          );
        })}
        <button className="btn btn-md btn-primary new-button" onClick={() => this.addCard()}>New Learning Plan Item</button>
      </div>
    );
  }
}

export default LearningPlan;
