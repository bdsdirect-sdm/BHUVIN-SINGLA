import bcrypt from "bcrypt"

export const passwordToHassed = async (password:string) =>{
    const hashedPassword :string = await bcrypt.hash(password,10);
    return hashedPassword;
}
