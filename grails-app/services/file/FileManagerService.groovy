package file

import exceptions.ValidationsException
import grails.transaction.Transactional
import groovy.transform.Synchronized
import org.apache.commons.fileupload.FileItem
import org.apache.commons.io.FilenameUtils
import security.EUser

@Transactional
class FileManagerService {

    private final lock = new Object()

    @Synchronized("lock")
    EFile saveFile(FileItem file, EUser user, String fileType = EFile.GENERIC, String fileName = null) {
        if (file) {
            byte[] bytes = file.get()
            EFile eFile = new EFile(
                    name: fileName ?: file.name,
                    extension: FilenameUtils.getExtension(fileName ?: file.name),
                    size: bytes.size(),
                    userOwner: user,
                    type: fileType
            )
            if (eFile.save()) {
                EFileContent fileContent = new EFileContent(
                        file: eFile,
                        content: bytes
                )
                if (fileContent.save()) {
                    return eFile
                }
            }
        }
        else throw new ValidationsException()
        return null
    }
}
