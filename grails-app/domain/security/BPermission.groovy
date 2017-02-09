package security

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@EqualsAndHashCode(includes = 'name')
@ToString(includes = 'name', includeNames = true, includePackage = false)
class BPermission implements Serializable{

    String name //name to use for authenticating
    String label //label to show to final user

    static constraints = {
        name(blank: false, unique: true)
        label(blank: false, unique: true)
    }
}
