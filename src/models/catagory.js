const addNewGame = async (name, description, classification_id, image_path = '') => {
    const db = await dbPromise;
    const sql = `
        INSERT INTO game (game_name, game_description, classification_id, image_path)
        VALUES (?, ?, ?, ?)
    `;
    return await db.run(sql, [name, description, classification_id, image_path]);
};

export {addNewGame};