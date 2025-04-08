package Club.Trace.ClubTraceApp.domain.attendance.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@Table(name = "qr_codes", uniqueConstraints = @UniqueConstraint(columnNames = "date"))
public class QR {
    @Id
    private String date;
    private String secret;

    public QR(String date,String secret){
        this.date =date;
        this.secret = secret;
    }


}
