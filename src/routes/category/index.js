import { Router } from 'express';
import { getGamesByClassification } from '../../models/index.js';
import { getClassifications } from '../../models/index.js';
import { addNewGame } from '../../models/catagory.js';
import { console } from 'inspector';



const router = Router();
 
// Game category route
router.get('/view/:id', async (req, res, next) => { //  <-- Notice we added the next parameter
    const games = await getGamesByClassification(req.params.id);
    const title = `${games[0]?.classification_name || ''} Games`.trim();
 
    // If no games are found, throw a 404 error
    if (games.length <= 0) {
        const title = 'Category Not Found';
        const error = new Error(title);
        error.title = title;
        error.status = 404;
        next(error); //  <-- Pass the error to the global error handler
        return;
    }
 
    res.render('category/index', { title, games });
});
 
// Add game route 
router.get('/add', async (req, res) => {
    const classifications = await getClassifications();
    res.render('category/add', { title: 'Add New Game', classifications });
});
 
// Add route to accept new game information
router.post('/add', async (req, res) => {
    const { game_name, game_description, classification_id } = req.body;
    await addNewGame(game_name, game_description, classification_id, '');
    res.redirect(`/category/view/${classification_id}`);
});

export default router;