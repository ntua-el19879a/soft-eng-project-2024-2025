const bcrypt = require('bcrypt');

(async () => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash("NAO", saltRounds);
    console.log("Hashed Password:", hashedPassword);
})();
