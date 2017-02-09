package security

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@EqualsAndHashCode(includes = 'label')
@ToString(includes = 'label', includeNames = true, includePackage = false)
class BRole implements Serializable {

    String label
    String description
    Boolean enabled

    static hasMany = [permissions: BRole_Permission]

    static constraints = {
        label nullable: false, blank: false, unique: true
        enabled nullable: true
        description nullable: true
    }
}
