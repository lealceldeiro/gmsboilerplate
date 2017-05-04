package security

import configuration.ConfigurationService
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@EqualsAndHashCode(includes = 'username')
@ToString(includes = 'username', includeNames = true, includePackage = false)
class EUser implements Serializable {

    def springSecurityService

    String username
    String email
    String name
    String password
    Boolean enabled = true

    Boolean accountExpired = false
    Boolean accountLocked = false
    Boolean passwordExpired = false


    static transients = ['authorities', 'springSecurityService']

    static hasMany = [roles: BUser_Role_OwnedEntity]

    static constraints = {
        username nullable: false, unique: true, blank: false
        email nullable: true, unique: true, blank: false
        name nullable: false, blank: false
        password nullable: false, blank: false
        enabled nullable: true
    }

    static mapping = {password column: '`password`'}

    /*for SPRING SECURITY PLUGIN*/
    Set<BPermission> getAuthorities(){
        Long oeId = ConfigurationService.getLastAccessedOwnedEntity(this.id)
        if(!oeId) {
            oeId = BUser_Role_OwnedEntity.getOwnedEntitiesByUser(this.id, [max: 1])[0].id
        }
        Set<BPermission> a = []
        def roles = BUser_Role_OwnedEntity.getRolesByUserByOwnedEntity(this.id, oeId)

        def permissions
        roles.each {
            if(it.enabled){
                permissions = BRole_Permission.getPermissionsByRole((it.id as Long), [:])
                permissions.each {
                    p ->
                        a << new BPermission(name: p.name, label: p.label, id: p.id)
                }
            }
        }

        return a
    }

    def beforeInsert() {
        encodePassword()
    }
    def beforeUpdate() {
        if (isDirty('password')) {
            encodePassword()
        }
    }
    protected void encodePassword() {
        password = springSecurityService?.passwordEncoder ?
                springSecurityService.encodePassword(password) :
                password
    }
    /*end for SPRING SECURITY PLUGIN*/


}
