module.exports = (connection, DataTypes) => {
    const schema = {
        genre: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notNull: {
                    args: [true],
                    msg: 'We need a genre in so that we can create one',
                },
                notEmpty: {
                    args: [true],
                    msg: 'The book genre cannot be empty',
                },
            },
        },
    };
    
    const GenreModel = connection.define('Genre', schema);
    return GenreModel;
};