class UrlMappings {

        static mappings = {

                //generic
                "/$controller/$action?/$id?(.$format)?"{
                        constraints {
                                // apply constraints here
                        }
                }


                //USER...
                "/api/user"                     (controller: "user")                            {action= [GET: "searchAll", PUT: "create"]}
                "/api/user/entity/$eid"         (controller: "user", action: "search")
                "/api/user/$id"                 (controller: "user")                            {action= [GET: "show", POST: "update", DELETE: "delete"]}
                "/api/user/$id/$eid/roles"      (controller: "user", action: "roles")
                "/api/user/$id/entities"        (controller: "user", action: "entities")
                "/api/user/get/$username"       (controller: "user", action: "getByUsername")

                //ROLE...
                "/api/role"                     (controller: "role")                            {action= [GET: "searchAll", PUT: "create"]}
                "/api/role/$uid/$eid"           (controller: "role", action: "search")
                "/api/role/$id"                 (controller: "role")                            {action= [GET: "show", POST: "update", DELETE: "delete"]}
                "/api/role/$id/permissions"     (controller: "role", action: "permissions")

                 //PERMISSION
                "/api/permission"               (controller: "permission")                      {action= [GET: "search"]}


                //OWNED_ENTITY...
                "/api/entity/user/$uid"         (controller: "ownedEntity")                     {action= [GET: "search", PUT: "create"]}
                "/api/entity"                   (controller: "ownedEntity")                     {action= [GET: "sea     rchAll"]}
                "/api/entity/$id"               (controller: "ownedEntity")                     {action= [GET: "show", POST: "update", DELETE: "delete"]}
                "/api/entity/$id/users"         (controller: "ownedEntity", action: "users")


                //CONFIGURATION
                "/api/config/entity/last"       (controller: "configuration", action: "lastAccessedOwnedEntity")
                
                //default
                "/"(view:"/index")
                "500"(view:'/error')
        }
}
