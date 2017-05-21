// Place your Spring DSL code here
beans = {
    credentialsExtractor(DefaultJsonPayloadCredentialsExtractor) {
        userService = ref("userService")
    }
}
