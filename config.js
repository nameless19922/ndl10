module.exports = {
    port    : process.env.PORT || 3000,
    mongodb : {
        defaultDb         : 'test',
        defaultCollection : 'contacts',
        defaultUri        : 'mongodb://localhost:27017'
    }
}