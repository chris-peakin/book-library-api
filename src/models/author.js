module.exports = (connection, DataTypes) => {
    const schema = {
        author: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notNull: {
                    args: [true],
                    msg: 'We need an author so that we can create one',
                },
                notEmpty: {
                    args: [true],
                    msg: 'The book author cannot be empty',
                },
            },
        },
    }

    const AuthorModel = connection.define('Author', schema);
    return AuthorModel;
}