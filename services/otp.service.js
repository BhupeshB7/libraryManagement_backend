import crypto from 'crypto';
import bcrypt from 'bcrypt';

export const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};

export const hashOTP = async (otp) => {
    return await bcrypt.hash(otp, 10);
};

export const verifyOTP = async (otp, hash) => {
    return await bcrypt.compare(otp, hash);
};