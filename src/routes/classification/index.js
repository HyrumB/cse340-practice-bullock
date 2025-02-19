import { Router } from 'express';
import {addNewClassification, deleteClassification, getClassifications } from '../../models/index.js';

const router = Router();

// Add a GET route that renders the "Add Category" page with the category creation form.
router.get('/add', async (req, res) => {
    res.render('classification/add', { title: 'Add New classification type'});
});

// Add a POST route that processes form submissions and adds the new classification to the database.
router.post('/add', async (req, res) => {
    const { classification_name } = req.body;
    await addNewClassification(classification_name);
    res.redirect('/');
});


// Add a GET route that renders the "Add Category" page with the category creation form.
router.get('/delete', async (req, res) => {
    const classifications = await getClassifications();
    res.render('classification/delete', { title: 'Add New classification type', classifications});
});

// Add a POST route that processes form submissions and adds the new classification to the database.
router.post('/delete/:id', async (req, res) => {   
    const newClassification = req.body.new_category_id;
    const classification = req.params.id;

    await deleteClassification(classification, newClassification);
    res.redirect('/');
});

export default router;