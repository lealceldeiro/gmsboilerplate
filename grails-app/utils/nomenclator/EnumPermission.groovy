package nomenclator

/**
 * Created by Asiel on 1/16/2017.
 */
enum EnumPermission {
    /*USER*/
    MANAGE_USER,
        CREATE_USER,
        READ_USER,
        READ_ALL_USER,
        UPDATE_USER,
        DELETE_USER,

    /*ROLE*/
    MANAGE_ROLE,
        CREATE_ROLE,
        READ_ROLE,
        READ_ALL_ROLE,
        UPDATE_ROLE,
        DELETE_ROLE,

    /*PERMISSION*/
    MANAGE_PERMISSION,
        CREATE_PERMISSION,
        READ_PERMISSION,
        UPDATE_PERMISSION,
        DELETE_PERMISSION,

    /*OWNED_ENTITY*/
    MANAGE_OWNED_ENTITY,
        CREATE_OWNED_ENTITY,
        READ_OWNED_ENTITY,
        READ_ALL_OWNED_ENTITY,
        UPDATE_OWNED_ENTITY,
        DELETE_OWNED_ENTITY,

    /*PROFILE*/
    MANAGE_PROFILE,
        READ_PROFILE,


}
