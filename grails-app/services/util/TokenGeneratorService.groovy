package util

import grails.transaction.Transactional

@Transactional
class TokenGeneratorService {

    String alphabet = (('A'..'Z')+('a'..'z')+('0'..'9')).join("")

    String getTokenFor(String username = "", Integer max = 25) {
        return username.replaceAll(".", "") + new Random().with {
            (1..max).collect { alphabet[ nextInt( alphabet.length() ) ] }.join("")
        }
    }
}
