package subscriber

import security.EUser

class BEmailVerificationToken {

    String token
    static belongsTo = [user: EUser]

    static constraints = {
        token nullable: false, blank: false, unique: true
    }
}
