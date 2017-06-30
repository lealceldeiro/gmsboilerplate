// Place your Spring DSL code here
beans = {
    credentialsExtractor(DefaultJsonPayloadCredentialsExtractor) {
        //register userService as available service for DefaultJsonPayloadCredentialsExtractor so, it can be used there
        userService = ref("userService")
    }
}
