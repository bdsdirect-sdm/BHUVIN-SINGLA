import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db";
import { v4 as UUIDV4 } from "uuid";
import Address from "./Address";
import User from "./User";

class Patient extends Model{
    public uuid!: number;
    public firstname!: string;
    public lastname!: string;
    public disease!: string;
    public referedby!: string;
    public referedto!: string;
    public referalstatus!: boolean;
    public referback!: boolean
    public address!: string;
}

Patient.init({
    uuid:{
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    firstname:{
        type: DataTypes.STRING,
        allowNull: false
    },
    lastname:{
        type: DataTypes.STRING,
        allowNull: false
    },
    disease:{
        type: DataTypes.STRING,
        allowNull: false
    },
    referalstatus:{
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue:false
    },
    referback:{
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
},{
    sequelize,
    modelName:'Patient'
})

User.hasMany(Patient, { foreignKey: 'referedby', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Patient.belongsTo(User, { foreignKey: 'referedby', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

User.hasMany(Patient, { foreignKey: 'referedto', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Patient.belongsTo(User, { foreignKey: 'referedto', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

Address.hasMany(Patient, {foreignKey:"address", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Patient.belongsTo(Address, {foreignKey:"address", onDelete: 'CASCADE', onUpdate: 'CASCADE' });

export default Patient;