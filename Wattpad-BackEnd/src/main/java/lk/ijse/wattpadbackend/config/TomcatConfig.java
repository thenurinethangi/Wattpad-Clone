package lk.ijse.wattpadbackend.config;

import org.apache.catalina.Context;
import org.apache.catalina.connector.Connector;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TomcatConfig {

    @Bean
    public TomcatServletWebServerFactory tomcatFactory() {
        return new TomcatServletWebServerFactory() {
            @Override
            protected void postProcessContext(Context context) {
                context.setAllowCasualMultipartParsing(true); // Optional
            }

            @Override
            protected void customizeConnector(Connector connector) {
                super.customizeConnector(connector);
                connector.setProperty("maxParameterCount", "1000");
                connector.setProperty("maxPostSize", "52428800"); // 50MB
                connector.setProperty("maxSavePostSize", "52428800");
                connector.setProperty("maxSwallowSize", "52428800");
            }
        };
    }
}
