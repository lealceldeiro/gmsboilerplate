package subscriber

import security.EUser

class BEmailVerificationToken {

    String token

    EUser user

    static constraints = {
        token nullable: false, blank: false, unique: true
        user nullable: false, blank: false
    }
}
