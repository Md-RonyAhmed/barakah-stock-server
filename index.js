const express = require('express');
const app = express();
const port = process.env.PORT || 5000;








// testing api 
app.get("/json", (req, res) => {
   res.send({ message: "Barakah stock running"});
});

app.listen(port, () => {
   console.log(`Server running on port: ${port}`)
});