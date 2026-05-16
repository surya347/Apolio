public without sharing class ExperienceLoginController {
    @AuraEnabled
    public static String login(String username, String password) {
        try {
            PageReference ref = Site.login(username, password, '/');
            return ref != null ? ref.getUrl() : null;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
