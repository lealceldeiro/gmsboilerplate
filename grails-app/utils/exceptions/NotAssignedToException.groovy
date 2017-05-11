package exceptions

/**
 * Created by asiel on 11/05/17.
 */
class NotAssignedToException extends Exception{

    String i18nMainMessage
    String i18nFrom
    String i18nTo
    Boolean maleFrom
    Boolean maleTo

    NotAssignedToException(String i18nMainMessage, String i18nFrom, String i18nTo, Boolean maleFrom = true,
                           Boolean maleTo = true){
        this.i18nMainMessage = i18nMainMessage
        this.i18nFrom = i18nFrom
        this.i18nTo = i18nTo
        this.maleFrom = maleFrom
        this.maleTo = maleTo
    }
}
