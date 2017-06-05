package subscriber

import security.EUser


class BEmailVerificationToken {

    String token
    static belongsTo = [user: EUser]
    Date createdAt = new Date()

    static constraints = {
        token nullable: false, blank: false, unique: true
        createdAt nullable: false, blank: false
    }
}
