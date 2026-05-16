@IsTest
private class ExperienceLoginControllerTest {
    @IsTest
    static void loginReturnsNullOutsideSiteContext() {
        Test.startTest();
        String result = ExperienceLoginController.login('test@example.com', 'wrongpassword');
        Test.stopTest();
        Assert.isNull(result, 'Expected null when Site.login has no page reference outside site context');
    }

    @IsTest
    static void loginThrowsAuraHandledExceptionOnError() {
        Test.startTest();
        Boolean threw = false;
        try {
            ExperienceLoginController.login(null, null);
        } catch (AuraHandledException e) {
            threw = true;
        }
        Test.stopTest();
        Assert.isTrue(threw, 'Expected AuraHandledException for null credentials');
    }
}
