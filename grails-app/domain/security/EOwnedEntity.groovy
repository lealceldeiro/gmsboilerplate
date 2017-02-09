package security

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@EqualsAndHashCode(includes = 'username')
@ToString(includes = 'username', includeNames = true, includePackage = false)
class EOwnedEntity implements Serializable{

    String name
    String username

    static constraints = {
        name blank: false, nullable: false
        username unique: true, blank: false, nullable: false
    }
}
