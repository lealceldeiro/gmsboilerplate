grails.project.groupId = appName // change this to alter the default package name and Maven publishing destination

// The ACCEPT header will not be used for content negotiation for user agents containing the following strings (defaults to the 4 major rendering engines)
grails.mime.disable.accept.header.userAgents = ['Gecko', 'WebKit', 'Presto', 'Trident']
grails.mime.types = [ // the first one is the default format
    all:           '*/*', // 'all' maps to '*' or the first available format in withFormat
    atom:          'application/atom+xml',
    css:           'text/css',
    csv:           'text/csv',
    form:          'application/x-www-form-urlencoded',
    html:          ['text/html','application/xhtml+xml'],
    js:            'text/javascript',
    json:          ['application/json', 'text/json'],
    multipartForm: 'multipart/form-data',
    rss:           'application/rss+xml',
    text:          'text/plain',
    hal:           ['application/hal+json','application/hal+xml'],
    xml:           ['text/xml', 'application/xml']
]

// URL Mapping Cache Max Size, defaults to 5000
//grails.urlmapping.cache.maxsize = 1000

// Legacy setting for codec used to encode data with ${}
grails.views.default.codec = "html"

// The default scope for controllers. May be prototype, session or singleton.
// If unspecified, controllers are prototype scoped.
grails.controllers.defaultScope = 'singleton'

// GSP settings
grails {
    views {
        gsp {
            encoding = 'UTF-8'
            htmlcodec = 'xml' // use xml escaping instead of HTML4 escaping
            codecs {
                expression = 'html' // escapes values inside ${}
                scriptlet = 'html' // escapes output from scriptlets in GSPs
                taglib = 'none' // escapes output from taglibs
                staticparts = 'none' // escapes output from static template parts
            }
        }
        // escapes all not-encoded output at final stage of outputting
        // filteringCodecForContentType.'text/html' = 'html'
    }
}


grails.converters.encoding = "UTF-8"
// scaffolding templates configuration
grails.scaffolding.templates.domainSuffix = 'Instance'

// Set to false to use the new Grails 1.2 JSONBuilder in the render method
grails.json.legacy.builder = false
// enabled native2ascii conversion of i18n properties files
grails.enable.native2ascii = true
// packages to include in Spring bean scanning
grails.spring.bean.packages = []
// whether to disable processing of multi part requests
grails.web.disable.multipart=true

// request parameters to mask when logging exceptions
grails.exceptionresolver.params.exclude = ['password']
grails.exceptionresolver.params.exclude = ['pswrd']

// configure auto-caching of queries by default (if false you can cache individual queries with 'cache: true')
grails.hibernate.cache.queries = false

// configure passing transaction's read-only attribute to Hibernate session, queries and criterias
// set "singleSession = false" OSIV mode in hibernate configuration after enabling
grails.hibernate.pass.readonly = false
// configure passing read-only to OSIV session by default, requires "singleSession = false" OSIV mode
grails.hibernate.osiv.readonly = false

//ENV CONFIG
environments {
    test {
        grails.config.locations = [
                "file:grails-app/conf/hibernate/datasource-config.properties",
                "file:grails-app/conf/hibernate/datasource-config-test.properties",
                "file:grails-app/conf/custom/mail.properties"
        ]
    }
    development {
        grails.config.locations = [
                "file:grails-app/conf/hibernate/datasource-config.properties",
                "file:grails-app/conf/hibernate/datasource-config-development.properties",
                "file:grails-app/conf/custom/mail.properties"
        ]
    }
    production {
        grails.config.locations = [
                "classpath:datasource-config-production.properties",
                "classpath:datasource-config.properties",
                "classpath:mail.properties"
        ]
    }
}

// LOG4J CONFIGURATION
log4j.main = {
    error  'org.codehaus.groovy.grails.web.servlet',        // controllers
           'org.codehaus.groovy.grails.web.pages',          // GSP
           'org.codehaus.groovy.grails.web.sitemesh',       // layouts
           'org.codehaus.groovy.grails.web.mapping.filter', // URL mapping
           'org.codehaus.groovy.grails.web.mapping',        // URL mapping
           'org.codehaus.groovy.grails.commons',            // core / classloading
           'org.codehaus.groovy.grails.plugins',            // plugins
           'org.codehaus.groovy.grails.orm.hibernate',      // hibernate integration
           'org.springframework',
           'org.hibernate',
           'net.sf.ehcache.hibernate'
}

grails.databinding.dateFormats = [ "yyyy-MM-dd", "yyyy-MM-dd'T'hh:mm:ss'Z'" ]

//SPRING SECURITY
grails.plugin.springsecurity.userLookup.userDomainClassName = 'security.EUser'
grails.plugin.springsecurity.userLookup.authorityJoinClassName = 'security.BRole'
grails.plugin.springsecurity.authority.className = 'security.BPermission'
grails.plugin.springsecurity.authority.nameField = 'name'

//names in which the credentials will be received from the request
grails.plugin.springsecurity.rest.login.usernamePropertyName = 'usrnm'  //username
grails.plugin.springsecurity.rest.login.passwordPropertyName = 'pswrd'  //password

// name defined for all permissions granted to the user
grails.plugin.springsecurity.rest.token.rendering.authoritiesPropertyName = "permissions"

//how filters are going to be applied
grails.plugin.springsecurity.filterChain.chainMap = [
        '/api/**': 'JOINED_FILTERS,-exceptionTranslationFilter,-authenticationProcessingFilter,-securityContextPersistenceFilter,-rememberMeAuthenticationFilter',  // Stateless chain
//        '/**': 'JOINED_FILTERS,-restTokenValidationFilter,-restExceptionTranslationFilter'                                                                          // Traditional chain
]

grails.plugin.springsecurity.controllerAnnotations.staticRules = [
        '/'                 : ['permitAll'],
        '/index'            : ['permitAll'],
        '/index.gsp'        : ['permitAll'],
        '/assets/**'        : ['permitAll'],
        '/apiDoc/**'        : ['permitAll'],
        '/**/js/**'         : ['permitAll'],
        '/**/css/**'        : ['permitAll'],
        '/**/images/**'     : ['permitAll'],
        '/**/favicon.ico'   : ['permitAll'],
        '/api/login'        : ['permitAll']
]

grails.assets.excludes = ["bower_components/**/*", "app/**/*.html", "app/**/*.json", "bower.json"]
grails.assets.includes = [
        "bower_components/angular/angular.min.js",
        "bower_components/angular-animate/angular-animate.min.js",
        "bower_components/angular-aria/angular-aria.min.js",
        "bower_components/angular-local-storage/dist/angular-local-storage.min.js",
        "bower_components/angular-material/angular-material.min.js",
        "bower_components/angular-material/angular-material.min.css",
        "bower_components/angular-material-sidemenu/dest/angular-material-sidemenu.js",
        "bower_components/angular-material-sidemenu/dest/angular-material-sidemenu.css",
        "bower_components/angular-messages/angular-messages.min.js",
        "bower_components/angular-route/angular-route.min.js",
        "bower_components/angular-sanitize/angular-sanitize.min.js",
        "bower_components/angular-translate/angular-translate.min.js",
        "bower_components/angular-translate-interpolation-messageformat/angular-translate-interpolation-messageformat.js",
        "bower_components/jquery/dist/jquery.min.js",
        "bower_components/lodash/lodash.min.js",
        "bower_components/material-angular-paging/build/dist.min.js",
        "bower_components/MDBootstrap/js/tether.min.js",
        "bower_components/MDBootstrap/js/bootstrap.min.js",
        "bower_components/MDBootstrap/js/mdb.min.js",
        "bower_components/MDBootstrap/css/bootstrap.min.css",
        "bower_components/MDBootstrap/css/mdb.min.css",
        "bower_components/MDBootstrap/font/**/*",
        "bower_components/messageformat/messageformat.min.js",
        "bower_components/ng-file-upload-shim/ng-file-upload-shim.min.js",
        "bower_components/ng-file-upload/ng-file-upload.min.js",
        "bower_components/ng-password-strength/dist/scripts/ng-password-strength.min.js"
]