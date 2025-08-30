package lk.ijse.wattpadbackend.service;

public interface FollowService {

    void makeAFollow(String name, long userId);

    void removeAFollow(String name, long userId);
}
