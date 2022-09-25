import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import {
  doc,
  setDoc,
  getFirestore,
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDxONouQSroJYzX_zqUVP4Ii4df7YYLDMo",
  authDomain: "profiletask-c57c0.firebaseapp.com",
  projectId: "profiletask-c57c0",
  storageBucket: "profiletask-c57c0.appspot.com",
  messagingSenderId: "814120153590",
  appId: "1:814120153590:web:f0f5452eefc7296d6297d7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const register = () => {
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const auth = getAuth();
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(async (userCredential) => {
      let uid = userCredential.user.uid;
      let firDoc = doc(db, "users", uid);
      await setDoc(firDoc, {
        name: name.value,
        email: email.value,
        password: password.value,
      });
    })
    .catch((error) => {
      const errorMessage = error.message;
      console.log(errorMessage);
    });
};

const btn = document.getElementById("register-btn");

btn.addEventListener("click", register);

const login = () => {
  const email = document.getElementById("l-email");
  const password = document.getElementById("l-password");
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      const user = userCredential.user;
      if (user){
        location.href = "./profile.html"
      }
    })
    .catch((error) => {
      const errorMessage = error.message;
      console.log(errorMessage);
    });
};

const loginBtn = document.getElementById("login-btn");

loginBtn.addEventListener("click", login);

window.onload = async () => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      if (!user.emailVerified) {
        sendEmailVerification(auth.currentUser)
          .then(() => {
            console.log("Email sent");
          })
          .catch((err) => console.log(err));
      }
      getUserFromDataBase(user.uid);
    } else {
      console.log("not login");
    }
  });
};

const getUserFromDataBase = async (uid) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
};