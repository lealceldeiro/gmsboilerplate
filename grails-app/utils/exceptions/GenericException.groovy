package exceptions

/**
 * Created by asiel on 11/05/17.
 */
class GenericException extends Exception{

    String i18nMainMessage

    GenericException() {}

    GenericException(String i18nMainMessage){
        this.i18nMainMessage = i18nMainMessage
    }
}
