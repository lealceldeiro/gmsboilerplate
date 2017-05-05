package configuration

class BConfiguration implements Serializable{

    String param
    String value
    String userid

    static constraints = {
        param(nullable: false, blank: false)
        value(nullable: false, blank: false)
        userid(nullable: true, blank: false)
    }
}
