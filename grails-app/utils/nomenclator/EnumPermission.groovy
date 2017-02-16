package nomenclator

/**
 * Created by Asiel on 1/16/2017.
 */
enum EnumPermission {
    /*USER*/
    MANAGE__USER,
        CREATE__USER,
        READ__USER,
        READ_ALL__USER,
        UPDATE__USER,
        DELETE__USER,

    /*ROLE*/
    MANAGE__ROLE,
        CREATE__ROLE,
        READ__ROLE,
        READ_ALL__ROLE,
        UPDATE__ROLE,
        DELETE__ROLE,

    /*PERMISSION*/
    MANAGE__PERMISSION,
        CREATE__PERMISSION,
        READ__PERMISSION,
        UPDATE__PERMISSION,
        DELETE__PERMISSION,

    /*OWNED_ENTITY*/
    MANAGE_OWNED__ENTITY,
        CREATE_OWNED__ENTITY,
        READ_OWNED__ENTITY,
        READ_ALL_OWNED__ENTITY,
        UPDATE_OWNED__ENTITY,
        DELETE_OWNED__ENTITY,

    /*PROFILE*/
    MANAGE__PROFILE,
        READ__PROFILE,


}
