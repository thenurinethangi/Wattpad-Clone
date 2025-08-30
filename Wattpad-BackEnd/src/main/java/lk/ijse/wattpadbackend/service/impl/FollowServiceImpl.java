package lk.ijse.wattpadbackend.service.impl;

import lk.ijse.wattpadbackend.entity.Following;
import lk.ijse.wattpadbackend.entity.User;
import lk.ijse.wattpadbackend.exception.UserNotFoundException;
import lk.ijse.wattpadbackend.repository.FollowingRepository;
import lk.ijse.wattpadbackend.repository.UserRepository;
import lk.ijse.wattpadbackend.service.FollowService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FollowServiceImpl implements FollowService {

    private final FollowingRepository followingRepository;
    private final UserRepository userRepository;

    @Override
    public void makeAFollow(String name, long userId) {

        try{
            User user = userRepository.findByUsername(name);
            if(user==null){
                throw new UserNotFoundException("User not found");
            }

            Optional<User> optionalUser = userRepository.findById((int) userId);
            if(!optionalUser.isPresent()){
                throw new UserNotFoundException("User not found");
            }
            User followingUser = optionalUser.get();

            Following following = new Following();
            following.setUser(followingUser);
            following.setFollowedUserId(user.getId());

            followingRepository.save(following);

        }
        catch (UserNotFoundException e) {
            throw e;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void removeAFollow(String name, long userId) {

        try{
            User user = userRepository.findByUsername(name);
            if(user==null){
                throw new UserNotFoundException("User not found");
            }

            Optional<User> optionalUser = userRepository.findById((int) userId);
            if(!optionalUser.isPresent()){
                throw new UserNotFoundException("User not found");
            }
            User followingUser = optionalUser.get();

            Following following = followingRepository.findByFollowedUserIdAndUser(user.getId(),followingUser);
            System.out.println("=================");
            System.out.println(following);

            followingRepository.delete(following);

        }
        catch (UserNotFoundException e) {
            throw e;
        }
        catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }
}










