/* for database connection (MONGODB)  */

const mongoose = require('mongoose');

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

const url = `mongodb+srv://muazan:1LW6RXNud6bQeULW@cluster0.h9jwgyt.mongodb.net/?retryWrites=true&w=majority`

mongoose.set("strictQuery", false);

mongoose.connect(url, connectionParams)
    .then(() => {
        console.log('Connected to the database ')
    })
    .catch((err) => {
        console.error(`Error connecting to the database. n${err}`);
    })