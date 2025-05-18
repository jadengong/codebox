const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')
const { v4: uuid } = require('uuid')

async function runCodeInDocker(code, language) {
    const id = uuid()
    const tempDir = path.join(__dirname, 'temp')
    const filename = `${id}.${language === 'python' ? 'py' : 'js'}`
    const filepath = path.join(tempDir, filename)

    // Ensure that the temp folder exists
    if(!fs.existsSync(tempDir)){
        fs.mkdirSync(tempDir)
    }

    // Write code to file
    fs.writeFileSync(filepath, code)

    // Pick image and command based on language
    const image = language === 'python' ? 'python:3.11' : 'node:20'
    const runCmd = language === 'python'
    ? `python /app/${filename}`
    : `node /app/${filename}`

    return new Promise((resolve, reject) => { 
        exec(
            `docker run --rm -v ${filepath}:/app/${filename} ${image} ${runCmd}`,
        (error, stdout, stderr) => {
        if (error) {
            return resolve(stderr || error.message);
        }
        resolve(stdout)
        }
        )
    })
}

module.exports = { runCodeInDocker }