package file

import security.EUser

class EFile {

    //region fileTypes
    final static String GENERIC = "GENERIC"
    final static String PROFILE_PICTURE = "PROFILE_PICTURE"
    //endregion

    String name
    String extension
    float size
    EUser userOwner

    String type

    static constraints = {
        name blank: false, nullable: false
        extension blank: false, nullable: false
        size nullable: false
        userOwner nullable: false
        type nullable: false
    }
}
