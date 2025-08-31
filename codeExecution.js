const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { v4: uuid } = require('uuid');

const tempDir = path.join(__dirname, 'temp');

if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
}

// Cleanup function to remove old temp files
function cleanupTempFiles() {
    try {
        const files = fs.readdirSync(tempDir);
        const now = Date.now();
        const maxAge = 5 * 60 * 1000; // 5 minutes
        
        files.forEach(file => {
            const filePath = path.join(tempDir, file);
            const stats = fs.statSync(filePath);
            
            if (now - stats.mtime.getTime() > maxAge) {
                try {
                    fs.unlinkSync(filePath);
                    console.log(`[Cleanup] Removed old temp file: ${file}`);
                } catch (err) {
                    console.warn(`[Cleanup] Failed to remove ${file}:`, err.message);
                }
            }
        });
    } catch (err) {
        console.warn('[Cleanup] Failed to cleanup temp files:', err.message);
    }
}

// Run cleanup every 5 minutes
setInterval(cleanupTempFiles, 5 * 60 * 1000);

// Language config map
const languageConfigs = {
    python: {
        ext: 'py',
        image: 'python:3.11-slim',
        run: (filename) => `python /app/${filename}`,
        timeout: 10000
    },
    javascript: {
        ext: 'js',
        image: 'node:20-slim',
        run: (filename) => `node /app/${filename}`,
        timeout: 10000
    },
    java: {
        ext: 'java',
        image: 'openjdk:17-slim',
        run: (filename) => `sh -c "javac /app/${filename} && java -cp /app Main"`,
        timeout: 15000
    },
    cpp: {
        ext: 'cpp',
        image: 'gcc:13-slim',
        run: (filename) => `sh -c "g++ /app/${filename} -o /app/a.out && /app/a.out"`,
        timeout: 15000
    }
};

async function runCodeInDocker(code, language) {
    // Input validation
    if (!code || typeof code !== 'string') {
        throw new Error('Code must be a non-empty string');
    }
    
    if (!language || typeof language !== 'string') {
        throw new Error('Language must be specified');
    }

    // Language alias map
    const languageMap = {
        'c++': 'cpp',
        'cpp': 'cpp',
        'javascript': 'javascript',
        'js': 'javascript',
        'java': 'java',
        'python': 'python',
        'py': 'python'
    };

    language = languageMap[language.toLowerCase()] || language;
    const config = languageConfigs[language];

    if (!config) {
        throw new Error(`Unsupported language: ${language}. Supported languages: ${Object.keys(languageConfigs).join(', ')}`);
    }

    const id = uuid();
    const filename = `${id}.${config.ext}`;
    const filepath = path.join(tempDir, filename);

    try {
        // Auto-wrapping snippets for Java and C++
        let processedCode = code;
        if (language === 'cpp') {
            processedCode = `#include <iostream>
#include <string>
using namespace std;

int main() {
    ${code}
    return 0;
}`.trim();
        }

        if (language === 'java') {
            processedCode = `public class Main {
    public static void main(String[] args) {
        ${code}
    }
}`.trim();
        }

        if (language === 'python') {
            // Add common imports if they're used in the code
            let imports = '';
            if (code.includes('List[') || code.includes('Dict[') || code.includes('Tuple[') || code.includes('Optional[')) {
                imports = 'from typing import *\n';
            }
            if (code.includes('np.') || code.includes('numpy')) {
                imports += 'import numpy as np\n';
            }
            if (code.includes('pd.') || code.includes('pandas')) {
                imports += 'import pandas as pd\n';
            }
            if (code.includes('plt.') || code.includes('matplotlib')) {
                imports += 'import matplotlib.pyplot as plt\n';
            }
            
            if (imports) {
                processedCode = `${imports}\n${code}`;
            } else {
                processedCode = code;
            }
        }

        // Write code to temporary file
        fs.writeFileSync(filepath, processedCode);

        const runCmd = config.run(filename);
        const dockerCmd = `docker run --rm --memory=100m --cpus=0.5 --network=none -v "${filepath}:/app/${filename}" ${config.image} ${runCmd}`;

        console.log(`[Docker] Running command: ${dockerCmd}`);

        return new Promise((resolve, reject) => {
            const childProcess = exec(dockerCmd, { timeout: config.timeout }, (error, stdout, stderr) => {
                // Clean up temp file
                try {
                    if (fs.existsSync(filepath)) {
                        fs.unlinkSync(filepath);
                    }
                } catch (cleanupErr) {
                    console.warn(`[Cleanup] Failed to delete ${filepath}:`, cleanupErr.message);
                }

                if (error) {
                    if (error.code === 'ETIMEDOUT') {
                        resolve('Execution timed out. Your code took too long to run.');
                    } else if (error.signal === 'SIGTERM') {
                        resolve('Execution was terminated due to resource limits.');
                    } else {
                        resolve(stderr || error.message || 'Execution failed');
                    }
                } else {
                    resolve(stdout || 'Code executed successfully with no output.');
                }
            });

            // Handle process termination
            childProcess.on('error', (err) => {
                console.error('[Docker] Process error:', err);
                resolve(`Execution error: ${err.message}`);
            });
        });

    } catch (error) {
        // Clean up temp file on error
        try {
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
            }
        } catch (cleanupErr) {
            console.warn(`[Cleanup] Failed to delete ${filepath}:`, cleanupErr.message);
        }
        
        throw error;
    }
}

module.exports = { runCodeInDocker, cleanupTempFiles };
