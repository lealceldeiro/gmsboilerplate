/**
 * Created by asiel on 5/06/17.
 */
class DeleteExpiredTokensJob {

    def emailVerificationTokenService

    static triggers = {
        cron name: 'DeleteExpiredTokensJob', cronExpression: "0 0 12 1/1 * ? *"
    }
    def group = "SubscriberJobs"
    def description = "Deletes all tokens from users who have not verified their email"

    def execute(){
        emailVerificationTokenService.deleteAllExpiredToken()
    }
}
