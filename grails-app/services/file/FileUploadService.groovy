package file

import grails.transaction.Transactional
import org.apache.commons.fileupload.FileItem
import org.apache.commons.fileupload.disk.DiskFileItem
import org.apache.commons.fileupload.disk.DiskFileItemFactory
import org.apache.commons.fileupload.servlet.ServletFileUpload

import javax.servlet.http.HttpServletRequest

@Transactional
class FileUploadService {

    /**
     * Returns all request items
     * @param request HttpServletRequest request which contains the items
     * @param config [optional] configuration for file handling
     * @return {@List<FileItem>} of items in the request
     * @throws Exception
     */
    List<FileItem> getRequestItems(HttpServletRequest request, Map config = null) {
        List<FileItem> items = []
        if (ServletFileUpload.isMultipartContent(request)) {
            DiskFileItemFactory factory = new DiskFileItemFactory() // Create a factory for disk-based file items
            if (config?.temporalDirectory) { factory.setRepository(config.temporalDirectory as File) }
            if (config?.maxMemorySize) { factory.setSizeThreshold(config.maxMemorySize as int) }

            ServletFileUpload upload = new ServletFileUpload(factory) // Create a new file upload handler
            if (config?.maxFileSize) { upload.setSizeMax(config.maxFileSize as long) }

            // Parse the request
            items = upload.parseRequest(request)
        }
        return items
    }

    /**
     * Returns all files contained in a request
     * @param items All items in a request
     * @return Only the files in the request
     */
    List<FileItem> getRequestFileItems(Collection<FileItem> items) {
        List<FileItem> justFileItems = []
        for (FileItem item in items) {
            if (!item.isFormField()) {
                justFileItems << item
            }
        }
        return justFileItems
    }

    /**
     * Returns all parameters (which are not files) contained in a request
     * @param items All items in a request
     * @return Only the parameters which are not files in the request
     */
    List<DiskFileItem> getRequestFormItems(Collection<DiskFileItem> items) {
        List<DiskFileItem> justFileItems = []
        for (DiskFileItem item in items) {
            if (item.isFormField()) {
                justFileItems << item
            }
        }
        return justFileItems
    }

    /**
     * Returns all parameters (which are not files) contained in a request returned as a Map
     * @param items All items in a request
     * @return Only the parameters which are not files in the request converted to a map
     */
    Map getRequestFormItemsAsMap(Collection<FileItem> items) {
        Map formElementsMap = [:]
        for (FileItem item in items) {
            if (item.isFormField()) {
                formElementsMap[item.getFieldName()] = item.getString()
            }
        }
        return formElementsMap
    }

}
