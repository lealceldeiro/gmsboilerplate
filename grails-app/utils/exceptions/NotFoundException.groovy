package exceptions

/**
 * Created by asiel on 11/05/17.
 */
class NotFoundException extends Exception{

    String i18nMainMessage
    String i18nNotFoundEntity
    Boolean male

    NotFoundException(String i18nMainMessage, String i18nNotFoundEntity, Boolean male = true){
        this.i18nMainMessage = i18nMainMessage
        this.i18nNotFoundEntity = i18nNotFoundEntity
        this.male = male
    }
}
