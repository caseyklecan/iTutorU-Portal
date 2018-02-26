import React, { Component } from 'react';
import TableRow from './TableRow';

class TutorTable extends Component {

  renderRows() {
    console.log("props.data: " + JSON.stringify(this.props));
    var tutor_list = []
    var len = this.props.data.length;
    console.log("len: " + len);
    for (var i = 0; i < len; i++) {
      var tutor = this.props.data[i];
      console.log("got tutor, info = " + JSON.stringify(this.props.data[i]['childKey']));
      tutor_list.push(tutor);
    }


    return(
      tutor_list.map((item) => {
        return <TableRow
          name={item.childData.name}
          subjects={item.childData.subjects}
          email={item.childData.email}
          uid = {item.childKey}
          allData={item}
        />
      }
      )
    );
  }

  render() {
    return (
      // const data = this.props();
      // const { data } = this.props;
      <table>
        <tbody>
        <tr>
          <th>Tutor</th>
          <th>Subject(s)</th>
          <th>Email</th>
          <th>Options</th>
        </tr>
        {this.renderRows()}
        </tbody>
      </table>
    );
  }
}

export default TutorTable;
