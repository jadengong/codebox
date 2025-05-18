const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { v4: uuid } = require('uuid');

const tempDir = path.join(__dirname, 'temp');

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// Language config map
const languageConfigs = {
    python: {
        ext: 'py',
        image: 'python:3.11',
        run: (filename) => `python /app/${filename}`
    },
    javascript: {
        ext: 'js',
        image: 'node:20',
        run: (filename) => `node /app/${filename}`
    },
    java: {
        ext: 'java',
        image: 'openjdk:17',
        run: (filename) => `sh -c "javac /app/${filename} && java -cp /app Main"`
    },
    cpp: {
        ext: 'cpp',
        image: 'gcc:13',
        run: (filename) => `sh -c "g++ /app/${filename} -o /app/a.out && /app/a.out"`
    }
};

async function runCodeInDocker(code, language) {
    const config = languageConfigs[language];

    if (!config) {
        throw new Error(`Unsupported language: ${language}`);
    }

    const id = uuid();
    const filename = `${id}.${config.ext}`;
    const filepath = path.join(tempDir, filename);

    // Auto-wrapping snippets for Java and C++
    if (language === 'cpp') {
        code = `
    #include <iostream>
    using namespace std;

    int main() {
        ${code}
    return 0;
}
    `.trim();
}

    if (language === 'java') {
        code = `
    public class Main {
        public static void main(String[] args) {
            ${code}
    }
}
        `.trim();
}

    fs.writeFileSync(filepath, code);

    const runCmd = config.run(filename);
    const dockerCmd = `docker run --rm -v ${filepath}:/app/${filename} ${config.image} ${runCmd}`;

    console.log(`[Docker] Running command: ${dockerCmd}`);

    return new Promise((resolve) => {
        exec(dockerCmd, (error, stdout, stderr) => {
            // Try to clean temp file
            try {
                fs.unlinkSync(filepath);
            } catch (cleanupErr) {
                console.warn(`[Cleanup] Failed to delete ${filepath}:`, cleanupErr.message);
            }

            if (error) {
                return resolve(stderr || error.message);
            }
            resolve(stdout);
        });
    });
}

module.exports = { runCodeInDocker };
