package gmsutil

import grails.transaction.Transactional

@Transactional
class TokenGeneratorService {

    String alphabet = (('A'..'Z')+('a'..'z')+('0'..'9')).join("")

    Random random = new Random()

    String getTokenFor(String username = "", Integer min = 90, Integer max = 300) {
        return (username.replaceAll("\\.", "")) + (random.with {
            (min..max).collect { alphabet[ nextInt( alphabet.length() ) ] }.join("")
        })
    }
}
