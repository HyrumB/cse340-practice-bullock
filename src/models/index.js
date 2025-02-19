import dbPromise from "../database/index.js";
import path from "path";
import fs from "fs";

const addNewGame = async (
  name,
  description,
  classification_id,
  image_path = ""
) => {
  const db = await dbPromise;
  const sql = `
        INSERT INTO game (game_name, game_description, classification_id, image_path)
        VALUES (?, ?, ?, ?)
    `;
  return await db.run(sql, [name, description, classification_id, image_path]);
};

const getClassifications = async () => {
  const db = await dbPromise;
  return await db.all("SELECT * FROM classification");
};

const getGamesByClassification = async (classificationId) => {
  const db = await dbPromise;
  const query = `
        SELECT game.*, classification.classification_name 
        FROM game 
        JOIN classification ON game.classification_id = classification.classification_id
        WHERE game.classification_id = ?;
    `;
  return await db.all(query, [classificationId]);
};

const getGameById = async (gameId) => {
  const db = await dbPromise;
  const query = `
        SELECT game.*, classification.classification_name 
        FROM game 
        JOIN classification ON game.classification_id = classification.classification_id
        WHERE game.game_id = ?;
    `;
  return await db.get(query, [gameId]);
};

async function updateGame(
  gameId,
  name,
  description,
  classificationId,
  imagePath = ""
) {
  const db = await dbPromise;

  // If no image was uploaded, update basic game info
  if (imagePath === "") {
    const sql = `
            UPDATE game 
            SET game_name = ?, 
                game_description = ?, 
                classification_id = ?
            WHERE game_id = ?
        `;
    return await db.run(sql, [name, description, classificationId, gameId]);
  }

  // If image was uploaded, update all info including image
  const sql = `
        UPDATE game 
        SET game_name = ?, 
            game_description = ?, 
            classification_id = ?,
            image_path = ?
        WHERE game_id = ?
    `;
  return await db.run(sql, [
    name,
    description,
    classificationId,
    imagePath,
    gameId,
  ]);
}

async function deleteGame(gameId) {
  const db = await dbPromise;

  // get the image path from the database
  const game = await db.get("SELECT image_path FROM game WHERE game_id = ?", [
    gameId,
  ]);

  // checks if the image exists and deletes the image file from the server
  if (game.image_path) {
    const imagePath = 
      path.join(process.cwd(), `public${game.image_path}`) || '';
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error(err);
      }
    
    });
  }

  // deletes the game from the database
  const sql = "DELETE FROM game WHERE game_id = ?";
  return await db.run(sql, [gameId]);
}

async function addNewClassification(classification_name) {
  // Does nothing if the classification name is empty.
  if (!classification_name) {
    console.log("Classification name is empty.");
    return;
  }

  const db = await dbPromise;

  const classification = await db.get(
    "SELECT * FROM classification WHERE classification_name = ?",
    [classification_name]
  );

  // Checks if the classification already exists before inserting.
  if (classification) {
    console.log("Classification already exists.");
    return;
  } else {
    // Inserts the new classification into the database.
    const sql = `
            INSERT INTO classification (classification_name)
            VALUES (?)
        `;
    return await db.run(sql, [classification_name]);
  }
}

async function movegame(gameId, newClassificationId) {
  const db = await dbPromise;
  const sql = `
        UPDATE game 
        SET classification_id = ? 
        WHERE game_id = ?
    `;
  return await db.run(sql, [newClassificationId, gameId]);
}

async function deleteClassification(classificationId, newClassificationId) {
  if (!classificationId || classificationId == newClassificationId) {
    return;
  }
  const db = await dbPromise;

  // If the new classification is not "Do Not Move, Delete Games", move the games to the new classification
  if (newClassificationId != "delete") {
    const games = await getGamesByClassification(classificationId);
    // loop through and moves the games to the new classification
    for (let i = 0; i < games.length; i++) {
      await movegame(games[i].game_id, newClassificationId);
    }
  } else {
    // If the new classification is "Do Not Move, Delete Games", delete the games
    const games = await getGamesByClassification(classificationId);
    // loop through and delete the games
    for (let i = 0; i < games.length; i++) {
      await deleteGame(games[i].game_id);
    }
  }
  const sql = "DELETE FROM classification WHERE classification_id = ?";
  return await db.run(sql, [classificationId]);
}

export {
  addNewGame,
  getClassifications,
  getGamesByClassification,
  getGameById,
  updateGame,
  deleteGame,
  addNewClassification,
  movegame,
  deleteClassification,
};
