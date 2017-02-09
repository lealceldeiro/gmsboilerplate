class BootStrap {

    def permissionService
    def roleService
    def configurationService
    def ownedEntityService

    def userService

    def init = { servletContext ->

        //PERMISSIONS
        //todo: check out this initial config latter in time when authentication is working properly
        if(!configurationService.isThereAnyConfiguration()){
            configurationService.createDefaultConfig()
        }

        //ROLES
        if(permissionService.noPermissionInDB()){ //this will only be true at the begging of the application start (db integrity is required)
            boolean pok = permissionService.createDefaultPermissions()
            if(pok){
                if(roleService.noRolesInDB()){
                    roleService.createDefaultAdminRole()
                }
            }
        }

        //USER & OWNED ENTITY
        if(!configurationService.isDefaultAdminUnSetupChanged()){

            def oe
            if(!configurationService.isDefaultOwnedEntityCreated()){
                oe = ownedEntityService.createDefaultOwnedEntity()
                configurationService.setDefaultOwnedEntityCreated()
                configurationService.setLastAccessedOwnedEntity(oe.id)
            }
            else{
                oe = ownedEntityService.getDefaultOwnedEntity()
            }

            if(!configurationService.isDefaultUserCreated()){
                def u = userService.createDefaultUser()
                configurationService.setDefaultUserCreated()
                userService.addDefaultRoleToUser(u, oe)
            }
        }

    }
    def destroy = {
    }
}
