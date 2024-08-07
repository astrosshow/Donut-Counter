// Imported modules 
const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const path = require('path');

/* 
Create Express app instance and 
configure multer to save files in the uploads directory
*/
const app = express();
const upload = multer({ dest: 'uploads/' });

// Configure the app to use body-parser and serve static files
app.use(bodyParser.json());
app.use(express.static('public'));

// Define the route to upload the image
app.post('/upload', upload.single('file'), (req, res) => {
    const filePath = req.file.path;

    // Call the Python script
    const python = spawn('python3', ['process_image.py', filePath]);

    // Handle the output of the Python script
    python.stdout.on('data', (data) => {
        res.json(JSON.parse(data));
    });

    // Handle the error output of the Python script
    python.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    // Handle the exit event of the Python script
    python.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
