import React, {Component} from 'react';
import { returnTutor } from './FirebaseManager';
import Profile from './Profile';

class ViewProfile extends Component {

 state = {
   uid: '',
   tutorData: ''
 }

 componentWillMount() {
   var url = this.props.location.pathname ;
   var uid1 = url.substr(9);
   this.setState({uid: uid1});
   returnTutor(uid1).then(res => {
     this.setState({ tutorData: res});
     console.log("~~~~IN THE PROFILE WE HAVE DATA IT IS " + JSON.stringify(this.state.tutorData));
   })

 }

  render() {
    console.log("in view profile, data = " + JSON.stringify(this.state.tutorData));
    return (
      <Profile data = {this.state.tutorData} />
    );
  }
}

export default ViewProfile
