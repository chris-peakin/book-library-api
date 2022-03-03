module.exports = (connection, DataTypes) => {
    const schema = {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            isEmail: true,
            },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            len: [8, 20], //password should be between 8 and 20 characters long
        }
    };

    const ReaderModel = connection.define('Reader', schema);
    return ReaderModel;
}