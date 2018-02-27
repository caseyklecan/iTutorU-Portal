import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyBsjlF4FNxju6ise_-PRyyD2ZhPVwyoev4",
    authDomain: "itutoru-ef7e2.firebaseapp.com",
    databaseURL: "https://itutoru-ef7e2.firebaseio.com",
    projectId: "itutoru-ef7e2",
    storageBucket: "itutoru-ef7e2.appspot.com",
    messagingSenderId: "115499384435"
};

export function initialize() {
    firebase.initializeApp(config);
    return new Promise((resolve, reject) => {
      signIn("testing@test.com", "password").then(res => {
        resolve(true);
      }
    );
    })


}

export function approveTutor(uid) {
  //write to database and set frozen to be false
  var updates = {};
  updates['tutors/' + uid + '/frozen'] = false;
  firebase.database().ref().update(updates);
}

export function getStudentsOfTutor(uid) {
  var students = [];
  return new Promise((resolve, reject) => {
    firebase.database().ref('tutors/' + uid + '/students/').once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          var studentName = childSnapshot.val();
          students.push(studentName);
        });
        resolve(students);
    }).catch((error) => {reject(error);});
  });
}


export function returnPendingTutors() {
  return new Promise((resolve, reject) => {
    firebase.database().ref('tutors/').once('value').then(function(snapshot) {
      var tutor_list = [];
      snapshot.forEach(function(childSnapshot) {
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();
        if (childData.frozen == true) {
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

export function returnStudentData() {
  return new Promise((resolve, reject) => {
    firebase.database().ref('students/').once('value').then(function(snapshot) {
      var student_list = [];
      snapshot.forEach(function(childSnapshot) {
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();
        student_list.push(childData);
      });
      resolve(student_list);
      //resolve(snapshot.val());
    }).catch((error) => {
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
