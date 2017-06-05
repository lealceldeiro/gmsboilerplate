package subscriber

import grails.transaction.Transactional

@Transactional
class EmailVerificationTokenService {

    def deleteAllExpiredToken() {
        Date cDate = new Date()
        cDate.setDate(cDate.getDate() - 1) //todo: make configurable. For now, in 1 day expires the token
        BEmailVerificationToken.executeUpdate(
                "delete from BEmailVerificationToken evt where evt.createdAt = :cDate or evt.createdAt < :cDate",
                [cDate: cDate]
        )
    }
}
