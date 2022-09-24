import express from 'express';
const app = express();
app.get('/ads', (req, res) => {
    return res.json(['teste 01', 'teste 02']);
});
app.listen(3333);
