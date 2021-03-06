const signupPw = document.getElementById("signupPw");
const confPw = document.getElementById("confPw");
const signupEm = document.getElementById("signupEmail");
const signupBtn = document.getElementById("signupBtn");

const loginPw = document.getElementById("loginPw");
const loginEm = document.getElementById("loginEmail");
const loginBtn = document.getElementById("loginBtn");

const logoutBtn = document.getElementById("logoutBtn");

const navAcct = document.getElementById("navAcct");

let showError = document.getElementById("error-message");

let userName = document.getElementById("welcomeUser");
let beerFavList = document.getElementById("beerFavs")

// regex to validate if data is an email
const isEmail = email => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(regEx)) return true;
    else return false;
};

// confirms if fields are empty
const isEmpty = string => {
    if (string.trim() === "") return true;
    else return false;
};

// validates signup data
const validateSignUpData = data => {
    let errors = {};

    if (isEmpty(data.email)) {
        errors.email = "Must not be empty";
    } else if (!isEmail(data.email)) {
        errors.email = "Must be a valid email address";
    }

    if (isEmpty(data.password)) errors.password = "Must not be empty";
    if (data.password !== data.confirmPassword)
        errors.confirmPassword = "Passwords must match";

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    };
};

// validates login data
const validateLoginData = data => {
    let errors = {};

    if (isEmpty(data.email)) errors.email = "Must not be empty";
    if (isEmpty(data.password)) errors.password = "Must not be empty";

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    };
}

// watches login status
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {

        // let uid = user.uid
        // User is signed in.
        // show fav button
        let email = user.email

        let heartFav = document.getElementById("heartLike")

        heartFav.addEventListener("click", () => {
            addFavBeer(uid, beerName.value);
        })

        let uid = firebase.auth().currentUser.uid;

        let userData = db.ref(uid)
        let beerList = []
        beerFavList.innerHTML = ""
        userData.child(`fav-list`).orderByKey().on("child_added", function (snapshot) {
            // console.log(snapshot.key)
            let snap = snapshot.child(`favoriteBeer`).node_.value_;
            beerFavList.innerHTML += `<li>${snap}</li>`;


        });
        //beerFavList.innerHTML = beerList;

        // console.log(userData.value);

        userName.innerHTML = `Welcome back, ${email}!`

        // beerFavList.innerHTML = `List of Favorite Beers:\n$`

        showAcctInfo()
        showFavBtn()
        hideLogin()
        hideSignup()
        showLogout()

    } else {

        // hide fav button
        // User is signed out.
        // ..
        // console.log("user signed out");
        // refreshPage()
        hideAcctInfo()
        hideFavBtn()
        showLogin()
        showSignup()
    }
});

// sign up user on button click -> similar logic for login 
signupBtn.addEventListener("click", (req, res) => {
    let newUser = {
        email: signupEm.value,
        password: signupPw.value,
        confirmPassword: confPw.value
    }
    let validData = validateSignUpData(newUser)
    if (validData.valid === true) {
        // console.log("true")
        firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
        });
    }
    else console.log(validData + " false")
})


// login user
loginBtn.addEventListener("click", (req, res) => {
    function login() {

        let user = {
            email: loginEm.value,
            password: loginPw.value
        };
        // let validData = validateLoginData(user);
        // if (!validData) console.log("Something happened")
        // if (validData.valid === true) {
        // console.log("TRUE")
        firebase.auth().signInWithEmailAndPassword(user.email, user.password).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;

            // console.log(errorMessage)
            showErrorMsg()
            showError.innerHTML = `Error code: ${errorCode}. ${errorMessage}`;
            // ...
        });

        // return loggedIn;
        // }

    }
    login()

})

logoutBtn.addEventListener("click", (req, res) => {
    firebase
        .auth()
        .signOut()
        .then(() => {
        }).catch((err) => {

        })

    showLogin();
    showSignup();
    hideLogout();
    hideAcctInfo()
    refreshPage()
})

navAcct.addEventListener("click", () => {
    hideSearch()
    hideBeerResults()
    showAccount()
})


const addFavBeer = (uid, favBeer) => {
    let beerData = {
        favoriteBeer: favBeer
    }

    let newFavKey = db.ref().push().key;

    let updates = {};
    updates[`/${uid}/fav-list/${newFavKey}`] = beerData;

    return db.ref().update(updates);
}

// addFavBeer("ZSehxhvDs3M9JHIOV7WFwyxHTu92", "8th Wonder Love Street");