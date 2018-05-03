import firebase from 'firebase';

const config = {
  apiKey: "AIzaSyBsjlF4FNxju6ise_-PRyyD2ZhPVwyoev4",
    authDomain: "itutoru-ef7e2.firebaseapp.com",
    databaseURL: "https://itutoru-ef7e2.firebaseio.com",
    projectId: "itutoru-ef7e2",
    storageBucket: "itutoru-ef7e2.appspot.com",
    messagingSenderId: "115499384435"
}

/* ============================ ADMIN SIGN IN FUNCTIONS ============================ */

/* returns true if a user is signed in. Called in componentWillMount() of App.js */
export function isSignedIn() {
  if (firebase.apps.length == 0) firebase.initializeApp(config);
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user != null) {
        resolve(true);
      }
      else {
        reject(null);
      }
    })
  })
}

/* returns the signed in user if the email and password are correct. Called in onClickLogin()  of App.js */
export function checkLoginCredentials(email, password) {
  return new Promise((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(email, password).then((user) => {
        resolve(user);
      }).catch((error) => {
        reject(error.message);
    });
  })
}

/* determines if the uid is an admin user or tutor/student. Called in onClickLogin() of App.js */
export function userType(uid) {
    return new Promise((resolve, reject) => {
        var ref = firebase.database().ref('admin');
        ref.once("value").then(snapshot => {
            console.log("came back from the ref");
            if (snapshot.child(uid + "").exists()) {
                console.log("child exists");
                resolve('admin');
            }
            else {
                resolve('non-admin');
            }
        });
    })
}

/* ================================================================================================== */

/* =========================== DATA RETRIEVAL FUNCTIONS ========================== */

/* returns an array of tutors who are not yet cleared to tutor. This list is rendered in the "pending tutors" table */
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
    }).catch((error) => {
      reject(error);
    });
  })
}

/* returns an array of new students. This array is rendered in the "New Students" table.*/
export function returnUnregisteredStudents() {
  var info_list = [];
  return new Promise((resolve, reject) => {
    firebase.database().ref('parents/').once('value').then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var parentKey = childSnapshot.key;
        getStudentsOfParent(parentKey).then(function(res) {
          if (res != null) {
            res.forEach(function(child) {
              returnStudent(child).then(function(studentInfo) {
                if (studentInfo.val() != null) {
                  if (!studentInfo.val().registered) {
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
}

/* helper function for getUnregisteredStudents */
export function getStudentsOfParent(parentID) {
  return new Promise((resolve, reject) => {
    firebase.database().ref('parents/' + parentID + "/students").once('value').then(function(snapshot) {
      resolve(snapshot.val());
    })
  })
}

/* returns array of all tutors currently in the database. Used in the "active tutors" table. */
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
      }).catch((error) => {
        reject(error);
    });
  })
}

/* returns all students currently in the database. Used in "active students" table */
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
    }).catch((error) => {
      reject(error);
    });
  })
}

/* returns array of student ids assigned to tutor with id "uid". Used in TableRow to show information about each tutor. */
export function getStudentsOfTutor(uid) {
  var students = [];
  return new Promise((resolve, reject) => {
    firebase.database().ref('tutors/' + uid + '/students/').once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          var studentID = childSnapshot.val();
          students.push(studentID);
        });
        resolve(students);
    }).catch((error) => {reject(error);});
  });
}

/* returns tutor given uid */
export function returnTutor(uid) {
  return new Promise((resolve, reject) => {
    firebase.database().ref('tutors/' + uid).once('value').then(function(snapshot) {
          resolve(snapshot);
        }).catch((error) => {
      reject(error);
    });
  })
}

/* returns student given uid */
export function returnStudent(uid) {
  console.log("uid: " + uid);
  return new Promise((resolve, reject) => {
    firebase.database().ref('students/' + uid).once('value').then(function(snapshot) {
          resolve(snapshot);
        }).catch((error) => {
      reject(error);
    });
  });
}

/* returns array of JSON objects holding information about a tutor-student pair. Called in loadData() of App.js */
export function returnPairData() {
  return new Promise((resolve, reject) => {
    var toReturn = []
      firebase.database().ref('students/').once('value').then(function(snapshot) {
        var arrayOfStudents = snapshot.val();
        for (var key in arrayOfStudents) {
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

/* helper function for returnPairData */
export function returnStudentAndKey(uid) {
  return new Promise((resolve, reject) => {
    firebase.database().ref('students/' + uid).once('value').then(function(snapshot) {
          resolve({student: snapshot.val(), key: uid});
        }).catch((error) => {
      reject(error);
    });
  });
}

/* helper function for returnPairData */
export function returnTutorAndKey(uid) {
  console.log("uid: " + uid);
  return new Promise((resolve, reject) => {
    firebase.database().ref('tutors/' + uid).once('value').then(function(snapshot) {
          resolve({tutor: snapshot.val(), key: uid});
        }).catch((error) => {
      reject(error);
    });
  })
}

/* returns information about a message given messageID */
export function getMessage(messageID) {
  return new Promise((resolve, reject) => {
    firebase.database().ref('messages/' + messageID).once('value').then(function(snapshot) {
        resolve({from: snapshot.val().from, text: snapshot.val().message, time: snapshot.val().timestamp});
    }).catch((error) => {reject(error);});
  });
}

/* returns a conversation given the IDs of the users. Used in MessagesPopup. */
export function getConversation(studentID, tutorID) {
  var convoID = '';
  var arr = [studentID, tutorID];
  arr.sort();
  convoID = '' + arr[0] + arr[1];
  return new Promise((resolve, reject) => {
    firebase.database().ref('conversations/' + convoID).once('value').then(function(snapshot) {
        resolve(snapshot.val());
    }).catch((error) => {reject(error);});
  });
}

/* returns list of subjects in the database. This list is rendered in the Settings Popup. */
export function returnSubjects() {
  return new Promise((resolve, reject) => {
    firebase.database().ref('subjects/').once('value').then(function(snapshot) {
      resolve(snapshot.val());
    });
  });
}

/* =============================================================================================== */

/* =========================== pending tutors functions ==============================*/

/* called when "Approve" is pressed in Pending Tutors */
export function approveTutor(uid) {
  var updates = {};
  updates['tutors/' + uid + '/frozen'] = false;
  firebase.database().ref().update(updates);
}

/* called when "Reject" is pressed in Pending Tutors */
export function rejectTutor(uid) {
  var updates = {};
  updates['tutors/' + uid + '/rejected'] = true;
  firebase.database().ref().update(updates);
}

/* =============================================================================================== */

/* ================================ modifying student info =========================== */

/* modifies a student's list of subjects */
export function updateSubjects(id, subjects) {
  if (subjects.length > 0) {
    firebase.database().ref('students/' + id).update({
      subjects: subjects,
    });
  }
}

/* moves a student from "new students" table to "active students" table */
export function registerStudent(studentID) {
  console.log("studentID: " + studentID);
  firebase.database().ref('students/' + studentID).update({
        registered: true,
  });
}

/* called after admin user is done editing student info */
export function updateStudent(updatedInfo) {
  firebase.database().ref('students/' + updatedInfo.ID).update({
    studentName: updatedInfo.name,
    grade: updatedInfo.grade,
    address: updatedInfo.city,
    paidSessions: updatedInfo.paidSessions,
  });
}

        /* ==================== Learning Plan modification functions ======================= */

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
          console.log(lp);
          firebase.database().ref('students/' + studentuid).update({
            learningPlan : lp,
          })
        }

        export function updateLPNotes(ID, officeNotes) {
          firebase.database().ref('students/' + ID).update({
            officeNotes: officeNotes,
          });
        }

        /* ================================================================= */

/* ======================================================================================== */

/* ========================= modifying tutor info ========================= */

/* updates hiring checklist for pending tutors */
export function updateCheckboxes(uid, checkboxes) {
  console.log(uid);
  console.log(checkboxes);
  firebase.database().ref('tutors/' + uid).update({
        checkboxes: checkboxes,
  });
}

/* called when admin user is done editing tutor information */
export function updateTutor(updatedInfo) {
  firebase.database().ref('tutors/' + updatedInfo.ID).update({
    name: updatedInfo.name,
    city: updatedInfo.city,
    degree: updatedInfo.degree,
    phone: updatedInfo.phone,
  });
}

/* =========================================================================== */

/* ====================== MISC ======================= */

/* updates list of subjects. called when admin user adds or removes subjects in the settings popup */
export function updateAllSubjects(subjects) {
  firebase.database().ref().update({
    subjects: subjects,
  })
}

/* deletes a user and all their information from the database */
export function deleteFromFirebase(type, ID) {

  var ref = firebase.database().ref(type + '/');
  console.log(ref);
  ref.update({
    [ID]: null,
  });
}

/*
export function unFreezeStudent(user) {
  firebase.database().ref('students/' + user).update({
        frozen: false,
  });
}
*/

/*
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
*/
