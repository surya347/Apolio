import { LightningElement, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import login from '@salesforce/apex/ExperienceLoginController.login';

export default class ExperienceLoginPage extends NavigationMixin(LightningElement) {
    @api siteName = 'Apolio';

    @track username = '';
    @track password = '';
    @track errorMessage = '';
    @track isLoading = false;
    @track showPassword = false;

    handleUsernameInput(event) {
        this.username = event.target.value;
        this.errorMessage = '';
    }

    handlePasswordInput(event) {
        this.password = event.target.value;
        this.errorMessage = '';
    }

    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }

    async handleSubmit(event) {
        event.preventDefault();
        if (!this.username.trim() || !this.password) return;

        this.isLoading = true;
        this.errorMessage = '';

        try {
            const redirectUrl = await login({ username: this.username.trim(), password: this.password });
            if (redirectUrl) {
                window.location.href = redirectUrl;
            } else {
                this.errorMessage = 'Invalid username or password. Please try again.';
            }
        } catch (error) {
            this.errorMessage = error?.body?.message || 'Something went wrong. Please try again.';
        } finally {
            this.isLoading = false;
        }
    }

    handleForgotPassword() {
        this[NavigationMixin.Navigate]({
            type: 'comm__loginPage',
            attributes: { actionName: 'forgotPassword' }
        });
    }

    handleRegister() {
        this[NavigationMixin.Navigate]({
            type: 'comm__loginPage',
            attributes: { actionName: 'register' }
        });
    }

    get passwordInputType() {
        return this.showPassword ? 'text' : 'password';
    }

    get togglePasswordLabel() {
        return this.showPassword ? 'Hide password' : 'Show password';
    }
}
