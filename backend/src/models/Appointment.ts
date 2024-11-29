import sequelize from "../config/db";
import { Model, DataTypes, DateOnlyDataType } from "sequelize";
import User from "./User";
import Patient from "./Patient";
import { v4 as UUIDV4 } from "uuid";

class Appointment extends Model {
    public uuid!: string;
    public type!: number; // 1: Surgery, 2: consultation
    public status!: number // 1: Scheduled, 2: Cancelled, 3: Complete
    public date!: DateOnlyDataType;
    public patient!: string;
    public doctor!: string;
    public patientId!: string;
    public appointedby!: string;
}

Appointment.init({
    uuid: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    type: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
}, {
    modelName: 'Appointment',
    sequelize
})

Patient.hasOne(Appointment, { foreignKey: 'patient', as: 'patientId', onDelete: "CASCADE", onUpdate: "CASCADE" });
Appointment.belongsTo(Patient, { foreignKey: 'patient', as: 'patientId', onDelete: "CASCADE", onUpdate: "CASCADE" });

User.hasOne(Appointment, { foreignKey: "doctor", as: "appointedby", onDelete: "CASCADE", onUpdate: "CASCADE" });
Appointment.hasOne(User, { foreignKey: "doctor", as: "appointedby", onDelete: "CASCADE", onUpdate: "CASCADE" });

export default Appointment;