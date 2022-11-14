const { writeFileSync, readFileSync, existsSync, mkdirSync } = require('fs');
const { resolve } = require('path');

const resolvePath = (...args) => resolve(...args);

const loadJSON = (jsonFilename) => {
  const validateDataFolder = () => !existsSync(resolvePath('data')) &&
  mkdirSync(resolvePath('data'));
  
  try {
      validateDataFolder();
      const fileContent = readFileSync(
          resolvePath('data', `${jsonFilename}.json`), 
          'utf8'
      )
      return JSON.parse(fileContent);
  } catch(e) {
      console.log('ve o erro', e);
      return null;
  }
}

const saveJSON = (jsonFilename, content) => {
  const contentSerialized = JSON.stringify(content);
  return writeFileSync(
      resolvePath('data', `${jsonFilename}.json`),
      contentSerialized,
      'utf8'
  );
};

module.exports = { loadJSON, saveJSON };