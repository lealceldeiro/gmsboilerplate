class BootStrap {

    def permissionService
    def roleService
    def configurationService
    def ownedEntityService

    def userService

    def init = { servletContext ->

        //PERMISSIONS
        boolean isThereConfig = configurationService.isThereAnyConfiguration()
        if(!isThereConfig){
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

        if(!isThereConfig) { //create role for subscriber users
            roleService.createDefaultSubscriberRole()
        }

        //USER & OWNED ENTITY
        if(!configurationService.isDefaultAdminUnSetupChanged()){

            def oe
            if(!configurationService.isDefaultOwnedEntityCreated()){
                oe = ownedEntityService.createDefaultOwnedEntity()
                configurationService.setDefaultOwnedEntityCreated()
            }
            else{
                oe = ownedEntityService.getDefaultOwnedEntity()
            }

            def u
            if(!configurationService.isDefaultUserCreated()){
                u = userService.createDefaultUser()
                configurationService.setDefaultUserCreated()
                userService.addDefaultRoleToUser(u, oe)
            }

            if(configurationService.isDefaultOwnedEntityCreated() && configurationService.isDefaultUserCreated() && u && oe){
                configurationService.setLastAccessedOwnedEntity(oe.id as long, u.id as long)
            }
        }

    }
    def destroy = {
    }
}
