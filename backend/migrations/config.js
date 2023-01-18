const app = require('../src/app');
const env = process.env.NODE_ENV || 'development';
const dialect = 'postgres'; // Or your dialect name

const fs = require('fs')
const path = require('path')

// setup csv-migration
// copy file-migration-template-file and rename it to the filename so that it is known witch file is migrated
let files = fs.readdirSync(path.join(...[process.cwd(), 'migrations', 'files']))
if (files && files.length > 0) {
  files = files.filter(file => file.split('.').at(-1) === 'csv')
  console.log(`Files found: ${files.join(', ')}`)
  if (files.length > 0) {
    files.forEach(file => {
      filename = file.split('.')[0]
      if (fs.existsSync(path.join(...[process.cwd(), 'migrations', 'scripts', `${filename}.js`]))) {
        console.log(`File "${filename}.js" already exist, skipping file!`)
        return
      }
      console.log(`Copying file ${file} to ${filename}.js`)
      fs.copyFileSync(path.join(...[process.cwd(), 'migrations', 'file-template.js']), path.join(...[process.cwd(), 'migrations', 'scripts', `${filename}.js`]))
    })
  }
}

module.exports = {
  [env]: {
    dialect,
    url: app.get(dialect),
    migrationStorageTableName: '_migrations'
  }
};