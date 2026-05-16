public without sharing class ExperienceRegistrationController {
    @AuraEnabled
    public static String selfRegister(
        String firstName,
        String lastName,
        String email,
        String password,
        String confirmPassword,
        String accountId,
        String startUrl,
        String regConfirmUrl
    ) {
        if (String.isBlank(lastName)) throw new AuraHandledException('Last name is required.');
        if (String.isBlank(email))    throw new AuraHandledException('Email is required.');

        if (!String.isBlank(password) && password != confirmPassword) {
            throw new AuraHandledException('Passwords do not match.');
        }

        try {
            User u = new User();
            u.FirstName          = firstName;
            u.LastName           = lastName;
            u.Email              = email;
            u.Username           = email;
            u.CommunityNickname  = buildNickname(email);
            u.Alias              = buildAlias(firstName, lastName);
            // Inherit org defaults so the platform doesn't reject the record
            u.TimeZoneSidKey     = UserInfo.getTimeZone().getID();
            u.LocaleSidKey       = UserInfo.getLocale();
            u.LanguageLocaleKey  = UserInfo.getLanguage();
            u.EmailEncodingKey   = 'UTF-8';

            String userId = Site.createExternalUser(u, accountId, password);

            if (String.isBlank(password) || String.isBlank(userId)) {
                return String.isBlank(regConfirmUrl) ? '/' : regConfirmUrl;
            }

            PageReference loginRef = Site.login(
                email, password, String.isBlank(startUrl) ? '/' : startUrl
            );
            return loginRef != null ? loginRef.getUrl()
                 : (String.isBlank(regConfirmUrl) ? '/' : regConfirmUrl);

        } catch (AuraHandledException e) {
            throw e;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    private static String buildAlias(String firstName, String lastName) {
        String base = String.isBlank(firstName)
            ? lastName.left(8)
            : (firstName.left(1) + lastName).left(8);
        return base.replaceAll('[^a-zA-Z0-9]', '');
    }

    private static String buildNickname(String email) {
        String base = email.split('@')[0].replaceAll('[^a-zA-Z0-9]', '').left(32);
        return base + String.valueOf(System.currentTimeMillis()).right(4);
    }
}
