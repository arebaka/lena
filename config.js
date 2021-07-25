module.exports = {
    token:  process.env.TOKEN,
    params: {},
    db: {
        host:     process.env.DBHOST     || "localhost",
        user:     process.env.DBUSER     || null,
        password: process.env.DBPASSWORD || null,
        database: process.env.DBDATABASE,
        port:     process.env.DBPORT     || 5432
    }
};
