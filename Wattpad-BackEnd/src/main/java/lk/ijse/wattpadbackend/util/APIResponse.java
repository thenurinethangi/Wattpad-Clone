package lk.ijse.wattpadbackend.util;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class APIResponse {

    private int status;
    private String message;
    private Object data;

}
