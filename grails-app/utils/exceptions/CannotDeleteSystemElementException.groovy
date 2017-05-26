package exceptions

/**
 * Created by asiel on 11/05/17.
 */
class CannotDeleteSystemElementException extends Exception{

    String i18nMainMessage

    CannotDeleteSystemElementException() {}

    CannotDeleteSystemElementException(String i18nMainMessage){
        this.i18nMainMessage = i18nMainMessage
    }
}
