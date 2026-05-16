import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import selfRegister from '@salesforce/apex/ExperienceRegistrationController.selfRegister';

export default class ExperienceRegistrationPage extends NavigationMixin(LightningElement) {
    @api regConfirmUrl = './CheckPasswordResetEmail';

    firstName = '';
    lastName  = '';
    email = '';
    password = '';
    confirmPassword = '';
    errorMessage = '';
    isLoading = false;
    siteName  = 'Apolio';
    passwordStrength = 0;

    get strengthFillClass() {
        return `pw-strength__fill pw-strength__fill--${this.passwordStrength}`;
    }
    get strengthLabelClass() {
        return `pw-strength__label pw-strength__label--${this.passwordStrength}`;
    }
    get strengthLabelText() {
        return ['', 'Weak', 'Fair', 'Good', 'Strong'][this.passwordStrength] || '';
    }

    computeStrength(pw) {
        if (!pw) return 0;
        let score = 0;
        if (pw.length >= 8)           score++;
        if (/[a-z]/.test(pw))         score++;
        if (/[A-Z]/.test(pw))         score++;
        if (/[0-9]/.test(pw))         score++;
        if (/[^a-zA-Z0-9]/.test(pw)) score++;
        if (score <= 1) return 1;
        if (score === 2) return 2;
        if (score === 3) return 3;
        return 4;
    }

    handleInput(event) {
        const field = event.target.dataset.field;
        this[field] = event.target.value;
        this.errorMessage = '';
        if (field === 'password') {
            this.passwordStrength = this.computeStrength(event.target.value);
        }
    }

    async handleSubmit(event) {
        event.preventDefault();
        this.errorMessage = '';

        if (!this.lastName.trim()) { this.errorMessage = 'Last name is required.';    return; }
        if (!this.email.trim())    { this.errorMessage = 'Email is required.';        return; }
        if (this.password && this.password !== this.confirmPassword) {
            this.errorMessage = 'Passwords do not match.';
            return;
        }

        this.isLoading = true;
        try {
            const redirectUrl = await selfRegister({
                firstName: this.firstName?.trim() || '',
                lastName: this.lastName?.trim() || '',
                email: this.email?.trim() || '',
                password: this.includePasswordField ? this.password : null,
                confirmPassword: this.includePasswordField ? this.confirmPassword : null,
                accountId: '001g500000MuUpwAAF',
                startUrl: this.startUrl || '/',
                regConfirmUrl: this.regConfirmUrl || '/'
            });

            if (redirectUrl) {
                window.location.href = redirectUrl;
            }
        } catch (error) {
            this.errorMessage = error?.body?.message || 'Registration failed. Please try again.';
        } finally {
            this.isLoading = false;
        }
    }

    handleCancel() {
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: { name: 'Login' }
        });
    }
}
