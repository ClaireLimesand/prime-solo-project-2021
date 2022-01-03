const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {
    rejectUnauthenticated,
    } = require('../modules/authentication-middleware');


// GET for a user's friends

router.get('/', rejectUnauthenticated, (req, res) => {
    console.log('in GET friends server', req.user);
    
    const sqlQuery = `
        SELECT * FROM "friends"
        WHERE "user_id"=$1;
    `;
    const sqlValues = [req.user.id];
    pool.query(sqlQuery, sqlValues)
    .then((dbRes) => {
    res.send(dbRes.rows);
    })
    .catch((dbErr) => {
    res.sendStatus(500);
    })
});

// POST to add a new friend 

router.post('/', (req, res) => {
    console.log('in POST friends server', req.user);
    const newFriend = req.body;

    const sqlQuery = `
    INSERT INTO "friends" ("name", "user_id")
    VALUES ($1, $2)
`;
    const sqlValues = [
        newFriend.name,
        req.user.id
    ]
    pool.query(sqlQuery, sqlValues)
        .then((dbRes) => {
        res.sendStatus(201);
        })
        .catch((dbErr) => {
        console.error('POST friends error', dbErr);
        res.sendStatus(500);
        })
});

module.exports = router;
