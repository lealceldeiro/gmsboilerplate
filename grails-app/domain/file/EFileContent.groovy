package file

import jdbc.explorer.JDBCExplorer

class EFileContent {

    byte[] content

    static belongsTo = [file: EFile]

    static constraints = {
        file nullable: false, unique: true
        content nullable: false
    }

    static mapping = {
        content sqlType: "${JDBCExplorer.getFileDataType()}"
    }
}
