package security

import configuration.ConfigurationService
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@EqualsAndHashCode(includes = 'username')
@ToString(includes = 'username', includeNames = true, includePackage = false)
class EUser implements Serializable {

    def springSecurityService
    def configurationService

    String username
    String email
    String name
    String password
    Boolean enabled = true
    Boolean emailVerified = true

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
        emailVerified nullable: true
    }

    static mapping = {password column: '`password`'}

    /*for SPRING SECURITY PLUGIN*/
    Set<BPermission> getAuthorities(){
        Set<BPermission> a = []

        Long oeId = ConfigurationService.getLastAccessedOwnedEntity(this.id)
        List allOE = null

        List roles = null
        if(oeId) {
            roles = BUser_Role_OwnedEntity.getRolesByUserByOwnedEntity(this.id, oeId) as List
        }
        if(!oeId || !roles || roles.isEmpty()) {
            allOE = BUser_Role_OwnedEntity.getOwnedEntitiesByUser(this.id) as List
        }

        int g = -10
        if(allOE && !allOE.isEmpty()) {
            g = allOE.size() - 1
            while((!roles || roles.isEmpty()) && g >= 0){
                roles = BUser_Role_OwnedEntity.getRolesByUserByOwnedEntity(this.id, (allOE.get(g--) as EOwnedEntity).id) as List
            }
        }

        if(g != -10){
            configurationService.setLastAccessedOwnedEntity((allOE.get(g + 1) as EOwnedEntity).id, this.id)
        }

        def permissions
        roles.each {
            if(it.enabled){
                permissions = BRole_Permission.getPermissionsByRole((it.id as Long), [:])
                a.addAll(permissions as List)
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
