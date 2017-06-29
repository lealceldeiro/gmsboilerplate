package file

import exceptions.NotFoundException
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
                    name: fileName ?: user.id + '-' + file.name.substring(0, file.name.lastIndexOf('.')),
                    extension: FilenameUtils.getExtension(fileName ?: file.name),
                    size: bytes.size(),
                    userOwner: user,
                    type: fileType
            )
            if (eFile.save(flush: true, failOnError: true)) {
                eFile.name = eFile.id + '-' + eFile.name
                eFile.save()
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

    @Synchronized("lock")
    byte[] getFile(EFile file) {
        if (file) {
            EFileContent fileContent = EFileContent.findByFile(file)
            if (!fileContent) {
                throw new NotFoundException("general.not_found" ,"fileCamel", true)
            }
            return fileContent.content
        } else throw new NotFoundException("general.not_found" ,"fileCamel", true)
    }

    @Synchronized("lock")
    Boolean deleteFile(EFile file) {
        if(file) {
            EFileContent fileContent = EFileContent.findByFile(file)
            if (!fileContent) {
                throw new NotFoundException("general.not_found" ,"fileCamel", true)
            }
            fileContent.delete()
            file.delete()
        }
    }

}
