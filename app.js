const express = require('express')
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const app = express()
app.use(express.json())

const dbPath = path.join(__dirname, 'cricketTeam.db')
let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

initializeDBAndServer()

app.get('/players/', async (request, response) => {
  const getPlayerQuery = `
    SELECT
      *
    FROM
      cricket_team
    ORDER BY 
      player_id;`
  const players = await db.all(getPlayerQuery)
  response.send(players)
})

app.post('/players/', async (request, response) => {
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  const addplayerQuery = `
    INSERT INTO
      cricket_team (player_name,jersey_number,role)
    VALUES
      (
       '${'Vishal'}',
       '${17}',
       '${'Bowler'}'
      );`

  const dbResponse = await db.run(addplayerQuery)
  const playerId = dbResponse.lastID
  response.send('Player added to team')
})

app.get('/players/:playerId', async (request, response) => {
  const {playerId} = request.params
  const getplayerQuery = `
    SELECT
      *
    FROM
      cricket_team
    WHERE 
      player_id=${playerId}
    ;`
  const player = await db.all(getplayerQuery)
  response.send(player)
})

app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  const updateplayerQuery = `
    UPDATE
      cricket_team
    SET
      player_name='${'Maneesh'}',
      jersey_number='${54}',
      role='${'All-rounder'}'
    WHERE
      player_id = ${playerId};`
  await db.run(updateplayerQuery)
  response.send('Player Details Updated')
})

app.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const deleteplayerQuery = `
    DELETE FROM
      cricket_team
    WHERE
     player_id = ${playerId};`
  await db.run(deleteplayerQuery)
  response.send('Player Removed')
})
