module.exports = (sequelize, DataTypes) => {
    return sequelize.define('otp_records', {
        phoneNumber: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        isUsed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        expireAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    });
};