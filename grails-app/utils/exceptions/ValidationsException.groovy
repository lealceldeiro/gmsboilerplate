package exceptions

/**
 * Created by asiel on 11/05/17.
 */
class ValidationsException extends Exception{

    String i18nMainMessage

    ValidationsException() {}
    ValidationsException(String i18nMainMessage){
        this.i18nMainMessage = i18nMainMessage
    }
}
