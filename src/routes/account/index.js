import { Router } from 'express';
import { registerUser, verifyUser, checkUserExists } from '../../models/account/index.js';

const router = Router();

// GET /account/register
router.get('/register', async (req, res) => {
    res.render('account/register', { title: 'Login' });
});

// POST /account/register

router.post('/register', async (req, res) => {
    const { email, password, confirm_password } = req.body;
    console.log(req.body);
    if (!email || !password || !confirm_password) {
        res.redirect('/account/register');
        console.log(email, password, confirm_password);
    }

    const user = await checkUserExists(email);
    if (user) {
        console.log('User already exists');
        res.redirect('/account/register');
    }

    if  (password !== confirm_password) {
        console.log('Passwords do not match');
        res.redirect('/account/register');
    }
    else if (password === confirm_password){
        console.log('Passwords match');
        await registerUser(email, password);
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
        res.redirect('/account/login');
    }
    checkUserExists(email); 

    const user = await checkUserExists(email);

    if (!user) {
        console.log('User doesnt exists');
        res.redirect('/account/register');
    }
    else if (user) {
        res.redirect('/account/');
    } 
    else {
        res.redirect('/account/login');
    }
})

// GET /account
router.get('/', async (req, res) => {
    res.render('account/index', { title: 'Account' });
});




export default router;