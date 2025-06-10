const UserDAO = require("../data/user-dao").UserDAO;
const AllocationsDAO = require("../data/allocations-dao").AllocationsDAO;
const {
    environmentalScripts
} = require("../../config/config");

/* The SessionHandler must be constructed with a connected db */
function SessionHandler(db) {
    "use strict";

    const userDAO = new UserDAO(db);
    const allocationsDAO = new AllocationsDAO(db);

    const prepareUserData = (user, next) => {
        // Generate random allocations
        const stocks = Math.floor((Math.random() * 40) + 1);
        const funds = Math.floor((Math.random() * 40) + 1);
        const bonds = 100 - (stocks + funds);

        allocationsDAO.update(user._id, stocks, funds, bonds, (err) => {
            if (err) {
                console.error("Error in allocationsDAO:", err);
                return next(err);
            }
            next(null);
        });
    };

    // Error handler utility function
    const handleError = (err, req, res, template, data = {}) => {
        console.error("Error:", err);
        return res.render(template, {
            ...data,
            environmentalScripts,
            errorMessage: "An error occurred. Please try again."
        });
    };

    this.isAdminUserMiddleware = (req, res, next) => {
        if (req.session.userId) {
            return userDAO.getUserById(req.session.userId, (err, user) => {
               return user && user.isAdmin ? next() : res.redirect("/login");
            });
        }
        console.log("redirecting to login");
        return res.redirect("/login");

    };

    this.isLoggedInMiddleware = (req, res, next) => {
        if (req.session.userId) {
            return next();
        }
        console.log("redirecting to login");
        return res.redirect("/login");
    };

    this.displayLoginPage = (req, res, next) => {
        return res.render("login", {
            userName: "",
            password: "",
            loginError: "",
            environmentalScripts
        });
    };

    this.handleLoginRequest = (req, res, next) => {
        try {
            const { userName, password } = req.body;

            if (!userName || !password) {
                return res.render("login", {
                    userName: userName,
                    password: "",
                    loginError: "Please provide both username and password",
                    environmentalScripts
                });
            }

            userDAO.validateLogin(userName, password, (err, user) => {
                if (err) {
                    return handleError(err, req, res, "login", {
                        userName: userName,
                        password: "",
                        loginError: "Invalid username or password"
                    });
                }

                if (!user) {
                    return res.render("login", {
                        userName: userName,
                        password: "",
                        loginError: "Invalid username or password",
                        environmentalScripts
                    });
                }

                req.session.userId = user._id;
                return res.redirect(user.isAdmin ? "/benefits" : "/dashboard");
            });
        } catch (err) {
            return handleError(err, req, res, "login", {
                userName: req.body.userName || "",
                password: "",
                loginError: "An unexpected error occurred"
            });
        }
    };

    this.displayLogoutPage = (req, res) => {
        req.session.destroy(() => res.redirect("/"));
    };

    this.displaySignupPage = (req, res) => {
        res.render("signup", {
            userName: "",
            password: "",
            passwordError: "",
            email: "",
            userNameError: "",
            emailError: "",
            verifyError: "",
            environmentalScripts
        });
    };

    const validateSignup = (userName, firstName, lastName, password, verify, email, errors) => {

        const USER_RE = /^.{1,20}$/;
        const FNAME_RE = /^.{1,100}$/;
        const LNAME_RE = /^.{1,100}$/;
        const EMAIL_RE = /^[\S]+@[\S]+\.[\S]+$/;
        const PASS_RE = /^.{1,20}$/;
        /*
        //Fix for A2-2 - Broken Authentication -  requires stronger password
        //(at least 8 characters with numbers and both lowercase and uppercase letters.)
        const PASS_RE =/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        */

        errors.userNameError = "";
        errors.firstNameError = "";
        errors.lastNameError = "";

        errors.passwordError = "";
        errors.verifyError = "";
        errors.emailError = "";

        if (!USER_RE.test(userName)) {
            errors.userNameError = "Invalid user name.";
            return false;
        }
        if (!FNAME_RE.test(firstName)) {
            errors.firstNameError = "Invalid first name.";
            return false;
        }
        if (!LNAME_RE.test(lastName)) {
            errors.lastNameError = "Invalid last name.";
            return false;
        }
        if (!PASS_RE.test(password)) {
            errors.passwordError = "Password must be 8 to 18 characters" +
                " including numbers, lowercase and uppercase letters.";
            return false;
        }
        if (password !== verify) {
            errors.verifyError = "Password must match";
            return false;
        }
        if (email !== "") {
            if (!EMAIL_RE.test(email)) {
                errors.emailError = "Invalid email address";
                return false;
            }
        }
        return true;
    };

    this.handleSignup = (req, res, next) => {
        try {
            const { userName, firstName, lastName, password, verify } = req.body;

            // Check for required fields
            if (!userName || !firstName || !lastName || !password || !verify) {
                return res.render("signup", {
                    userName,
                    firstName,
                    lastName,
                    password,
                    verify,
                    errorMessage: "All fields are required",
                    environmentalScripts
                });
            }

            // Check if passwords match
            if (password !== verify) {
                return res.render("signup", {
                    userName,
                    firstName,
                    lastName,
                    password,
                    verify,
                    errorMessage: "Passwords do not match",
                    environmentalScripts
                });
            }

            userDAO.getUserByUserName(userName, (err, existingUser) => {
                if (err) {
                    return handleError(err, req, res, "signup", {
                        userName,
                        firstName,
                        lastName,
                        password,
                        verify
                    });
                }

                if (existingUser) {
                    return res.render("signup", {
                        userName,
                        firstName,
                        lastName,
                        password,
                        verify,
                        errorMessage: "Username already in use",
                        environmentalScripts
                    });
                }

                userDAO.addUser(userName, firstName, lastName, password, (err, user) => {
                    if (err) {
                        return handleError(err, req, res, "signup", {
                            userName,
                            firstName,
                            lastName,
                            password,
                            verify
                        });
                    }

                    prepareUserData(user, (err) => {
                        if (err) {
                            return handleError(err, req, res, "signup", {
                                userName,
                                firstName,
                                lastName,
                                password,
                                verify
                            });
                        }

                        req.session.userId = user._id;
                        return res.redirect("/dashboard");
                    });
                });
            });
        } catch (err) {
            return handleError(err, req, res, "signup", {
                userName: req.body.userName || "",
                firstName: req.body.firstName || "",
                lastName: req.body.lastName || "",
                password: "",
                verify: "",
                errorMessage: "An unexpected error occurred"
            });
        }
    };

    this.displayWelcomePage = (req, res, next) => {
        let userId;

        if (!req.session.userId) {
            console.log("welcome: Unable to identify user...redirecting to login");
            return res.redirect("/login");
        }

        userId = req.session.userId;

        userDAO.getUserById(userId, (err, doc) => {
            if (err) return next(err);
            doc.userId = userId;
            return res.render("dashboard", {
                ...doc,
                environmentalScripts
            });
        });
    };
}

module.exports = SessionHandler;
