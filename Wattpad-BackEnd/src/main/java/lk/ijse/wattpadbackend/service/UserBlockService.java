package lk.ijse.wattpadbackend.service;

public interface UserBlockService {

    boolean addABlock(String name, long userId);

    boolean removeABlock(String name, long userId);
}
