package lk.ijse.wattpadbackend.service;

public interface UserMuteService {

    boolean addAMute(String name, long userId);

    boolean removeAMute(String name, long userId);
}
