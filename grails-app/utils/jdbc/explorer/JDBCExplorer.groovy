package jdbc.explorer

import grails.util.Environment
import org.codehaus.groovy.grails.io.support.ClassPathResource

/**
 * Created by asiel on 27/06/17.
 */
class JDBCExplorer {


    static String driverClassName

    static void loadDriverClassName() {
        try {
            Properties properties = new Properties()
            if (Environment.current == Environment.DEVELOPMENT) {
                properties.load(new ClassPathResource("datasource-config.properties").getInputStream())
                driverClassName = properties.getProperty("dataSource.driverClassName")
            } else {
                properties.load(new ClassPathResource("application.properties").getInputStream())
                driverClassName = properties.getProperty("app.datasource.driverClassName")
            }
        } catch (IOException e) { e.printStackTrace() }
    }

    private static void checkDriverClassName() {
        if (driverClassName == null || driverClassName == "") { loadDriverClassName() }
    }

    static String getLongTextDataType() {
        checkDriverClassName()
        String dType = "CLOB"
        if (driverClassName.equalsIgnoreCase("org.postgresql.Driver")) {
            dType = "text"
        } else if (driverClassName.equalsIgnoreCase("com.ibm.db2.jcc.DB2Driver")){
            dType = "clob"
        }
        return dType
    }

    static String getMiddleTextDataType() {
        checkDriverClassName()
        String dType = "VARCHAR2(4000)"
        if (driverClassName.equalsIgnoreCase("org.postgresql.Driver")) {
            dType = "text"
        }else if (driverClassName.equalsIgnoreCase("com.ibm.db2.jcc.DB2Driver")){
            dType = "clob"
        }
        return dType
    }

    static String getBooleanDataType() {
        checkDriverClassName()
        String dType = "number (1,0)"
        if (driverClassName.equalsIgnoreCase("org.postgresql.Driver")) {
            dType = "boolean"
        } else if (driverClassName.equalsIgnoreCase("com.ibm.db2.jcc.DB2Driver")){
            dType = "SMALLINT"
        }
        return dType
    }

    static String getFileDataType() {
        checkDriverClassName()
        String dType = "blob"
        if (driverClassName.equalsIgnoreCase("org.postgresql.Driver")) {
            dType = "bytea"
        }
        return dType
    }
}
