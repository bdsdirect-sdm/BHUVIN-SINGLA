import { Sequelize } from "sequelize"
import dotenv from "dotenv"

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME as string, process.env.DB_HOST as string, process.env.DB_PASSWORD as string, {
    host: "localhost",
    dialect: "mysql"
})

export const dbconnect = () => {
    sequelize.sync({ alter: true }).then(() => {
        console.log("database connected and syncronized successfully")
    }).catch((err) => {
        console.log(err);
        console.log("Problem in creating user")
    })
}

export default sequelize;