const createElement = element => {
  do {
    xAxis = Math.floor(Math.random() * (5 - 1) + 1);
    yAxis = Math.floor(Math.random() * (5 - 1) + 1);  
  } while (xAxis === 1 && yAxis === 1);
  const coordinates = [xAxis, yAxis];
  const sensorTiles = [];
  if (element === 'wumpus' || element === 'pit') {
    sensorTiles.push(
      [coordinates[0] - 1, coordinates[1]],
      [coordinates[0], coordinates[1] + 1],
      [coordinates[0] + 1, coordinates[1]],
      [coordinates[0], coordinates[1] - 1]
    );
  }
  return { position: coordinates, sensorTiles };
}

module.exports = createElement;