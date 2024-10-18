import { DataTypes,Model } from "sequelize";
import sequelize from "../config/dbconnect";

class Hobbies  extends Model {
    public userId!  : number;
    public hobbi! :string
}

Hobbies.init({
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    hobbi:{
        type:DataTypes.STRING,
        allowNull:false
    }
},
{
    sequelize,
    tableName:"hobbies"
}
)

export default  Hobbies;

