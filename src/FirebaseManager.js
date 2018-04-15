import firebase from 'firebase';
/*
const config = {
    apiKey: "AIzaSyBsjlF4FNxju6ise_-PRyyD2ZhPVwyoev4",
    authDomain: "itutoru-ef7e2.firebaseapp.com",
    databaseURL: "https://itutoru-ef7e2.firebaseio.com",
    projectId: "itutoru-ef7e2",
    storageBucket: "itutoru-ef7e2.appspot.com",
    messagingSenderId: "115499384435"
};
*/

const config = {
  apiKey: "AIzaSyBsjlF4FNxju6ise_-PRyyD2ZhPVwyoev4",
    authDomain: "itutoru-ef7e2.firebaseapp.com",
    databaseURL: "https://itutoru-ef7e2.firebaseio.com",
    projectId: "itutoru-ef7e2",
    storageBucket: "itutoru-ef7e2.appspot.com",
    messagingSenderId: "115499384435"
}

export function approveTutor(uid) {
  //write to database and set frozen to be false
  var updates = {};
  updates['tutors/' + uid + '/frozen'] = false;
  firebase.database().ref().update(updates);
}

export function rejectTutor(uid) {
  //deleteFromFirebase("tutors", uid);
  var updates = {};
  updates['tutors/' + uid + '/rejected'] = true;
  firebase.database().ref().update(updates);
}

export function getStudentsOfTutor(uid) {
  var students = [];
  return new Promise((resolve, reject) => {
    firebase.database().ref('tutors/' + uid + '/students/').once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          var studentID = childSnapshot.val();
          students.push(studentID);
        });
        console.log(students);
        resolve(students);
    }).catch((error) => {reject(error);});
  });
}

export function updateSubjects(id, subjects) {
  if (subjects.length > 0) {
    firebase.database().ref('students/' + id).update({
      subjects: subjects,
    });
  }
}

export function updateAllSubjects(subjects) {
  firebase.database().ref().update({
    subjects: subjects,
  })
}


export function returnPendingTutors() {
  return new Promise((resolve, reject) => {
    firebase.database().ref('tutors/').once('value').then(function(snapshot) {
      var tutor_list = [];
      snapshot.forEach(function(childSnapshot) {
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();
        if (childData.frozen === true) {
          tutor_list.push({childData, childKey});
        }

      });
      resolve(tutor_list);
      //resolve(snapshot.val());
    }).catch((error) => {
      reject(error);
    });
  })
}

export function returnUnregisteredStudents() {
  var info_list = [];
  return new Promise((resolve, reject) => {
    firebase.database().ref('parents/').once('value').then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var parentKey = childSnapshot.key;
        getStudentsOfParent(parentKey).then(function(res) {
          if (res != null) {
            console.log(res);
            res.forEach(function(child) {
              //console.log("CHILD: ");
              console.log(child);
              returnStudent(child).then(function(studentInfo) {
                console.log(studentInfo.val());
                if (studentInfo.val() != null) {
                  //console.log(studentInfo.val());
                  if (!studentInfo.val().registered) {
                    //console.log(childSnapshot.val());
                    var info = {studentID: child,
                      email: childSnapshot.val().email,
                      parentName: childSnapshot.val().parentName,
                      studentName: studentInfo.val().studentName,
                      phone: childSnapshot.val().phoneNumber,
                      address: studentInfo.val().address,
                      subjects: studentInfo.val().subject,
                      grade: studentInfo.val().grade,
                      otherInfo: studentInfo.val().otherInfo,
                    }
                    //console.log("info:");
                    //console.log(info);
                    info_list.push(info);
                  }
                }

              })
            });
          }


        })
      });
      resolve(info_list);
    }).catch((error) => {
      reject(error);
    })
  })
  //go through all parents
  //look at children of all parents
  //if registered = false, return them
}

export function registerStudent(studentID) {
  console.log("studentID: " + studentID);
  firebase.database().ref('students/' + studentID).update({
        registered: true,
  });
}

export function getStudentsOfParent(parentID) {
  return new Promise((resolve, reject) => {
    firebase.database().ref('parents/' + parentID + "/students").once('value').then(function(snapshot) {
      resolve(snapshot.val());
    })
  })
}

export function returnTutorData() {
    return new Promise((resolve, reject) => {
      firebase.database().ref('tutors/').once('value').then(function(snapshot) {
        var tutor_list = [];
        snapshot.forEach(function(childSnapshot) {
          var childKey = childSnapshot.key;
          var childData = childSnapshot.val();
          tutor_list.push({childData, childKey});
        });
        resolve(tutor_list);
        //resolve(snapshot.val());
      }).catch((error) => {
        reject(error);
      });
    })

}

export function updateCheckboxes(uid, checkboxes) {
  console.log(uid);
  console.log(checkboxes);
  firebase.database().ref('tutors/' + uid).update({
        checkboxes: checkboxes,
  });
}

export function returnStudentData() {
  return new Promise((resolve, reject) => {
    firebase.database().ref('students/').once('value').then(function(snapshot) {
      var student_list = [];
      snapshot.forEach(function(childSnapshot) {
        var key = childSnapshot.key;
        var data = childSnapshot.val();
        student_list.push({data, key});
      });
      resolve(student_list);
      //resolve(snapshot.val());
    }).catch((error) => {
      reject(error);
    });
  })
}

export function returnStudentAndKey(uid) {
  return new Promise((resolve, reject) => {
    firebase.database().ref('students/' + uid).once('value').then(function(snapshot) {
          console.log("return student snapshot: " + JSON.stringify(snapshot));
          resolve({student: snapshot.val(), key: uid});
        }
    ).catch((error) => {
      reject(error);
    });
  });
}

export function returnTutorAndKey(uid) {
  console.log("uid: " + uid);
  return new Promise((resolve, reject) => {
    firebase.database().ref('tutors/' + uid).once('value').then(function(snapshot) {

          resolve({tutor: snapshot.val(), key: uid});
        }
    ).catch((error) => {
      reject(error);
    });
  })
}

export function returnTutor(uid) {
  console.log("uid: " + uid);
  return new Promise((resolve, reject) => {
    firebase.database().ref('tutors/' + uid).once('value').then(function(snapshot) {

          resolve(snapshot);
        }
    ).catch((error) => {
      reject(error);
    });
  })
}

export function returnStudent(uid) {
  return new Promise((resolve, reject) => {
    firebase.database().ref('students/' + uid).once('value').then(function(snapshot) {
          console.log("return student snapshot: " + JSON.stringify(snapshot));
          resolve(snapshot);
        }
    ).catch((error) => {
      reject(error);
    });
  });
}

function signIn(email, password) {
    return new Promise((resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                resolve(true);
            })
            .catch((error) => {
                resolve(error.message);
            });
    })

}

export function isSignedIn() {
  firebase.initializeApp(config);
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user != null) {
        console.log("IS SIGNED IN");
        resolve(true);
      }
      else {
        console.log("IS NOT SIGNED IN");
        reject(null);
      }
    })
  })
}

export function unFreezeTutor(user) {
  firebase.database().ref('tutors/' + user).update({
        frozen: false,
  });
}

export function unFreezeStudent(user) {
  firebase.database().ref('students/' + user).update({
        frozen: false,
  });
}

export function checkLoginCredentials(email, password) {
  //firebase.initializeApp(config);
  return new Promise((resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((user) => {
              resolve(user);
            })
            .catch((error) => {
              reject(error.message);
            });
    })
}

export function getLoggedInUserPromise() {
    return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                resolve(user);
            } else {
                // No user is signed in.
                reject(null);
            }
        });
    })
}

export function userType(uid) {
    return new Promise((resolve, reject) => {
        var ref = firebase.database().ref('admin');
        ref.once("value").then(snapshot => {
            console.log("came back from the ref");
            if (snapshot.child(uid + "").exists()) {
                console.log("child exists");
                resolve('admin');
                // ref.off();
            }
            else {
                resolve('non-admin');
            }
        });
    })
}

export function returnPairData() {
  //returns a JSON object of {{name: fjlsdjf age: 5}, {name: tutor}}
  return new Promise((resolve, reject) => {
    var toReturn =
      []

      firebase.database().ref('students/').once('value').then(function(snapshot) {
        var arrayOfStudents = snapshot.val();
        console.log("STUDENTS ARRAY");
        console.log(arrayOfStudents);
        for (var key in arrayOfStudents) {
          console.log(key);
          returnStudentAndKey(key).then(function(res) {
            var tutorID = res.student.tutor;
            var studentID = res.key;
            var studentInfo = res.student;
            returnTutorAndKey(tutorID).then(function(res2){
              var tutorID = res2.key;
              var tutorInfo = res2.tutor;
              toReturn.push({ tutor: tutorInfo, student: studentInfo, studentID: studentID, tutorID: tutorID });
              if (toReturn.length === Object.keys(arrayOfStudents).length) {
                resolve(toReturn);
              }
            });
          });
        }
      });




  });
}

export function returnSubjects() {
  return new Promise((resolve, reject) => {
    firebase.database().ref('subjects/').once('value').then(function(snapshot) {
      resolve(snapshot.val());
    });
  });



}

export function deleteFromFirebase(type, ID) {

  var ref = firebase.database().ref(type + '/');
  console.log(ref);
  ref.update({
    [ID]: null,
  });
/*
  firebase.database().ref(type + '/' + ID).once('value').then(function(snapshot) {
    snapshot.remove();
  });
  */
}

export function updateStudent(updatedInfo) {
  firebase.database().ref('students/' + updatedInfo.ID).update({
    studentName: updatedInfo.name,
    grade: updatedInfo.grade,
    address: updatedInfo.city,
    paidSessions: updatedInfo.paidSessions,
  });
}

export function updateTutor(updatedInfo) {
  firebase.database().ref('tutors/' + updatedInfo.ID).update({
    name: updatedInfo.name,
    city: updatedInfo.city,
    degree: updatedInfo.degree,
    phone: updatedInfo.phone,
  });
}

export function getMessage(messageID) {
  return new Promise((resolve, reject) => {
    firebase.database().ref('messages/' + messageID).once('value').then(function(snapshot) {
      console.log(snapshot.val());
        resolve({from: snapshot.val().from, text: snapshot.val().message, time: snapshot.val().timestamp});
    }).catch((error) => {reject(error);});

  });
}

export function getConversation(studentID, tutorID) {
  var convoID = '';
  var arr = [studentID, tutorID];
  arr.sort();
  convoID = '' + arr[0] + arr[1];
  console.log(convoID);
  return new Promise((resolve, reject) => {
    firebase.database().ref('conversations/' + convoID).once('value').then(function(snapshot) {
        resolve(snapshot.val());
    }).catch((error) => {reject(error);});

  });
}

//Learning Plan
export function addCard(studentuid, cardItem, index) {
    firebase.database().ref('students/' + studentuid + "/learningPlan").update({
        [index] : cardItem,
    })
}

export function onUpdateTasks(studentuid, cardIndex, tasks) {
    firebase.database().ref('students/' + studentuid + '/learningPlan').update({
        [cardIndex + '/list'] : tasks,
    });
}

export function onCardMarkComplete(studentuid, cardIndex) {
    firebase.database().ref('students/' + studentuid + '/learningPlan').update({
        [cardIndex + '/complete'] : true,
    })
}

export function onChangeTitle(studentuid, cardIndex, title) {
    firebase.database().ref('students/' + studentuid + '/learningPlan').update({
        [cardIndex + '/title'] : title,
    })
}

export function setLP(studentuid, lp) {
  console.log("now going to firebase");
  console.log(lp);
  firebase.database().ref('students/' + studentuid).update({
    learningPlan : lp,
  }).then(console.log("done"));
  console.log("done 2");

}

// export function getLP(studentuid) {
//   return new Promise((resolve, reject) => {
//     firebase.database().ref('students/' + studentuid + '/learningPlan').once('value', function(snapshot) {
//         resolve(snapshot.val());
//     });
//   })
// }
