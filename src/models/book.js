module.exports = (connection, DataTypes) => {
    const schema = {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    args: [true],
                    msg: 'We need a book title',
                },
                notEmpty: {
                    args: [true],
                    msg: 'The book title cannot be empty',
                },
            },
        },
        ISBN: {
            type: DataTypes.STRING,
            validate: {
                isNumeric: true,
                // Note: ISBNs should be either 10 or 13 digits long. From January 2007 onwards,
                // ISBNs are now 13 digits long, but prior to this, they were 10 digits long.
                // If the user has older books to add, requiring 13 digits only would not work for them.
                // https://www.isbn-international.org/content/what-isbn
                len: [10, 13],
                customValidator(value){
                    if ((value.length === 11) || (value.length === 12)){
                        throw new Error("ISBN must be 10 or 13 digits long")
                    }
                }
            }
        },
    };

    const BookModel = connection.define('Book', schema);
    return BookModel;
}