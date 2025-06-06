var fs = require('fs');
var os = require('os');

var user = os.userInfo();
console.log(user);
console.log(user.username);

// Fixed: Added missing comma and corrected file content parameter
fs.appendFile('greeting.txt', 'Hi ' + user.username + '!\n', (err) => {
    if (err) {
        console.log('Error creating file:', err);
    } else {
        console.log('File is created');
    }
});