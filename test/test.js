const dull = require('dulljs');

const server = new dull.Server();
server.start({"port": 3000}, () => {
    console.log(`Server is running on port ${port}`);
});
