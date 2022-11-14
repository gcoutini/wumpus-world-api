const createElement = require('./helpers/createElement');
const { loadJSON, saveJSON } = require('./helpers/handleJSON');

const getPosition = () => {
  const { coordinates:  { position, direction = 'right' } } = loadJSON('hero');
  return { position, direction };
}

const parseArr = arr => `[${arr.toString()}]`;

const nextMove = {
  position: [],
  possibleCost: 0
}

const execute = {
  turn: () => null,
  walk: (coordinates) => handleWalk(coordinates),
  catch: () => null,
  shoot: () => null,
}

const sensors = {
  smell: false,
  breeze: false,
  gold: false,
  wall: false,
  deadWumpus: false
}

let message, action, score = 0;

const checkWall = coordinates => {
  if ((coordinates.direction === 'right' && coordinates.position[0] === 4) ||
  (coordinates.direction === 'left' && coordinates.position[0] === 1) ||
  (coordinates.direction === 'up' && coordinates.position[1] === 4) ||
  (coordinates.direction === 'down' && coordinates.position[1] === 1)) {
  sensors.wall = true;
  return true;
  }
  return false;
}

const handleWalk = coordinates => {
  const newPosition = [];
  const invalidMovement = checkWall(coordinates);

  if (invalidMovement) {
    message = 'Parede à frente! Movimento inválido!';
    return coordinates;
  }
  const move = {
    right: () => newPosition.push(coordinates.position[0] + 1, coordinates.position[1]),
    left: () => newPosition.push(coordinates.position[0] - 1, coordinates.position[1]),
    up: () => newPosition.push(coordinates.position[0], coordinates.position[1] + 1),
    down: () => newPosition.push(coordinates.position[0], coordinates.position[1] - 1)
  }

  move[coordinates.direction]();
  const newCoordinates = {
    position: newPosition,
    direction: coordinates.direction
  };
  const fellInPit = newCoordinates.position.every((coordinate, index) => coordinate === pitPosition[index]);
  const ateByWumpus = newCoordinates.position.every((coordinate, index) => coordinate === wumpusPosition[index]);
  if (fellInPit) message = 'Você caiu em um poço!';
  if (ateByWumpus) message = 'Você foi devorado pelo Wumpus!';
  checkWall(newCoordinates);
  const { wumpus: { position: wumpusPosition, sensorTiles: smellyTiles }, 
          pit: { position: pitPosition, sensorTiles: breezeTiles } } = loadJSON('elements');
  const smellyTile = smellyTiles.filter(e => e.toString() === newPosition.toString()).length > 0;
  const breezeTile = breezeTiles.filter(e => e.toString() === newPosition.toString()).length > 0;
  if (smellyTile) sensors.smell = true;
  if (breezeTile) sensors.breeze = true;
  score = score + 1;
  saveJSON('hero', { coordinates: newCoordinates, sensors, score });
  return newCoordinates;
}

const createWorld = () => {
  const elements = {};
  const { elementsSet } = loadJSON('elements');
  if (!elementsSet) {
    Object.assign(elements, {
      elementsSet: true,
      wumpus: createElement('wumpus'),
      pit: createElement('pit'),
      gold: createElement('gold')
    });
    saveJSON('elements', elements);
  }
  const { wumpus: { position: wumpusPosition }, pit: { position: pitPosition } } = loadJSON('elements');
  if ((wumpusPosition[0] === 2 && wumpusPosition[1] === 1) ||
      (wumpusPosition[0] === 1 && wumpusPosition[1] === 2)) sensors.smell = true;
  return { wumpusPosition, pitPosition };
}

module.exports.wumpus = async (event) => {
  createWorld();
  const currentCoordinates = getPosition();
  if (currentCoordinates.position == [1, 1]) action = 'walk';
  const newCoordinates = execute[action](currentCoordinates);
  safeTiles.push(parseArr(newCoordinates.position));
  console.log('ve o safetiles', safeTiles);
  return JSON.stringify({
    currentCoordinates: newCoordinates,
    wumpusPosition,
    pitPosition,
    sensors,
    score,
    message
  });
};
