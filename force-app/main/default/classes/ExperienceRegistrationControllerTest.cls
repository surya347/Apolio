@IsTest
private class ExperienceRegistrationControllerTest {
    @IsTest
    static void throwsWhenLastNameBlank() {
        Boolean threw = false;
        Test.startTest();
        try {
            ExperienceRegistrationController.selfRegister(
                'First', '', 'test@example.com', 'Pw1!', 'Pw1!', null, '/', '/confirm'
            );
        } catch (AuraHandledException e) {
            threw = true;
        }
        Test.stopTest();
        Assert.isTrue(threw, 'Expected AuraHandledException for blank last name');
    }

    @IsTest
    static void throwsWhenEmailBlank() {
        Boolean threw = false;
        Test.startTest();
        try {
            ExperienceRegistrationController.selfRegister(
                'First', 'Last', '', 'Pw1!', 'Pw1!', null, '/', '/confirm'
            );
        } catch (AuraHandledException e) {
            threw = true;
        }
        Test.stopTest();
        Assert.isTrue(threw, 'Expected AuraHandledException for blank email');
    }

    @IsTest
    static void throwsWhenPasswordsMismatch() {
        Boolean threw = false;
        Test.startTest();
        try {
            ExperienceRegistrationController.selfRegister(
                'First', 'Last', 'test@example.com', 'Pw1!', 'Different!', null, '/', '/confirm'
            );
        } catch (AuraHandledException e) {
            threw = true;
        }
        Test.stopTest();
        Assert.isTrue(threw, 'Expected AuraHandledException when passwords do not match');
    }
}
