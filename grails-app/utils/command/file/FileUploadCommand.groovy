package command.file

import grails.validation.Validateable
import org.apache.commons.fileupload.FileItem
import org.apache.commons.fileupload.disk.DiskFileItem

/**
 * Created by asiel on 28/06/17.
 */
@Validateable
class FileUploadCommand {

    Long userId
    List<FileItem> files
    List<String> fileNames

    static constraints = {
        userId nullable: false, blank: false
        files nullable: true, blank: false
        fileNames nullable: true, blank: false
    }

    Boolean isValid(){
        if(files != null && !files.isEmpty()) {
            if(fileNames != null && !fileNames.isEmpty()) {
                return files.size() == fileNames.size()
            }
            else return true
        }

        return false
    }
}
