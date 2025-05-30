package sv.edu.udb;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "sv.edu.udb.panventury_service.repository")
@EntityScan(basePackages = "sv.edu.udb.panventury_service.model")
public class PanventoryApplication {

	public static void main(String[] args) {
		SpringApplication.run(PanventoryApplication.class, args);
	}

}
