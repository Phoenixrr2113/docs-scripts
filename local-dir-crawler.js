const fs = require('fs');
const path = require('path');

// Define the path to your directory and the output file
const directoryPath = '/Users/randywilson/Desktop/documentation-main/kits/components';
const outputFilePath = './combined_output.txt';

// Define the maximum file size (5 MB)
const maxFileSize = 5 * 1024 * 1024; // 5 MB in bytes

// Function to recursively search and copy .mdx file content
function combineFiles(directory, outputFile) {
    let outputStream = fs.createWriteStream(outputFile, { flags: 'w' });
    let currentFileSize = 0;

    function readFilesRecursively(dir) {
        const files = fs.readdirSync(dir);

        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                readFilesRecursively(filePath); // Recurse into the directory
            } else if (stat.isFile() && path.extname(file) === '.mdx') {  // Only process .mdx files
                if (currentFileSize >= maxFileSize) {
                    console.log("Reached the 5MB limit.");
                    return;
                }

                try {
                    const fileContent = fs.readFileSync(filePath, 'utf8');
                    const fileSize = Buffer.byteLength(fileContent, 'utf8');

                    if (currentFileSize + fileSize <= maxFileSize) {
                        outputStream.write(fileContent + '\n');
                        currentFileSize += fileSize;
                    } else {
                        console.log("Reached the 5MB limit.");
                        return;
                    }
                } catch (error) {
                    console.error(`Could not read file ${filePath}. Error: ${error.message}`);
                }
            }
        });
    }

    readFilesRecursively(directory);
    outputStream.end();
    console.log("Files have been combined up to 5MB.");
}

// Run the function
combineFiles(directoryPath, outputFilePath);
