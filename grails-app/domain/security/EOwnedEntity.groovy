package security

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@EqualsAndHashCode(includes = 'username')
@ToString(includes = 'username', includeNames = true, includePackage = false)
class EOwnedEntity implements Serializable{

    String name
    String username
    String description

    static mapping = {
        description sqlType: 'text'
    }

    static constraints = {
        name blank: false, nullable: false
        username unique: true, blank: false, nullable: false
        description blank: false, nullable: false
    }
}
