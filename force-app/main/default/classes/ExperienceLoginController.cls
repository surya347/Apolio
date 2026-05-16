public without sharing class ExperienceLoginController {
    @AuraEnabled
    public static String login(String username, String password, String startUrl) {
        try {
            String url = String.isBlank(startUrl) ? '/' : startUrl;
            PageReference ref = Site.login(username, password, url);
            return ref != null ? ref.getUrl() : null;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
