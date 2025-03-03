import { Router } from 'express';
import { registerUser, verifyUser, checkUserExists } from '../../models/account/index.js';
import { body, validationResult } from "express-validator";
import { requireAuth } from "../../utils/index.js";

const router = Router();
 


// Build an array of validation checks for the registration route
const registrationValidation = [
    body("email")
        .isEmail()
        .withMessage("Invalid email format."),
    body("password")
        .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
        .withMessage("Password must be at least 8 characters long, include one uppercase letter, one number, and one symbol.")
];

// GET /account/register
router.get('/register', async (req, res) => {
    res.locals.scripts.push("<script src='/js/registration.js'></script>");
    res.render('account/register', { title: 'Login' });
});

// POST /account/register
// Apply the validation checks to the registration route
router.post("/register", registrationValidation, async (req, res) => {
    // Check if there are any validation errors
    const results = validationResult(req);
    if (results.errors.length > 0) {
        results.errors.forEach((error) => {
            req.flash('error', error.msg);
        });
        res.redirect('/account/register');
        return;
    }
 
    const { email, password, confirm_password } = req.body;
    if (!email || !password || !confirm_password) {
        req.flash("error", "missing required fields.");
        res.redirect('/account/register');
    }

    const user = await checkUserExists(email);
    if (user) {
        req.flash("error", "User already exists.");
        res.redirect('/account/register');
    }

    if  (password !== confirm_password) {
        req.flash("error", "Passwords do not match.");
        res.redirect('/account/register');
    }

    else if (password === confirm_password){
        await registerUser(email, password);
        req.flash("success", "User registered successfully.");
        res.redirect('/account/login');
    }
})

// GET /account/login
router.get('/login', async (req, res) => {
    res.render('account/login', { title: 'Login' });
});

// POST /account/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        req.flash("error", "missing required fields.");
        res.redirect('/account/login');
    }
    const user = await checkUserExists(email);

    if (!user) {
        req.flash("error", "User does not exist.");
        res.redirect('/account/register');
    }
    else if (user) {
        req.flash("success", "User logged in successfully.");
        const verifiedUser = await verifyUser(email, password);
        
        if (!verifiedUser) {
            req.flash("error", "Invalid email or password.");
            res.redirect('/account/login');
        }

        delete verifiedUser.password;
        req.session.user = verifiedUser;

        res.redirect('/account/');
    } 
    else {
        res.redirect('/account/login');
    }
})

// GET /account
router.get('/', requireAuth, async (req, res) => {
    res.render('account/index', { title: 'Account' });
});

router.get('/logout', async (req, res) => {
    req.session.destroy();
    res.redirect('/account/login');
});



export default router;