package exceptions

/**
 * Created by asiel on 11/05/17.
 */
class EmailAlreadyVerifiedException extends Exception{

    String i18nMainMessage

    EmailAlreadyVerifiedException() {}

    EmailAlreadyVerifiedException(String i18nMainMessage){
        this.i18nMainMessage = i18nMainMessage
    }
}
