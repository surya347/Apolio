import { LightningElement, api, track } from 'lwc';
import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';
import { wire } from 'lwc';

export default class ExperienceSiteNavBar extends NavigationMixin(LightningElement) {
    @api siteName = 'My Site';
    @api primaryColor = '#0176d3';

    @track isMenuOpen = false;
    @track activePage = '';

    @wire(CurrentPageReference)
    setCurrentPage(pageRef) {
        if (!pageRef) return;
        if (pageRef.type === 'comm__namedPage') {
            this.activePage = (pageRef.attributes.name || '').toLowerCase();
        } else if (pageRef.type === 'comm__loginPage') {
            this.activePage = 'login';
        } else {
            this.activePage = '';
        }
    }

    // CSS custom property injection for the brand color chosen in Experience Builder
    connectedCallback() {
        this.template.host.style.setProperty('--nav-primary', this.primaryColor);
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
    }

    handleHomeNav() {
        this._navigate({ type: 'comm__namedPage', attributes: { name: 'Home' } });
    }

    handleSupportNav() {
        this._navigate({ type: 'comm__namedPage', attributes: { name: 'support__c' } });
    }

    handleLoginNav() {
        this._navigate({ type: 'comm__loginPage', attributes: { actionName: 'login' } });
    }

    _navigate(pageRef) {
        this.isMenuOpen = false;
        this[NavigationMixin.Navigate](pageRef);
    }

    // ─── Computed classes ───────────────────────────────────────────────────────

    get hamburgerClass() {
        return `hamburger${this.isMenuOpen ? ' hamburger--open' : ''}`;
    }

    get mobileMenuClass() {
        return `mobile-menu${this.isMenuOpen ? ' mobile-menu--open' : ''}`;
    }

    get mobileMenuHidden() {
        return !this.isMenuOpen;
    }

    get homeLinkClass() {
        return `navbar__link${this.activePage === 'home' ? ' navbar__link--active' : ''}`;
    }

    get supportLinkClass() {
        return `navbar__link${this.activePage === 'support' ? ' navbar__link--active' : ''}`;
    }

    get mobileHomeLinkClass() {
        return `mobile-menu__link${this.activePage === 'home' ? ' mobile-menu__link--active' : ''}`;
    }

    get mobileSupportLinkClass() {
        return `mobile-menu__link${this.activePage === 'support' ? ' mobile-menu__link--active' : ''}`;
    }

    get homeAriaCurrent() {
        return this.activePage === 'home' ? 'page' : 'false';
    }

    get supportAriaCurrent() {
        return this.activePage === 'support' ? 'page' : 'false';
    }
}
