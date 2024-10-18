import { DataTypes, Model } from "sequelize";

import sequelize from "../config/dbconnect";
import Hobbies from "./hobbiesModel";


class UserDetail extends Model {
    public id!  : number;
    public firstName?:string;
    public lastName!:string;
    public email!:string;
    public phoneNo!:string;
    public password!:string;
    public profile_image! : string;
    public gender!:"male" |"female"|"other";
    public user_type!:"Agency" | "Job_Seeker";
    public agency?:string;
    public resume? : string;
    public isActive!:boolean;
}

UserDetail.init(
    {
        id:{
            type: DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,

        },
        firstName:{
            type: DataTypes.STRING,
            allowNull:false
        },
        lastName:{
            type: DataTypes.STRING,
            allowNull:true
        },
        email:{
            type: DataTypes.STRING,
            allowNull:false,
            unique:true
        },
        password:{
            type:DataTypes.STRING,
            allowNull:false
        },
        phoneNo:{
            type:DataTypes.STRING,
            allowNull:false
        },
        gender:{
            type:DataTypes.ENUM,
            values:["male","female","other"],
            allowNull:false
        },
        user_type:{
            type:DataTypes.ENUM,
            values:["Agency","Job_Seeker"],
            allowNull:false
        },
        agency:{
            type:DataTypes.STRING,
        },
        resume:{
            type:DataTypes.STRING,
            allowNull:true
        },
        profile_image:{
            type:DataTypes.STRING,
            allowNull:false
        },
        isActive:{
            type:DataTypes.BOOLEAN,
            defaultValue:false
        }
    },
    {
        sequelize,
        tableName:"userdetails"
    }
)

UserDetail.hasMany(Hobbies,{
    sourceKey:"id",
    foreignKey:"userId",
    as:"address"
})
Hobbies.belongsTo(UserDetail,{
    targetKey:"id",
    foreignKey:"userId",
    as:"user"
})

export default UserDetail;