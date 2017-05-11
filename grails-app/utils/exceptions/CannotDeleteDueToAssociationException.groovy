package exceptions

/**
 * Created by asiel on 11/05/17.
 */
class CannotDeleteDueToAssociationException extends Exception{

    String i18nMainMessage
    String i18nWho
    String i18nWith
    Boolean maleWho
    Boolean maleWith

    CannotDeleteDueToAssociationException(String i18nMainMessage, String i18nWho, String i18nWith, Boolean maleWho = true,
                                          Boolean maleWith = true){
        this.i18nMainMessage = i18nMainMessage
        this.i18nWho = i18nWho
        this.i18nWith = i18nWith
        this.maleWho = maleWho
        this.maleWith = maleWith
    }
}
