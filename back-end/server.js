const app = require('./app');

const PORT = process.env.PORT || 9115;

app.listen(PORT, () => {
    console.log(`Server is running on https://localhost:${PORT}/api`);
});