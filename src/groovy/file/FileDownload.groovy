package file

import javax.servlet.ServletOutputStream

/**
 * Created by asiel on 29/06/17.
 */
trait FileDownload {

    static final String MODE_INLINE = "inline"
    static final String MODE_ATTACHMENT = "attachment"

    static final String DOCUMENT_TYPE_XLS = "XLS"

    /**
     * Puts a file in the response
     * @param file File to be served in the response
     * @param mode: One of attachment | inline
     * @return
     */
    def serveFile(File file, String mode) {
        if (!mode) {
            mode = MODE_INLINE
        }
        if (file) {
            response.setContentType(servletContext.getMimeType(file.name))
            response.setHeader("Content-Disposition", "${mode};filename=\"${file.name}\";")
            file.withInputStream { response.outputStream << it }
            response.outputStream.close()
        }
    }

    def printDocument(def data, String type, String name) {
        if(data) {
            String t = null
            String n = null
            switch (type){
                case DOCUMENT_TYPE_XLS:
                    t ="application/vnd.ms-excel"
                    n = name + ".xls"
                    break
            }
            if(t && n) {
                response.setContentType(t)
                response.setHeader("Content-disposition", "attachment; filename=" + n)

                ServletOutputStream f = response.getOutputStream()
                data.write(f)
                data.close()
                f.flush()
                f.close()
            }
        }
    }
}
