package file

/**
 * Created by asiel on 29/06/17.
 */
trait EFileDownload extends FileDownload{

    /**
     * Returns the file handler service
     *
     * Controllers which implement this trait must have injected the fileManagerService and the
     * method <code>getEFileManager</code> must return the injected instance
     * @return injected <code>fileManagerService</code>
     */
    abstract FileManagerService getEFileManager()

    /**
     * Returns a file for being downloaded
     * @param eFile EFile instance
     * @param mode: One of attachment | inline
     * @return EFile instance for being downloaded
     */
    def downloadFile(EFile eFile, String mode) {
        if(eFile) {
            byte[] bytes = getEFileManager().getFile(eFile)
            File tempFile = File.createTempFile(eFile.name, '.' + eFile.extension, null)
            FileOutputStream fos = new FileOutputStream(tempFile)
            fos.write(bytes)
            serveFile(tempFile, mode)
        }
    }

    /**
     * Returns a file for being downloaded to a specific path
     * @param eFile EFile instance
     * @param mode: One of attachment | inline
     * @params filePath specific path where the file will be downloaded
     * @return EFile instance for being downloaded
     */
    def downloadFile(EFile eFile, String mode, String filePath) {
        if(eFile) {
            byte[] bytes = getEFileManager().getFile(eFile)
            File tempFile = new File(filePath)
            FileOutputStream fos = new FileOutputStream(tempFile)
            fos.write(bytes)
            serveFile(tempFile, mode)
        }
    }
}
