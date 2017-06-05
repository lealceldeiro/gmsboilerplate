package configuration

import constants.EnumConfigFields
import grails.transaction.Transactional

@Transactional
class ConfigurationService {

    Boolean Cached_DEFAULT_ADMIN_UN_SET_UP_CONFIGURED = null
    Boolean Cached_DEFAULT_ADMIN_UN_SETUP = null
    Boolean Cached_IS_MULTI_ENTITY_APP = null
    Boolean Cached_IS_USER_REGISTRATION_ALLOWED = null
    Boolean Cached_DEFAULT_USER_CREATED = null
    Boolean Cached_DEFAULT_OWNED_ENTITY_CREATED = null

    Boolean isThereAnyConfiguration(){
        return BConfiguration.count() > 0
    }

    Boolean createDefaultConfig(){
        setField(EnumConfigFields.DEFAULT_ADMIN_UN_SET_UP_CONFIGURED, false)
        setField(EnumConfigFields.DEFAULT_ADMIN_UN_SETUP, false)
        setField(EnumConfigFields.IS_MULTI_ENTITY_APP, false)
        setField(EnumConfigFields.IS_USER_REGISTRATION_ALLOWED, false)

        return true
    }

    Boolean isDefaultAdminUnSetup(){
        if(Cached_DEFAULT_ADMIN_UN_SETUP == null){
            Cached_DEFAULT_ADMIN_UN_SETUP = isThere(EnumConfigFields.DEFAULT_ADMIN_UN_SETUP, true)
        }
        return Cached_DEFAULT_ADMIN_UN_SETUP
    }

    boolean isDefaultAdminUnSetupChanged(){
        if(Cached_DEFAULT_ADMIN_UN_SET_UP_CONFIGURED == null) {
            Cached_DEFAULT_ADMIN_UN_SET_UP_CONFIGURED = isThere(EnumConfigFields.DEFAULT_ADMIN_UN_SET_UP_CONFIGURED, true)
        }
        return Cached_DEFAULT_ADMIN_UN_SET_UP_CONFIGURED
    }

    Boolean isDefaultUserCreated(){
        if(Cached_DEFAULT_USER_CREATED == null) {
            Cached_DEFAULT_USER_CREATED = isThere(EnumConfigFields.DEFAULT_USER_CREATED, true)
        }
        return Cached_DEFAULT_USER_CREATED
    }

    Boolean isDefaultOwnedEntityCreated(){
        if(Cached_DEFAULT_OWNED_ENTITY_CREATED == null) {
            Cached_DEFAULT_OWNED_ENTITY_CREATED = isThere(EnumConfigFields.DEFAULT_OWNED_ENTITY_CREATED, true)
        }
        return Cached_DEFAULT_OWNED_ENTITY_CREATED
    }

    Boolean isMultiEntityApplication(){
        if(Cached_IS_MULTI_ENTITY_APP == null) {
            Cached_IS_MULTI_ENTITY_APP = isThere(EnumConfigFields.IS_MULTI_ENTITY_APP, true)
        }
        return Cached_IS_MULTI_ENTITY_APP
    }

    Boolean isUserRegistrationAllowed(){
        if(Cached_IS_USER_REGISTRATION_ALLOWED == null) {
            Cached_IS_USER_REGISTRATION_ALLOWED = isThere(EnumConfigFields.IS_USER_REGISTRATION_ALLOWED, true)
        }
        return Cached_IS_USER_REGISTRATION_ALLOWED
    }


    static Long getLastAccessedOwnedEntity(Long userId){
        BConfiguration c = BConfiguration.findByParamAndUserid(String.valueOf(EnumConfigFields.LAST_ACCESSED_ENTITY), String.valueOf(userId))
        return c ? Long.parseLong(c.value) : null
    }

    Boolean setLanguage(Long userId, String lan) {
        setField(EnumConfigFields.LANGUAGE, lan, userId)
        return true
    }

    String getLanguage(Long userId) {
        def lan =  BConfiguration.findByParamAndUserid(String.valueOf(EnumConfigFields.LANGUAGE), String.valueOf(userId))
            return lan != null ? String.valueOf(lan.value): null
    }


    Boolean setDefaultAdminUnSetUp() {
        setField(EnumConfigFields.DEFAULT_ADMIN_UN_SETUP, true)
        Cached_DEFAULT_ADMIN_UN_SETUP = true

        setField(EnumConfigFields.DEFAULT_ADMIN_UN_SET_UP_CONFIGURED, true)
        Cached_DEFAULT_ADMIN_UN_SET_UP_CONFIGURED = true
        return true
    }

    Boolean setDefaultOwnedEntityCreated() {
        setField(EnumConfigFields.DEFAULT_OWNED_ENTITY_CREATED, true)
        Cached_DEFAULT_OWNED_ENTITY_CREATED = true
        return true
    }

    Boolean setDefaultUserCreated(){
        setField(EnumConfigFields.DEFAULT_USER_CREATED, true)
        Cached_DEFAULT_USER_CREATED = true
        return true
    }

    Boolean setIsMultiEntityApp(Boolean multi = false) {
        setField(EnumConfigFields.IS_MULTI_ENTITY_APP, multi)
        Cached_IS_MULTI_ENTITY_APP = multi
        return true
    }

    Boolean setIsUserRegistrationsAllowed(Boolean allowed = false) {
        setField(EnumConfigFields.IS_USER_REGISTRATION_ALLOWED, allowed)
        Cached_IS_USER_REGISTRATION_ALLOWED = allowed
        return true
    }

    Boolean setLastAccessedOwnedEntity(Long id, Long userid){
        BConfiguration.withNewTransaction { setField(EnumConfigFields.LAST_ACCESSED_ENTITY, id, userid) }
    }

    Boolean deleteUserConfiguration(Long userId) {
        BConfiguration.executeUpdate(
                "delete from BConfiguration bc where bc.userid = :userid", [userid: String.valueOf(userId)]
        )
    }

    private static BConfiguration setField(Object field, Object value, Long userid = null){
        def t = userid ? BConfiguration.findByParamAndUserid(String.valueOf(field), String.valueOf(userid))
                       : BConfiguration.findByParam(String.valueOf(field))
        if(!t){
            t = new BConfiguration(param: String.valueOf(field), value: String.valueOf(value), userid: userid)
        }
        else {
            t.value = value
        }
        t.save(flush: true, failOnError: true)

        return t
    }

    private static Boolean isThere(Object field, Object value, Long userid = null){
        def t = userid ? BConfiguration.findByParamAndUserid(String.valueOf(field), String.valueOf(userid))
                : BConfiguration.findByParam(String.valueOf(field))
        if(t){
            return t.value == String.valueOf(value)
        }
        return false
    }

}
