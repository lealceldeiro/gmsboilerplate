package configuration

import constants.EnumConfigFields
import grails.transaction.Transactional
import security.EOwnedEntity

@Transactional
class ConfigurationService {

    boolean isThereAnyConfiguration(){
        return BConfiguration.count() > 0
    }

    boolean createDefaultConfig(){
        setField(EnumConfigFields.DEFAULT_ADMIN_UN_SET_UP_CONFIGURED, false)
        setField(EnumConfigFields.DEFAULT_ADMIN_UN_SETUP, false)
        setField(EnumConfigFields.IS_MULTI_ENTITY_APP, false)

        return true
    }

    boolean isDefaultAdminUnSetup(){
        isThere(EnumConfigFields.DEFAULT_ADMIN_UN_SETUP, true)
    }

    boolean isDefaultAdminUnSetupChanged(){
        isThere(EnumConfigFields.DEFAULT_ADMIN_UN_SET_UP_CONFIGURED, true)
    }

    boolean isDefaultUserCreated(){
        isThere(EnumConfigFields.DEFAULT_USER_CREATED, true)
    }

    boolean isDefaultOwnedEntityCreated(){
        isThere(EnumConfigFields.DEFAULT_OWNED_ENTITY_CREATED, true)
    }

    boolean isMultiEntityApplication(){
        isThere(EnumConfigFields.IS_MULTI_ENTITY_APP, true)
    }


    static Long getLastAccessedOwnedEntity(Long userId){
        BConfiguration c = BConfiguration.findByParamAndUserid(String.valueOf(EnumConfigFields.LAST_ACCESSED_ENTITY), String.valueOf(userId))
        return c ? Long.parseLong(c.value) : null
    }


    boolean setDefaultAdminUnSetUp() {
        setField(EnumConfigFields.DEFAULT_ADMIN_UN_SETUP, true)
        setField(EnumConfigFields.DEFAULT_ADMIN_UN_SET_UP_CONFIGURED, true)
        return true
    }

    boolean setDefaultOwnedEntityCreated() {
        setField(EnumConfigFields.DEFAULT_OWNED_ENTITY_CREATED, true)
        return true
    }

    boolean setDefaultUserCreated(){
        setField(EnumConfigFields.DEFAULT_USER_CREATED, true)

        return true
    }

    boolean setIsMultiEntityApp(boolean multi = false) {
        setField(EnumConfigFields.IS_MULTI_ENTITY_APP, multi)
        return true
    }

    boolean setLastAccessedOwnedEntity(Long id, Long userid){
        BConfiguration.withNewTransaction { setField(EnumConfigFields.LAST_ACCESSED_ENTITY, id, userid) }
    }

    boolean deleteUserConfiguration(Long userId) {
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
        else{
            t.value = value
        }
        t.save(flush: true, failOnError: true)

        return t
    }

    private static boolean isThere(Object field, Object value, Long userid = null){
        def t = userid ? BConfiguration.findByParamAndUserid(String.valueOf(field), String.valueOf(userid))
                : BConfiguration.findByParam(String.valueOf(field))
        if(t){
            return t.value == String.valueOf(value)
        }
        return false
    }

}
