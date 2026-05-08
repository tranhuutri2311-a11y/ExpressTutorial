import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        throw error;
    }
}

export const comparePassword = (password, hash) => {
    try {
        return bcrypt.compareSync(password, hash);
    } catch (error) {
        console.log(error);
    }
}