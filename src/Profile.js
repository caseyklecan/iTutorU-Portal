import React, {Component} from 'react';
import { Link } from 'react-router-dom';

class Profile extends Component {

  render() {
    console.log(JSON.stringify(this.props.data));
    var json = JSON.parse(JSON.stringify(this.props.data));
    console.log("name: " + json['name']);
    console.log("city: " + json.city);
    return (
      <div>
      <Link to='/'>Home</Link>
      <h1>{json.name}</h1>
      <h1>{json.city}</h1>
      <h1>{json.degree}</h1>
      <h1>{json.email}</h1>
      </div>
    );
  }
}

export default Profile
