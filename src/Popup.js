import React, { Component } from 'react';


class Popup extends React.Component {
  render() {
    console.log("IN POPUP, data = " + JSON.stringify(this.props));
    return (
      <div className='popup'>
        <h1 style={{fontSize: 20, color: 'black'}}>{this.props.data.name}</h1>
      </div>
    );
  }
}

export default Popup;
