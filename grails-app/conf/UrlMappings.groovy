class UrlMappings {

    static mappings = {

        //region USER
        "/api/user"                             (controller: "user")                            {action = [GET: "searchAll", PUT: "create"]}
        "/api/user/associated"                  (controller: "user", action: "getAssociatedToEntities")
        "/api/user/entity/$eid"                 (controller: "user", action: "search")
        "/api/user/$id"                         (controller: "user")                            {action = [GET: "show", POST: "update", DELETE: "delete"]}
        "/api/user/profile/$id"                 (controller: "user", action: "updateProfile")
        "/api/user/$id/activate/$value"         (controller: "user", action: "activate")
        "/api/user/get"                         (controller: "user", action: "getBy")
        //endregion

        //region ROLE
        "/api/role"                             (controller: "role")                            {action = [GET: "searchAll", PUT: "create"]}
        "/api/role/$uid/$eid"                   (controller: "role", action: "search")
        "/api/role/$id"                         (controller: "role")                            {action = [GET: "show", POST: "update", DELETE: "delete"]}
        "/api/role/$id/activate/$value"         (controller: "role", action: "activate")
        "/api/role/$id/permissions"             (controller: "role", action: "permissions")
        //endregion

        //region PERMISSION
        "/api/permission"                       (controller: "permission")                      {action = [GET: "search"]}
        //endregion

        //region OWNED_ENTITY
        "/api/entity/user/$uid"                 (controller: "ownedEntity")                     {action = [GET: "search"]}
        "/api/entity"                           (controller: "ownedEntity")                     {action = [GET: "searchAll", PUT: "create"]}
        "/api/entity/$id"                       (controller: "ownedEntity")                     {action = [GET: "show", POST: "update", DELETE: "delete"]}
        "/api/entity/users/$id"                 (controller: "ownedEntity", action: "users")
        "/api/entity/get"                       (controller: "ownedEntity", action: "getBy")
        //endregion

        //region CONFIGURATION
        "/api/config/entity/last/$userId"       (controller: "configuration", action: "lastAccessedOwnedEntity")
        "/api/config"                           (controller: "configuration")                   {action = [GET: "getConfig", POST: "saveConfig"]}
        "/api/config/lan"                       (controller: "configuration")                   {action = [GET: "getLanguage", POST: "setLanguage"]}
        //endregion

        //default
        "/"(view:"/index")
        "500"(view:'/error')
        "404"(view:"/index")
    }
}
