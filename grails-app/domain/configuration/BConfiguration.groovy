package configuration

class BConfiguration implements Serializable{

    String param
    String value

    static constraints = {

        param(nullable: false, blank: false, unique: true)
        value(nullable: false, blank: false)
    }
}
