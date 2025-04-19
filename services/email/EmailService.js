export class EmailService {
    constructor() {
        if (this.constructor === EmailService) {
            throw new Error("Abstract class cannot be instantiated");
        }
    }

    async sendOTP(email, otp) {
        throw new Error("Method 'sendOTP()' must be implemented");
    }
}